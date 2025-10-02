import type { RealtimeServerEvent } from "openai/resources/realtime/realtime.js"
import type { Socket } from "socket.io"
import WebSocket from "ws"

import type { Organization, Profile } from "@acme/db"
import { prisma, RoleplaySessionMessageRole } from "@acme/db"

import { env } from "~/env.server"
import { calculateAudioDuration, parseWAVFile } from "./utils/audio"
import { getFeedback } from "./utils/get-feedback"
import { getRoleplayInstructions } from "./utils/get-roleplay-instructions"

type Props = {
  roleplaySessionId: string
  profile: Profile
  organization: Organization
  socket: Socket
}
export const handleRoleplaySession = async ({ roleplaySessionId, profile, organization, socket }: Props) => {
  const roleplaySession = await prisma.roleplaySession.findUnique({
    where: { id: roleplaySessionId, profileId: profile.id, organizationId: organization.id },
    include: {
      roleplay: true,
    },
  })

  if (!roleplaySession) {
    console.error(
      `Could not find roleplay session, profileId: ${profile.id}, organizationId: ${organization.id}, roleplaySessionId: ${roleplaySessionId}`,
    )
    socket.disconnect()
    return
  }

  // Track session start time for 5-minute timeout
  const sessionStartTime = Date.now()
  const SESSION_TIMEOUT_MS = 5 * 60 * 1000 // 5 minutes

  console.log(`🟢 Roleplay session started for profileId: ${profile.id} and roleplaySessionId: ${roleplaySessionId} at time: ${sessionStartTime}`)

  let sessionEnded = false

  // Speaking duration tracking
  let totalUserSpeakingDuration = 0 // in seconds
  let totalAiSpeakingDuration = 0 // in seconds

  const checkSessionTimeout = () => {
    const elapsed = Date.now() - sessionStartTime
    return elapsed >= SESSION_TIMEOUT_MS
  }

  // Shared function to update session duration
  const updateRoleplaySessionDuration = async () => {
    const currentTime = Date.now()
    const currentDuration = Math.floor((currentTime - sessionStartTime) / 1000) // duration in seconds

    console.log(
      `🕑 Roleplay session: ${currentDuration}s total, user spoke: ${totalUserSpeakingDuration.toFixed(1)}s, AI spoke: ${totalAiSpeakingDuration.toFixed(1)}s`,
    )

    await prisma.roleplaySession.update({
      where: { id: roleplaySessionId },
      data: {
        duration: currentDuration,
        userSpeakingDuration: totalUserSpeakingDuration,
        aiSpeakingDuration: totalAiSpeakingDuration,
      },
    })
    return currentDuration
  }

  const endRoleplaySession = async () => {
    if (sessionEnded) return
    sessionEnded = true

    // Update final duration before ending
    const finalDuration = await updateRoleplaySessionDuration()

    console.log(`🔴 Roleplay session ended after ${finalDuration}s for profileId: ${profile.id} and roleplaySessionId: ${roleplaySessionId}`)
    socket.emit("sessionEnded")
    socket.disconnect()
  }

  // Set up automatic session timeout
  const timeoutTimer = setTimeout(() => {
    void endRoleplaySession()
  }, SESSION_TIMEOUT_MS)

  const url = "wss://api.openai.com/v1/realtime?model=gpt-4o-mini-realtime-preview"
  const ws = new WebSocket(url, {
    headers: {
      Authorization: "Bearer " + env.OPENAI_API_KEY,
    },
  })

  ws.on("open", function open() {
    console.log("Connected to server.")

    const roleplayInstructions = getRoleplayInstructions({
      roleplay: roleplaySession.roleplay,
      profile: profile,
    })

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
          instructions: roleplayInstructions,
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
            sessionId: roleplaySessionId,
            role: RoleplaySessionMessageRole.USER,
            content: parsedMessage.transcript,
          },
        })

        const roleplaySessionMessages = await prisma.roleplaySessionMessage.findMany({
          where: { sessionId: roleplaySessionId },
        })

        const feedbackResult = await getFeedback({
          transcript: parsedMessage.transcript,
          profile: profile,
          roleplaySessionMessages: roleplaySessionMessages,
        })

        // Update user message with feedback
        await prisma.roleplaySessionMessage.update({
          where: { id: userMessage.id },
          data: {
            feedback: feedbackResult,
          },
        })

        await updateRoleplaySessionDuration()

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
            sessionId: roleplaySessionId,
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
      void endRoleplaySession()
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
      void endRoleplaySession()
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
    await endRoleplaySession()
  })

  socket.on("disconnect", () => {
    clearTimeout(timeoutTimer)
    ws.close()
  })
}
