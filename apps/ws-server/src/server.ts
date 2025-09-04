// server.js

import http from "http"
import { openai } from "@ai-sdk/openai"
import { RealtimeClient } from "@openai/realtime-api-beta"
import { generateObject } from "ai"
import express from "express"
import { Server } from "socket.io"
import { z } from "zod"

import type { EventHandlerResult, Realtime } from "./types"
import { env } from "./env.server"

// Express setup
const app = express()
const server = http.createServer(app)
const io = new Server(server)

// OpenAI model configuration for grammar checking
const openaiModel = openai("gpt-4o-mini")

// Grammar correction schema for structured output
const ZGrammarCorrectionSchema = z.object({
  hasError: z.boolean().describe("Whether the text contains grammar mistakes or could be improved"),
  correction: z
    .object({
      correctedText: z.string().describe("The corrected version of the text"),
      explanation: z.string().describe("Brief explanation of the correction (should be short)"),
    })
    .optional()
    .describe("Correction details if hasError is true"),
})

// Grammar checking function
async function checkGrammar(text: string, learningLanguage: string, userLanguage: string) {
  const { object } = await generateObject({
    model: openaiModel,
    schemaName: "grammar-correction",
    schema: ZGrammarCorrectionSchema,
    prompt: `You are a helpful language tutor assisting someone learning a language with ISO code ${learningLanguage}. 

IMPORTANT CONTEXT:
- The user is learning a language with ISO code ${learningLanguage} and their native language has ISO code ${userLanguage}
- This text comes from an audio transcript, so ignore punctuation issues, capitalization problems, or unclear words that might be transcription errors
- Focus ONLY on actual grammar, vocabulary, and sentence structure mistakes that a language learner would make
- Provide your analysis and explanations in the language with ISO code ${userLanguage}

WHAT TO CORRECT:
✅ Grammar mistakes (verb tenses, subject-verb agreement, etc.)
✅ Wrong word choices or vocabulary errors
✅ Sentence structure issues
✅ Unnatural phrasing that native speakers wouldn't use

WHAT NOT TO CORRECT:
❌ Missing punctuation or capitalization (transcript artifacts)
❌ Filler words like "um", "uh", "like" (natural in speech)
❌ Minor transcription errors or unclear words
❌ Informal speech patterns that are actually correct in spoken language

Text to analyze: "${text}"

Be encouraging and focus on helping the learner improve their language skills. 

RESPONSE FORMAT:
- Set hasError to true if corrections are needed, false if the text is already correct
- If hasError is true, provide the correction object with correctedText and a short explanation
- If hasError is false, omit the correction object`,
    temperature: 0.3,
  })

  return object
}

// Socket.io setup
io.on("connection", (socket) => {
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
    const { item, delta } = event
    if (!item) throw new Error("No item found")
    if (!item.formatted) throw new Error("No formatted item found")

    console.log(`Conversation updated - Role: ${item.role}, Status: ${item.status}, Type: ${item.type}`)

    // Handle user input (partial or complete transcription)
    if (item.role === "user" && item.formatted.transcript) {
      console.log(`User transcript: ${item.formatted.transcript}`)
      socket.emit("displayUserMessage", {
        text: item.formatted.transcript,
        isFinal: item.status === "completed",
      })

      // Check grammar when transcript is final
      if (item.status === "completed" && item.formatted.transcript) {
        const transcript = item.formatted.transcript

        // Language preferences for this socket connection
        const userLanguagePreferences = {
          learningLanguage: "FR",
          userLanguage: "EN",
        }

        const grammarResult = await checkGrammar(transcript, userLanguagePreferences.learningLanguage, userLanguagePreferences.userLanguage)
        if (grammarResult.hasError && grammarResult.correction) {
          console.log(`Grammar correction found for: "${transcript}"`)
          console.log(`Corrected text: "${grammarResult.correction.correctedText}"`)
          socket.emit("grammarCorrection", {
            original: transcript,
            hasError: grammarResult.hasError,
            correction: grammarResult.correction,
          })
        }
      }
    } else if (item.role === "user" && item.formatted.audio.length && !item.formatted.transcript) {
      // Emit placeholder while waiting for transcript if audio is present
      console.log("User audio received, awaiting transcript")
      socket.emit("displayUserMessage", {
        text: "(awaiting transcript)",
        isFinal: false,
      })
    } else if (item.role === "user" && !item.formatted.transcript) {
      // Fallback in case neither transcript nor audio is present
      console.log("User item sent without transcript")
      socket.emit("displayUserMessage", {
        text: "(item sent)",
        isFinal: true,
      })
    }

    // Send bot responses to the client
    if (item.role !== "user" && item.formatted.transcript) {
      console.log(`Assistant transcript: ${item.formatted.transcript}`)
      socket.emit("conversationUpdate", {
        text: item.formatted.transcript,
        isFinal: item.status === "completed",
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
  socket.on("userMessage", (message: string) => {
    client.sendUserMessageContent([{ type: "input_text", text: message }])
  })

  socket.on("disconnect", () => {
    client.disconnect()
  })
})

// Start server
const PORT = 3002
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
