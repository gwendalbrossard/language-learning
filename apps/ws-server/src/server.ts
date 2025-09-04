// server.js

import http from "http"
import { azure } from "@ai-sdk/azure"
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
const azureOpenaiModel = azure("gpt-4o-mini")

// Comprehensive language analysis schema combining grammar and detailed feedback
const ZLanguageAnalysisSchema = z.object({
  // Basic feedback (similar to getFeedback)
  quality: z.number().min(1).max(100).describe("Overall correctness score from 1-100"),
  message: z
    .string()
    .describe("Friendly, constructive feedback message focusing on specific improvements needed, in markdown format in the user's native language"),
  correctedPhrase: z.string().describe("The fully corrected version of the user's message"),
  corrections: z
    .array(
      z.object({
        wrong: z.string().describe("The incorrect part from the original message"),
        correct: z.string().describe("The corrected version of that part, extracted from the correctedPhrase"),
        explanation: z.string().describe("Short explanation for the correction"),
      }),
    )
    .describe("Array of wrong/correct pairs for highlighting corrections on the frontend"),

  // Detailed scoring (similar to getMessageScore)
  accuracy: z.object({
    score: z.number().min(1).max(100),
    message: z.string().describe("Helpful, supportive feedback about grammar and accuracy issues in the user's native language"),
  }),
  fluency: z.object({
    score: z.number().min(1).max(100),
    message: z.string().describe("Friendly feedback about naturalness and fluency in the user's native language"),
  }),
  vocabulary: z.object({
    score: z.number().min(1).max(100),
    message: z.string().describe("Supportive feedback about vocabulary choices and usage in the user's native language"),
  }),
  detailedFeedback: z
    .string()
    .describe(
      "Concise, supportive analysis (maximum 3 sentences) focusing on main language patterns and key improvement areas in the user's native language",
    ),
})

// Comprehensive language analysis function combining grammar checking and detailed feedback
async function analyzeLanguage(text: string, learningLanguage: string, userLanguage: string, previousContext?: string, difficulty = "A1") {
  const { object } = await generateObject({
    model: azureOpenaiModel,
    schemaName: "language-analysis",
    schema: ZLanguageAnalysisSchema,
    prompt: `You are an expert language tutor providing comprehensive analysis for someone learning ${learningLanguage} (their native language is ${userLanguage}).

CRITICAL: ALL feedback messages, explanations, and detailed feedback MUST be written in ${userLanguage} (the user's native language).

LEARNER PROFILE:
- Learning language: ${learningLanguage} (ISO code)
- Native language: ${userLanguage} (ISO code)
- Difficulty level: ${difficulty} (CEFR)
- Text source: Audio transcript (ignore minor transcription artifacts)

CONTEXT:
${previousContext ? `Previous conversation context: ${previousContext}` : "No previous context available"}

TEXT TO ANALYZE: "${text}"

ANALYSIS REQUIREMENTS:

1. OVERALL QUALITY (1-100): Evaluate overall correctness and appropriateness
2. DIRECT MESSAGE: Provide specific, actionable feedback in markdown format with a friendly and supportive tone. Focus on the main issues that need attention while being constructive and helpful. Avoid generic encouragement phrases like "Great effort!", "Keep practicing!", or "You're doing well!" (in ${userLanguage})
3. CORRECTIONS ARRAY: For each mistake, provide:
   - "wrong": the incorrect part from the original text
   - "correct": the corrected version of that part
   - "explanation": a clear, concise explanation for the correction
   Example: { "wrong": "Je appelle", "correct": "Je m'appelle" }

4. DETAILED SCORING (all messages in ${userLanguage}):
   - ACCURACY (1-100): Grammar, syntax, word choice correctness - provide helpful guidance on specific issues found
   - FLUENCY (1-100): How natural and smooth the expression sounds - offer friendly suggestions for improvement
   - VOCABULARY (1-100): Appropriateness and variety of word choices - suggest alternatives in a supportive way

5. CORRECTED PHRASE: Provide the complete corrected version
6. DETAILED FEEDBACK: Concise, friendly summary (maximum 3 sentences) focusing on the main language patterns and key improvement areas. Use a supportive tone while providing technical guidance (in ${userLanguage})

FOCUS AREAS:
✅ Grammar mistakes (tenses, agreement, structure)
✅ Vocabulary errors or unnatural word choices  
✅ Sentence structure and flow issues
✅ Appropriateness for the difficulty level
✅ Natural expression vs. literal translation

IGNORE:
❌ Punctuation/capitalization (transcript artifacts)
❌ Filler words ("um", "uh", "like")
❌ Minor transcription errors
❌ Acceptable informal speech patterns

TONE: Be friendly, supportive, and educational while remaining specific and actionable. Focus on helping the learner improve through constructive guidance. Avoid generic praise but maintain a warm, encouraging approach. Write ALL feedback in ${userLanguage}.`,
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
        id: item.id,
        text: item.formatted.transcript,
      })

      // Check grammar when transcript is final
      if (item.status === "completed" && item.formatted.transcript) {
        const transcript = item.formatted.transcript

        // Language preferences for this socket connection
        const userLanguagePreferences = {
          learningLanguage: "FR",
          userLanguage: "EN",
        }

        const analysisStartTime = performance.now()

        const analysisResult = await analyzeLanguage(
          transcript,
          userLanguagePreferences.learningLanguage,
          userLanguagePreferences.userLanguage,
          undefined, // TODO: Add previous context when available
          "A1", // TODO: Get user's actual difficulty level
        )

        const analysisEndTime = performance.now()
        const analysisDuration = Math.round(analysisEndTime - analysisStartTime)

        console.log(`Language analysis completed for: "${transcript}"`)
        console.log(`Analysis took: ${analysisDuration}ms`)

        console.log(analysisResult)

        // Emit comprehensive analysis result
        socket.emit("languageAnalysis", {
          messageId: item.id,
          analysis: analysisResult,
          analysisDuration,
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

    // Send bot responses to the client
    if (item.role !== "user" && item.formatted.transcript) {
      console.log(`Assistant transcript: ${item.formatted.transcript}`)
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
