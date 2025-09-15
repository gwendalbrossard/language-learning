// server.js

import http from "http"
import { azure } from "@ai-sdk/azure"
import { RealtimeClient } from "@openai/realtime-api-beta"
import { generateObject } from "ai"
import express from "express"
import { Server } from "socket.io"
import WebSocket from "ws"

import { prisma, RoleplaySessionMessageRole } from "@acme/db"
import { ZFeedbackSchema, ZPracticeSchema } from "@acme/validators"

import type { EventHandlerResult, Realtime } from "./types"
import { env } from "~/env.server"
import { auth } from "./auth"

// Express setup
const app = express()
const server = http.createServer(app)
const io = new Server(server)

// OpenAI model configuration for grammar checking
const azureOpenaiModel = azure("gpt-4o-mini")

// Comprehensive feedback function combining grammar checking and detailed feedback
async function getFeedback(text: string, learningLanguage: string, userLanguage: string, previousContext?: string, difficulty = "A1") {
  const { object } = await generateObject({
    model: azureOpenaiModel,
    schemaName: "feedback",
    schema: ZFeedbackSchema,
    prompt: `You are an expert language tutor providing comprehensive feedback for someone learning ${learningLanguage} (their native language is ${userLanguage}).

CRITICAL: ALL feedback messages, explanations, and detailed feedback MUST be written in ${userLanguage} (the user's native language).

IMPORTANT: This text comes from ORAL CONVERSATION, not written text. It's a speech transcript from someone speaking naturally. Adapt your feedback for spoken language patterns, not formal writing standards.

LEARNER PROFILE:
- Learning language: ${learningLanguage} (ISO code)
- Native language: ${userLanguage} (ISO code)
- Difficulty level: ${difficulty} (CEFR)
- Text source: ORAL CONVERSATION TRANSCRIPT (speech-to-text conversion)

CONTEXT:
${previousContext ? `Previous conversation context: ${previousContext}` : "No previous context available"}

TEXT TO ANALYZE: "${text}"

FEEDBACK REQUIREMENTS:

1. OVERALL QUALITY (1-100): Evaluate overall correctness and appropriateness
2. FEEDBACK: Provide concise, friendly feedback (maximum 2-3 sentences) focusing on the most important issues while being constructive and supportive. Avoid generic encouragement phrases like "Great effort!", "Keep practicing!", or "You're doing well!" (in ${userLanguage})
3. CORRECTED PHRASE: Provide the complete corrected version
4. CORRECTIONS ARRAY: For each mistake, provide:
   - "wrong": the incorrect part from the original text
   - "correct": the corrected version of that part
   - "explanation": a clear, concise explanation for the correction
   Example: { "wrong": "Je appelle", "correct": "Je m'appelle" }

5. DETAILED SCORING (all messages in ${userLanguage}):
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

TONE: Be friendly, supportive, and educational while remaining specific and actionable. Focus on helping the learner improve their SPOKEN language skills through constructive guidance. Remember this is oral communication, not academic writing. Avoid generic praise but maintain a warm, encouraging approach. Write ALL feedback in ${userLanguage}.`,
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

  const url = "wss://api.openai.com/v1/realtime?model=gpt-realtime"
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
          model: "gpt-realtime",
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

  ws.on("message", async function incoming(message) {
    const parsedMessage = JSON.parse(message.toString())
    const type = parsedMessage.type as string

    switch (type) {
      case "error":
        console.error("Error", parsedMessage)
        break
      case "conversation.item.added":
        console.log("conversation.item.added")
        socket.emit("displayUserMessage", {
          id: parsedMessage.item_id,
          delta: "(item sent)",
        })
        break
      case "conversation.item.input_audio_transcription.delta":
        console.log("conversation.item.input_audio_transcription.delta")
        socket.emit("displayUserMessage", {
          id: parsedMessage.item_id,
          delta: parsedMessage.delta,
        })
        break
      case "conversation.item.input_audio_transcription.completed":
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
        const messages = roleplayScenarioMessages
          .map((message) => {
            return JSON.stringify({ role: message.role, content: message.content })
          })
          .join("\n")

        // User language preferences for this socket connection
        // TODO: Get user's actual learning language and user language
        const userLanguagePreferences = {
          learningLanguage: "FR",
          userLanguage: "EN",
        }

        const feedbackResult = await getFeedback(
          parsedMessage.transcript,
          userLanguagePreferences.learningLanguage,
          userLanguagePreferences.userLanguage,
          messages,
          "C2", // TODO: Get user's actual difficulty level
        )

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
      case "session.created":
        console.log("session.created")
        break
      case "session.updated":
        console.log("session.updated")
        break
      case "input_audio_buffer.speech_started":
        console.log("input_audio_buffer.speech_started")
        break
      case "input_audio_buffer.speech_stopped":
        console.log("input_audio_buffer.speech_stopped")
        break
      case "input_audio_buffer.committed":
        console.log("input_audio_buffer.committed")
        break
      case "conversation.item.added":
        console.log("conversation.item.added")
        break
      case "conversation.item.done":
        console.log("conversation.item.done")
        break
      case "response.created":
        console.log("response.created")
        break
      case "response.output_item.created":
        console.log("response.output_item.created")
        break
      case "response.content_part.added":
        console.log("response.content_part.added")
        break
      case "response.output_audio.delta":
        console.log("response.output_audio.delta")

        // Forward audio chunk to client
        socket.emit("audioStream", {
          delta: parsedMessage.delta,
          response_id: parsedMessage.response_id,
          item_id: parsedMessage.item_id,
          output_index: parsedMessage.output_index,
          content_index: parsedMessage.content_index,
        })
        break
      case "response.output_audio.done":
        console.log("response.output_audio.done")
        // Signal end of audio stream
        socket.emit("audioStreamDone", {
          response_id: parsedMessage.response_id,
          item_id: parsedMessage.item_id,
          output_index: parsedMessage.output_index,
          content_index: parsedMessage.content_index,
        })

        break
      case "response.output_audio_transcript.delta":
        console.log("response.output_audio_transcript.delta")
        break
      case "response.output_audio_transcript.done":
        console.log("response.output_audio_transcript.done")
        break

      case "response.output_text.delta":
        console.log("response.output_text.delta")
        break
      case "response.output_text.done":
        console.log("response.output_text.done")
        break
      case "response.content_part.done":
        console.log("response.content_part.done")
        break
      case "response.output_item.done":
        console.log("response.output_item.done")
        break
      case "response.done":
        console.log("response.done")
        break
      case "rate_limits.updated":
        console.log("rate_limits.updated")
        break
      default:
        console.log(type, " - unhandled event")
        break
    }
  })

  // Handle complete audio data from the client
  socket.on("completeAudio", (audioBase64: string) => {
    // Check session timeout before processing
    if (checkSessionTimeout()) {
      void endSession()
      return
    }

    /*   ws.send(
      JSON.stringify({
        type: "conversation.item.create",
        item: {
          type: "message",
          role: "user",
          content: [
            {
              type: "input_audio",
              audio: audioBase64,
            },
          ],
        },
      }),
    ) */

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
  socket.on("userMessage", async (message: string) => {
    // Check session timeout before processing
    if (checkSessionTimeout()) {
      void endSession()
      return
    }

    // Store user text message
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
    )
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
