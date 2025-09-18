// server.js

import http from "http"
import type { RealtimeServerEvent } from "openai/resources/realtime/realtime.js"
import { azure } from "@ai-sdk/azure"
import { generateObject } from "ai"
import express from "express"
import { Server } from "socket.io"
import WebSocket from "ws"

import type { LearningLanguageLevel, RoleplaySessionMessage } from "@acme/db"
import { prisma, RoleplaySessionMessageRole } from "@acme/db"
import { ZFeedbackSchema, ZPracticeSchema } from "@acme/validators"

import { env } from "~/env.server"
import { auth } from "./auth"

// Express setup
const app = express()
const server = http.createServer(app)
const io = new Server(server)

type GetFeedbackProps = {
  transcript: string
  learningLanguage: string
  nativeLanguage: string
  difficulty: LearningLanguageLevel
  roleplaySessionMessages: RoleplaySessionMessage[]
}

// Comprehensive feedback function combining grammar checking and detailed feedback
async function getFeedback({ transcript, learningLanguage, nativeLanguage, difficulty, roleplaySessionMessages }: GetFeedbackProps) {
  const messages = roleplaySessionMessages
    .map((message) => {
      return JSON.stringify({ role: message.role, content: message.content })
    })
    .join("\n")
  const { object } = await generateObject({
    model: azure("gpt-4o-mini"),
    schemaName: "feedback",
    schema: ZFeedbackSchema,
    prompt: `You are an expert language tutor providing comprehensive feedback for someone learning ${learningLanguage} (their native language is ${nativeLanguage}).

CRITICAL: ALL feedback messages, explanations, and detailed feedback MUST be written in ${nativeLanguage} (the user's native language).

IMPORTANT: This text comes from ORAL CONVERSATION, not written text. It's a speech transcript from someone speaking naturally. Adapt your feedback for spoken language patterns, not formal writing standards.

LEARNER PROFILE:
- Learning language: ${learningLanguage} (BCP 47 language tag (ISO 639 + ISO 3166)
- Native language: ${nativeLanguage} (BCP 47 language tag (ISO 639 + ISO 3166)
- Difficulty level: ${difficulty} (Beginner, Intermediate, Advanced, Proficient, Fluent)
- Text source: ORAL CONVERSATION TRANSCRIPT (speech-to-text conversion)

CONTEXT:
${messages ? `Previous conversation context: ${messages}` : "No previous context available"}

TEXT TO ANALYZE: "${transcript}"

FEEDBACK REQUIREMENTS:

1. OVERALL QUALITY (1-100): Evaluate overall correctness and appropriateness
2. FEEDBACK: Provide concise, friendly feedback (maximum 2-3 sentences) focusing on the most important issues while being constructive and supportive. Avoid generic encouragement phrases like "Great effort!", "Keep practicing!", or "You're doing well!" (in ${nativeLanguage})
3. CORRECTED PHRASE: Provide the complete corrected version
4. CORRECTIONS ARRAY: For each mistake, provide:
   - "wrong": the incorrect part from the original text
   - "correct": the corrected version of that part
   - "explanation": a clear, concise explanation for the correction
   Example: { "wrong": "Je appelle", "correct": "Je m'appelle" }

5. DETAILED SCORING (all messages in ${nativeLanguage}):
   - ACCURACY (1-100): Grammar, syntax, word choice correctness - provide helpful guidance on specific issues found
   - FLUENCY (1-100): How natural and smooth the expression sounds - offer friendly suggestions for improvement
   - VOCABULARY (1-100): Appropriateness and variety of word choices - suggest alternatives in a supportive way

FOCUS AREAS FOR ORAL CONVERSATION:
✅ Grammar mistakes that affect meaning or sound unnatural in speech
✅ Vocabulary errors or unnatural word choices for spoken language
✅ Sentence structure issues that disrupt conversational flow
✅ Appropriateness for oral communication at this difficulty level
✅ Natural spoken expression vs. literal translation from native language
✅ Pronunciation-related grammar issues (liaisons, contractions, etc.)

IGNORE (COMMON IN ORAL SPEECH):
❌ Punctuation/capitalization (transcript artifacts)
❌ Filler words ("um", "uh", "like", "euh", etc.)
❌ Minor transcription errors or misheard words
❌ Acceptable informal speech patterns and colloquialisms
❌ Incomplete sentences that are natural in conversation
❌ Repetitions or self-corrections during speech
❌ Casual contractions and spoken shortcuts

TONE: Be friendly, supportive, and educational while remaining specific and actionable. Focus on helping the learner improve their SPOKEN language skills through constructive guidance. Remember this is oral communication, not academic writing. Avoid generic praise but maintain a warm, encouraging approach. Write ALL feedback in ${nativeLanguage}.`,
    temperature: 0.3,
  })

  return object
}

