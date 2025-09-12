// server.js

import http from "http"
import { azure } from "@ai-sdk/azure"
import { RealtimeClient } from "@openai/realtime-api-beta"
import { generateObject } from "ai"
import express from "express"
import { Server } from "socket.io"

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

  console.log(practice)
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

  const checkSessionTimeout = () => {
    const elapsed = Date.now() - sessionStartTime
    return elapsed >= SESSION_TIMEOUT_MS
  }

  // Shared function to update session duration
  const updateSessionDuration = async () => {
    const currentTime = Date.now()
    const currentDuration = Math.floor((currentTime - sessionStartTime) / 1000) // duration in seconds

    console.log(`Updating session duration: sessionStartTime=${sessionStartTime}, currentTime=${currentTime}, duration=${currentDuration}s`)

    await prisma.roleplaySession.update({
      where: { id: roleplaySession.id },
      data: { duration: currentDuration },
    })
    return currentDuration
  }

  const endSession = async () => {
    if (sessionEnded) return
    sessionEnded = true

    console.log(`Ending session at time: ${Date.now()}, session started at: ${sessionStartTime}`)

    // Update final duration before ending
    const finalDuration = await updateSessionDuration()

    console.log(`Session ended for user: ${session.user.id} and sessionId: ${roleplaySession.id} after ${finalDuration} seconds`)
    socket.emit("sessionEnded")
    socket.disconnect()
  }

  // Set up automatic session timeout
  const timeoutTimer = setTimeout(() => {
    void endSession()
  }, SESSION_TIMEOUT_MS)

  const client = new RealtimeClient({ apiKey: env.OPENAI_API_KEY })

  client.updateSession({
    instructions: "You are a helpful, english speaking assistant.",
    model: "gpt-4o-mini-realtime-preview",
    voice: "ballad",
    turn_detection: null, // Disable server VAD since we're using manual recording
    input_audio_format: "pcm16", // Set input audio format
    output_audio_format: "pcm16", // Set output audio format
    input_audio_transcription: { model: "whisper-1" },
  })

  client.connect().catch((error) => {
    console.error("Failed to connect:", error)
    socket.emit("error", "Failed to connect to OpenAI API.")
  })

  client.on("error", (error: Realtime.Error) => {
    console.error("Realtime API error:", error)
  })

  // Handle conversation updates for transcription and audio
  client.on("conversation.updated", async (event: EventHandlerResult) => {
    // Check session timeout before processing
    if (checkSessionTimeout()) {
      void endSession()
      return
    }

    const { item, delta } = event
    if (!item) throw new Error("No item found")
    if (!item.formatted) throw new Error("No formatted item found")

    console.log(`Conversation updated - Role: ${item.role}, Status: ${item.status}, Type: ${item.type}`)

    // Handle user input (partial or complete transcription)
    if (item.role === "user" && item.formatted.transcript) {
      console.log(`User transcript: ${item.formatted.transcript}`)
      socket.emit("displayUserMessage", {
        id: item.id,
        text: item.formatted.transcript,
      })

      // Store user message when transcript is complete
      if (item.status === "completed" && item.formatted.transcript) {
        const transcript = item.formatted.transcript

        // Store user message
        const userMessage = await prisma.roleplaySessionMessage.create({
          data: {
            sessionId: roleplaySession.id,
            role: RoleplaySessionMessageRole.USER,
            content: transcript,
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
          transcript,
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
          messageId: item.id,
          feedback: feedbackResult,
        })
      }
    } else if (item.role === "user" && item.formatted.audio.length && !item.formatted.transcript) {
      // Emit placeholder while waiting for transcript if audio is present
      console.log("User audio received, awaiting transcript")
      socket.emit("displayUserMessage", {
        id: item.id,
        text: "(awaiting transcript)",
      })
    } else if (item.role === "user" && !item.formatted.transcript) {
      // Fallback in case neither transcript nor audio is present
      console.log("User item sent without transcript")
      socket.emit("displayUserMessage", {
        id: item.id,
        text: "(item sent)",
      })
    }

    // Send bot responses to the client and store them
    if (item.role !== "user" && item.formatted.transcript && item.status === "completed") {
      console.log(`Assistant transcript: ${item.formatted.transcript}`)

      // Store assistant message
      await prisma.roleplaySessionMessage.create({
        data: {
          sessionId: roleplaySession.id,
          role: RoleplaySessionMessageRole.ASSISTANT,
          content: item.formatted.transcript,
        },
      })

      await updateSessionDuration()

      socket.emit("conversationUpdate", {
        id: item.id,
        text: item.formatted.transcript,
      })
    } else if (item.role !== "user" && item.formatted.transcript) {
      // Still emit partial responses for real-time feedback
      socket.emit("conversationUpdate", {
        id: item.id,
        text: item.formatted.transcript,
      })
    }

    // Send audio updates to client
    if (delta?.audio) {
      const audioData = delta.audio.buffer
      console.log(`Sending audio delta: ${audioData.byteLength} bytes`)
      socket.emit("audioStream", audioData, item.id)
    }
  })

  // Handle conversation interruption
  client.on("conversation.interrupted", () => {
    socket.emit("conversationInterrupted")
  })

  // Handle complete audio data from the client
  socket.on("completeAudio", (audioBuffer: ArrayBuffer) => {
    // Check session timeout before processing
    if (checkSessionTimeout()) {
      void endSession()
      return
    }

    // Convert ArrayBuffer to base64 for the WebSocket API
    const uint8Array = new Uint8Array(audioBuffer)
    const base64Audio = Buffer.from(uint8Array).toString("base64")

    console.log(`Received complete audio: ${uint8Array.length} bytes`)

    // Use the lower-level WebSocket API to send audio properly
    // First, clear the input audio buffer
    client.realtime.send("input_audio_buffer.clear", {})

    // Append the audio data to the buffer
    client.realtime.send("input_audio_buffer.append", {
      audio: base64Audio,
    })

    // Commit the audio buffer to create a user message
    client.realtime.send("input_audio_buffer.commit", {})

    // Create a response from the model
    client.realtime.send("response.create", {})
  })

  // Handle cancel response requests from the client
  socket.on("cancelResponse", ({ trackId, offset }: { trackId: string; offset: number }) => {
    try {
      client.cancelResponse(trackId, offset)
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

    client.sendUserMessageContent([{ type: "input_text", text: message }])
  })

  // Handle manual session end from client
  socket.on("endSession", async () => {
    await endSession()
  })

  socket.on("disconnect", () => {
    clearTimeout(timeoutTimer)
    client.disconnect()
  })
})

// Start server
const PORT = 3002
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
