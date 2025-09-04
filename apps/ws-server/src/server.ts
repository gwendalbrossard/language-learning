// server.js

import http from "http"
import { RealtimeClient } from "@openai/realtime-api-beta"
import express from "express"
import { Server } from "socket.io"

import type { EventHandlerResult, Realtime } from "./types"
import { env } from "./env.server"

// Express setup
const app = express()
const server = http.createServer(app)
const io = new Server(server)

// Set up view engine and static files
app.set("view engine", "ejs")
app.set("views", "./views")
app.use(express.static("public"))

// Main Route
app.get("/", (req, res) => {
  res.render("index")
})

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
  client.on("conversation.updated", (event: EventHandlerResult) => {
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