// Socket.io setup
io.on("connection", async (socket) => {
  const bearerToken = socket.handshake.headers.authorization

  if (!bearerToken) {
    console.error("No bearer token found")
    socket.disconnect()
    return
  }

  const session = await auth.api.getSession({
    headers: new Headers({ Authorization: bearerToken }),
  })

  if (!session) {
    socket.disconnect()
    return
  }

  const profile = await prisma.profile.findUnique({ where: { userId: session.user.id } })

  if (!profile) {
    console.error("Could not find profile")
    socket.disconnect()
    return
  }

  // Either roleplay or lesson
  const practice = socket.handshake.query.practice
  if (!practice) {
    console.error("Could not find practice query")
    socket.disconnect()
    return
  }

  if (typeof practice !== "string") {
    console.error("Practice is of wrong type")
    socket.disconnect()
    return
  }

  const parsedPractice = ZPracticeSchema.safeParse(JSON.parse(practice))

  if (!parsedPractice.success) {
    console.error("Could not parse practice data")
    socket.disconnect()
    return
  }

  if (!parsedPractice.data.roleplaySessionId) {
    console.error("Could not parse practice roleplaySessionId")
    socket.disconnect()
    return
  }

  const roleplaySession = await prisma.roleplaySession.findUnique({
    where: { id: parsedPractice.data.roleplaySessionId },
  })

  if (!roleplaySession) {
    console.error("Could not find roleplay session")
    socket.disconnect()
    return
  }

  if (roleplaySession.profileId !== profile.id) {
    console.error(
      `Roleplay session does not belong to user, profileId: ${roleplaySession.profileId}, userId: ${session.user.id}, roleplaySessionId: ${parsedPractice.data.roleplaySessionId}`,
    )
    socket.disconnect()
    return
  }

  // Track session start time for 5-minute timeout
  const sessionStartTime = Date.now()
  const SESSION_TIMEOUT_MS = 5 * 60 * 1000 // 5 minutes

  console.log(`Session started for user: ${session.user.id} and sessionId: ${roleplaySession.id} at time: ${sessionStartTime}`)

  let sessionEnded = false

  // Speaking duration tracking
  let totalUserSpeakingDuration = 0 // in seconds
  let totalAiSpeakingDuration = 0 // in seconds

  // Helper function to calculate audio duration from PCM16 audio data
  const calculateAudioDuration = (audioBuffer: Int16Array, sampleRate = 24000): number => {
    // PCM16 audio duration = number of samples / sample rate
    const durationSeconds = audioBuffer.length / sampleRate
    return durationSeconds
  }

  // Helper function to parse WAV header and extract PCM data
  const parseWAVFile = (wavBuffer: ArrayBuffer): { pcmData: Int16Array; sampleRate: number; channels: number; bitsPerSample: number } => {
    const view = new DataView(wavBuffer)

    // Check RIFF header
    const riff = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3))
    if (riff !== "RIFF") {
      console.error("Invalid WAV file: missing RIFF header")
      return { pcmData: new Int16Array(0), sampleRate: 24000, channels: 1, bitsPerSample: 16 }
    }

    // Check WAVE header
    const wave = String.fromCharCode(view.getUint8(8), view.getUint8(9), view.getUint8(10), view.getUint8(11))
    if (wave !== "WAVE") {
      console.error("Invalid WAV file: missing WAVE header")
      return { pcmData: new Int16Array(0), sampleRate: 24000, channels: 1, bitsPerSample: 16 }
    }

    // Find fmt chunk (usually at offset 12)
    let offset = 12
    while (offset < wavBuffer.byteLength - 8) {
      const chunkId = String.fromCharCode(view.getUint8(offset), view.getUint8(offset + 1), view.getUint8(offset + 2), view.getUint8(offset + 3))
      const chunkSize = view.getUint32(offset + 4, true) // little endian

      if (chunkId === "fmt ") {
        // Parse format chunk
        const _audioFormat = view.getUint16(offset + 8, true)
        const channels = view.getUint16(offset + 10, true)
        const sampleRate = view.getUint32(offset + 12, true)
        const bitsPerSample = view.getUint16(offset + 22, true)

        // Find data chunk
        let dataOffset = offset + 8 + chunkSize
        while (dataOffset < wavBuffer.byteLength - 8) {
          const dataChunkId = String.fromCharCode(
            view.getUint8(dataOffset),
            view.getUint8(dataOffset + 1),
            view.getUint8(dataOffset + 2),
            view.getUint8(dataOffset + 3),
          )
          const dataSize = view.getUint32(dataOffset + 4, true)

          if (dataChunkId === "data") {
            // Extract PCM data
            const pcmData = new Int16Array(wavBuffer, dataOffset + 8, dataSize / 2) // divide by 2 for 16-bit samples
            return { pcmData, sampleRate, channels, bitsPerSample }
          }

          dataOffset += 8 + dataSize
        }

        console.error("Data chunk not found in WAV file")
        return { pcmData: new Int16Array(0), sampleRate, channels, bitsPerSample }
      }

      offset += 8 + chunkSize
    }

    console.error("fmt chunk not found in WAV file")
    return { pcmData: new Int16Array(0), sampleRate: 24000, channels: 1, bitsPerSample: 16 }
  }

  const checkSessionTimeout = () => {
    const elapsed = Date.now() - sessionStartTime
    return elapsed >= SESSION_TIMEOUT_MS
  }

  // Shared function to update session duration
  const updateSessionDuration = async () => {
    const currentTime = Date.now()
    const currentDuration = Math.floor((currentTime - sessionStartTime) / 1000) // duration in seconds

    console.log(
      `Session: ${currentDuration}s total, user spoke: ${totalUserSpeakingDuration.toFixed(1)}s, AI spoke: ${totalAiSpeakingDuration.toFixed(1)}s`,
    )

    await prisma.roleplaySession.update({
      where: { id: roleplaySession.id },
      data: {
        duration: currentDuration,
        userSpeakingDuration: totalUserSpeakingDuration,
        aiSpeakingDuration: totalAiSpeakingDuration,
      },
    })
    return currentDuration
  }

  const endSession = async () => {
    if (sessionEnded) return
    sessionEnded = true

    // Update final duration before ending
    const finalDuration = await updateSessionDuration()

    console.log(`Session ended after ${finalDuration}s for user: ${session.user.id}`)
    socket.emit("sessionEnded")
    socket.disconnect()
  }

  // Set up automatic session timeout
  const timeoutTimer = setTimeout(() => {
    void endSession()
  }, SESSION_TIMEOUT_MS)

  const url = "wss://api.openai.com/v1/realtime?model=gpt-4o-mini-realtime-preview"
  const ws = new WebSocket(url, {
    headers: {
      Authorization: "Bearer " + env.OPENAI_API_KEY,
    },
  })

  ws.on("open", function open() {
    console.log("Connected to server.")

    // Initialize session
    ws.send(
      JSON.stringify({
        type: "session.update",
        session: {
          type: "realtime",
          model: "gpt-4o-mini-realtime-preview",
          audio: {
            input: {
              format: {
                type: "audio/pcm",
                rate: 24000,
              },
              transcription: {
                model: "whisper-1",
              },
              turn_detection: null,
            },
            output: {
              format: {
                type: "audio/pcm",
                rate: 24000,
              },
              voice: "ballad",
            },
          },
          instructions: "Speak clearly and briefly. Confirm understanding before taking actions.",
        },
      }),
    )
  })

  const handleMessage = async (message: WebSocket.RawData) => {
    let messageString: string
    if (Buffer.isBuffer(message)) {
      messageString = message.toString("utf8")
    } else if (message instanceof ArrayBuffer) {
      messageString = Buffer.from(message).toString("utf8")
    } else {
      messageString = String(message)
    }
    const parsedMessage = JSON.parse(messageString) as RealtimeServerEvent

    switch (parsedMessage.type) {
      case "error": {
        console.error("Error", parsedMessage)
        break
      }
      case "conversation.item.added": {
        console.log("conversation.item.added")

        if (parsedMessage.item.type === "message" && parsedMessage.item.role === "user") {
          socket.emit("userTextDelta", {
            id: parsedMessage.item.id,
            delta: "", // Empty delta to add placeholder while waiting for transcript
          })
        }

        break
      }
      case "conversation.item.done": {
        console.log("conversation.item.done")
        break
      }
      case "conversation.item.input_audio_transcription.delta": {
        console.log("conversation.item.input_audio_transcription.delta")
        socket.emit("userTextDelta", {
          id: parsedMessage.item_id,
          delta: parsedMessage.delta,
        })
        break
      }
      case "conversation.item.input_audio_transcription.completed": {
        console.log("conversation.item.input_audio_transcription.completed")

        // Store user message
        const userMessage = await prisma.roleplaySessionMessage.create({
          data: {
            sessionId: roleplaySession.id,
            role: RoleplaySessionMessageRole.USER,
            content: parsedMessage.transcript,
          },
        })

        const roleplayScenarioMessages = await prisma.roleplaySessionMessage.findMany({
          where: { sessionId: roleplaySession.id },
        })

        const feedbackResult = await getFeedback({
          transcript: parsedMessage.transcript,
          learningLanguage: profile.learningLanguage,
          nativeLanguage: profile.nativeLanguage,
          difficulty: profile.learningLanguageLevel,
          roleplaySessionMessages: roleplayScenarioMessages,
        })

        // Update user message with feedback
        await prisma.roleplaySessionMessage.update({
          where: { id: userMessage.id },
          data: {
            feedback: feedbackResult,
          },
        })

        await updateSessionDuration()

        // Emit comprehensive feedback result
        socket.emit("feedback", {
          messageId: parsedMessage.item_id,
          feedback: feedbackResult,
        })

        break
      }
      case "session.created": {
        console.log("session.created")
        break
      }
      case "session.updated": {
        console.log("session.updated")
        break
      }
      case "input_audio_buffer.speech_started": {
        console.log("input_audio_buffer.speech_started")
        break
      }
      case "input_audio_buffer.speech_stopped": {
        console.log("input_audio_buffer.speech_stopped")
        break
      }
      case "input_audio_buffer.committed": {
        console.log("input_audio_buffer.committed")
        break
      }
      case "response.created": {
        console.log("response.created")
        break
      }
      case "response.output_item.added": {
        console.log("response.output_item.added")
        break
      }
      case "response.content_part.added": {
        console.log("response.content_part.added")
        break
      }
      case "response.output_audio.delta": {
        console.log("response.output_audio.delta")

        // Calculate AI speaking duration from audio delta
        if (parsedMessage.delta) {
          // Decode base64 audio to get the raw audio data
          const audioBuffer = Buffer.from(parsedMessage.delta, "base64")
          if (audioBuffer.byteLength > 0) {
            // Convert to Int16Array for PCM16 analysis (OpenAI returns PCM16 at 24kHz)
            const audioArray = new Int16Array(audioBuffer.buffer, audioBuffer.byteOffset, audioBuffer.byteLength / 2)
            const audioDuration = calculateAudioDuration(audioArray, 24000)
            totalAiSpeakingDuration += audioDuration
          }
        }

        // Forward audio chunk to client
        socket.emit("assistantAudioDelta", {
          id: parsedMessage.item_id,
          delta: parsedMessage.delta,
        })
        break
      }
      case "response.output_audio.done": {
        console.log("response.output_audio.done")
        // Signal end of audio stream
        socket.emit("assistantAudioDone", {
          id: parsedMessage.item_id,
        })

        break
      }
      case "response.output_audio_transcript.delta": {
        console.log("response.output_audio_transcript.delta")

        socket.emit("assistantTextDelta", {
          id: parsedMessage.item_id,
          delta: parsedMessage.delta,
        })
        break
      }
      case "response.output_audio_transcript.done": {
        console.log("response.output_audio_transcript.done")

        await prisma.roleplaySessionMessage.create({
          data: {
            sessionId: roleplaySession.id,
            role: RoleplaySessionMessageRole.ASSISTANT,
            content: parsedMessage.transcript,
          },
        })
        break
      }
      case "response.output_text.delta": {
        console.log("response.output_text.delta")
        break
      }
      case "response.output_text.done": {
        console.log("response.output_text.done")
        break
      }
      case "response.content_part.done": {
        console.log("response.content_part.done")
        break
      }
      case "response.output_item.done": {
        console.log("response.output_item.done")
        break
      }
      case "response.done": {
        console.log("response.done")
        break
      }
      case "rate_limits.updated": {
        console.log("rate_limits.updated")
        break
      }
      default: {
        console.log(parsedMessage.type, " - unhandled event")
        break
      }
    }
  }

  ws.on("message", (message) => {
    void handleMessage(message)
  })

  // Handle complete audio data from the client
  socket.on("completeAudio", (audioBase64: string) => {
    // Check session timeout before processing
    if (checkSessionTimeout()) {
      void endSession()
      return
    }

    // Calculate user speaking duration from the actual audio data
    // Convert base64 to Buffer then to ArrayBuffer for WAV parsing
    const audioBuffer = Buffer.from(audioBase64, "base64")
    const arrayBuffer = audioBuffer.buffer.slice(audioBuffer.byteOffset, audioBuffer.byteOffset + audioBuffer.byteLength)

    // Parse WAV file and extract PCM data with correct parameters
    const { pcmData, sampleRate } = parseWAVFile(arrayBuffer)

    if (pcmData.length > 0) {
      // Calculate duration using actual sample rate from WAV file
      const audioDuration = calculateAudioDuration(pcmData, sampleRate)
      totalUserSpeakingDuration += audioDuration
      console.log(`User spoke for ${audioDuration.toFixed(2)}s, total: ${totalUserSpeakingDuration.toFixed(2)}s`)
    }

    // Append the audio data to the buffer
    ws.send(
      JSON.stringify({
        type: "input_audio_buffer.append",
        audio: audioBase64,
      }),
    )

    // Commit the audio buffer to create a user message
    ws.send(
      JSON.stringify({
        type: "input_audio_buffer.commit",
      }),
    )

    // Create a response from the model
    ws.send(
      JSON.stringify({
        type: "response.create",
      }),
    )

    ws.send(
      JSON.stringify({
        type: "input_audio_buffer.clear",
      }),
    )
  })

  // Handle cancel response requests from the client
  socket.on("cancelResponse", () => {
    try {
      // Send cancel response to OpenAI WebSocket
      ws.send(
        JSON.stringify({
          type: "response.cancel",
        }),
      )
    } catch (error) {
      console.error("Error canceling response:", error)
    }
  })

  // Handle text messages from the user
  socket.on("userMessage", (_message: string) => {
    // Check session timeout before processing
    if (checkSessionTimeout()) {
      void endSession()
      return
    }

    // TODO: Handle user text message

    return

    /*  // Store user text message
    await prisma.roleplaySessionMessage.create({
      data: {
        sessionId: roleplaySession.id,
        role: RoleplaySessionMessageRole.USER,
        content: message,
      },
    })

    ws.send(
      JSON.stringify({
        type: "conversation.item.create",
        item: {
          type: "message",
          role: "user",
          content: [
            {
              type: "input_text",
              text: message,
            },
          ],
        },
      }),
    )

    ws.send(
      JSON.stringify({
        type: "response.create",
        response: {
          output_modalities: ["text"],
        },
      }),
    ) */
  })

  // Handle manual session end from client
  socket.on("endSession", async () => {
    await endSession()
  })

  socket.on("disconnect", () => {
    clearTimeout(timeoutTimer)
    ws.close()
  })
})

// Start server

const PORT = 3002
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
