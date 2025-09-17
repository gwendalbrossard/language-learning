import type { BottomSheetModal } from "@gorhom/bottom-sheet"
import type { FC } from "react"
import type { Socket } from "socket.io-client"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useLocalSearchParams } from "expo-router"
import { FileTextIcon, Mic, Square, X } from "lucide-react-native"
import { Alert, Pressable, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { io } from "socket.io-client"

import type { TFeedbackSchema, TPracticeSchema } from "@acme/validators"

import type { LevelUpdateEvent } from "../../../../modules/my-module/src/MyModule.types"
import { BottomSheetTranscript } from "~/components/routes/roleplay-session/[id]/bottom-sheet-transcript"
import { Text } from "~/ui/text"
import { getWsBaseUrl } from "~/utils/base-url"
import { getBearerToken } from "~/utils/bearer-store"
import MyModule from "../../../../modules/my-module"

interface Message {
  id: string
  role: "user" | "assistant"
  transcript: string
  feedback?: TFeedbackSchema
}

const RoleplaySession: FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>()

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      transcript: "Hello! How can I assist you today?",
    },
  ])
  const [isRecording, setIsRecording] = useState(false)
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false)
  const [turnState, setTurnState] = useState<"user" | "assistant">("user")

  const [audioInitialized, setAudioInitialized] = useState(false)
  const [sessionEnded, setSessionEnded] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(5 * 60) // 5 minutes in seconds
  const [recordingLevel, setRecordingLevel] = useState(0)
  const [playbackLevel, setPlaybackLevel] = useState(0)

  const socketRef = useRef<Socket | null>(null)
  const sentUserMessageRef = useRef<string | null>(null)
  const sessionStartTimeRef = useRef<number>(Date.now())
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const transcriptBottomSheetRef = useRef<BottomSheetModal>(null)

  const initializeSocket = useCallback((): void => {
    if (!id) throw new Error("Session ID is required")

    const practice: TPracticeSchema = {
      roleplaySessionId: id,
    }

    socketRef.current = io(getWsBaseUrl(), {
      extraHeaders: {
        Authorization: `Bearer ${getBearerToken()}`,
      },
      query: {
        practice: JSON.stringify(practice),
      },
    })

    socketRef.current.on("connect", () => {
      console.log("Connected to server")
    })

    socketRef.current.on("userTextDelta", ({ id, delta }: { id: string; delta: string }) => {
      userTextDelta(id, delta)
    })

    socketRef.current.on("assistantTextDelta", ({ id, delta }: { id: string; delta: string }) => {
      assistantTextDelta(id, delta)
    })

    socketRef.current.on("assistantAudioDelta", (data: { delta: string; itemId: string }) => {
      console.log(`Received assistant audio chunk: ${data.delta.length} chars, itemId: ${data.itemId}`)

      setIsAssistantSpeaking(true)
      setTurnState("assistant")
      MyModule.processAudioChunk({ delta: data.delta })
    })

    socketRef.current.on("assistantAudioDone", (data: { itemId: string }) => {
      console.log(`Assistant audio stream completed for itemId: ${data.itemId}`)
      MyModule.lastAudioChunkReceived()
    })

    socketRef.current.on("feedback", (data: { messageId: string; feedback: TFeedbackSchema }) => {
      addFeedbackToMessage(data)
    })

    socketRef.current.on("sessionEnded", () => {
      endSession()
      // Disconnect after server confirms session is ended
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    })
  }, [id])

  useEffect(() => {
    initializeSocket()
    void initializeAudio()

    // Add listener for audio playback completion
    const handleAudioPlaybackComplete = () => {
      console.log("Audio playback completed - switching to user turn")
      setIsAssistantSpeaking(false)
      setTurnState("user")
    }

    const subscription = MyModule.addListener("onAudioPlaybackComplete", handleAudioPlaybackComplete)

    // Add level monitoring listeners
    const recordingLevelSubscription = MyModule.addListener("onRecordingLevelUpdate", (event: LevelUpdateEvent) => {
      setRecordingLevel(event.level)
    })

    const playbackLevelSubscription = MyModule.addListener("onPlaybackLevelUpdate", (event: LevelUpdateEvent) => {
      setPlaybackLevel(event.level)
    })

    // Start the session timer
    sessionStartTimeRef.current = Date.now()
    timerIntervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000)
      const remaining = Math.max(0, 5 * 60 - elapsed) // 5 minutes - elapsed
      setTimeRemaining(remaining)

      if (remaining === 0) {
        endSession()
      }
    }, 1000)

    return () => {
      subscription.remove()
      recordingLevelSubscription.remove()
      playbackLevelSubscription.remove()
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [initializeSocket])

  const initializeAudio = async (): Promise<void> => {
    try {
      const granted = await MyModule.requestRecordingPermissions()
      if (!granted) {
        Alert.alert("Error", "Microphone permission is required for audio recording.")
        return
      }

      setAudioInitialized(true)
      console.log("Audio initialized successfully - Native module ready for recording and playback")
    } catch (error) {
      console.error("Failed to initialize audio:", error)
      Alert.alert("Error", "Failed to initialize audio. Please check permissions.")
    }
  }

  const endSession = () => {
    setSessionEnded(true)
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
    }
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleEndSession = () => {
    Alert.alert("End Conversation", "Are you sure you want to end this conversation? This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "End Conversation",
        style: "destructive",
        onPress: () => {
          if (socketRef.current) {
            socketRef.current.emit("endSession")
          }
        },
      },
    ])
  }

  const userTextDelta = (id: string, delta: string) => {
    setMessages((prev) => {
      // Check if message already exists
      const existingIndex = prev.findIndex((msg) => msg.id === id)

      if (existingIndex >= 0) {
        // Update existing message
        const updated = [...prev]
        const existingMessage = updated[existingIndex]
        if (existingMessage) {
          updated[existingIndex] = {
            ...existingMessage,
            transcript: existingMessage.transcript + delta,
          }
        }
        return updated
      } else {
        // Create new message
        return [
          ...prev,
          {
            id,
            role: "user",
            transcript: delta,
          },
        ]
      }
    })

    // Handle typed messages
    if (sentUserMessageRef.current && delta === "(item sent)") {
      const sentMessage = sentUserMessageRef.current
      sentUserMessageRef.current = null

      setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, transcript: sentMessage } : msg)))
    }
  }

  const assistantTextDelta = (id: string, delta: string) => {
    setMessages((prev) => {
      // Check if message already exists
      const existingIndex = prev.findIndex((msg) => msg.id === id)

      if (existingIndex >= 0) {
        // Update existing message
        const updated = [...prev]
        const existingMessage = updated[existingIndex]
        if (existingMessage) {
          updated[existingIndex] = {
            ...existingMessage,
            transcript: existingMessage.transcript + delta,
          }
        }
        return updated
      } else {
        // Create new message
        return [
          ...prev,
          {
            id,
            role: "assistant",
            transcript: delta,
          },
        ]
      }
    })
  }

  const addFeedbackToMessage = (data: { messageId: string; feedback: TFeedbackSchema }) => {
    setMessages((prev) => {
      // Find the message by ID
      const messageIndex = prev.findIndex((msg) => msg.id === data.messageId)
      if (messageIndex === -1) return prev

      const updatedMessages = [...prev]
      const currentMessage = updatedMessages[messageIndex]
      if (currentMessage) {
        updatedMessages[messageIndex] = {
          ...currentMessage,
          feedback: data.feedback,
        }
      }

      return updatedMessages
    })
  }

  const startRecording = async (): Promise<void> => {
    if (sessionEnded || turnState !== "user") {
      return
    }

    if (!isRecording) {
      try {
        setIsRecording(true) // Set immediately for responsive UI

        if (!audioInitialized) {
          await initializeAudio()
        }

        await MyModule.startRecording()
      } catch (error) {
        console.error("Error starting recording:", error)
        setIsRecording(false)
        userTextDelta(`error-${Date.now()}`, "❌ Failed to start recording. Please check microphone permissions.")
        Alert.alert("Error", "Failed to start recording. Please check microphone permissions.")
      }
    }
  }

  const stopRecording = async (): Promise<void> => {
    if (isRecording) {
      setIsRecording(false)

      // Reset recording level immediately
      setRecordingLevel(0)

      try {
        const base64Audio: string | null = await MyModule.stopRecording()

        if (base64Audio && base64Audio.length > 0) {
          // Send complete audio to server as base64
          if (socketRef.current) {
            socketRef.current.emit("completeAudio", base64Audio)
          }
        } else {
          userTextDelta(`error-${Date.now()}`, "⚠️ No audio data recorded - try speaking louder")
        }
      } catch (error) {
        console.error("Failed to stop recording:", error)
        userTextDelta(`error-${Date.now()}`, "❌ Error stopping recording")
      }
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View className="flex flex-1 flex-col">
        {/* Timer Header */}
        <View className="border-b border-gray-200 px-4 py-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 items-center">
              <Text className={`text-lg font-semibold ${timeRemaining < 60 ? "text-red-600" : "text-gray-800"}`}>
                Time remaining: {formatTime(timeRemaining)}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <TouchableOpacity onPress={() => transcriptBottomSheetRef.current?.present()} className="rounded-lg bg-blue-500 px-3 py-2">
                <View className="flex-row items-center gap-1">
                  <FileTextIcon size={16} color="white" />
                  <Text className="text-sm font-medium text-white">Transcript</Text>
                </View>
              </TouchableOpacity>
              {!sessionEnded && (
                <TouchableOpacity onPress={handleEndSession} className="rounded-lg bg-red-500 px-3 py-2">
                  <View className="flex-row items-center gap-1">
                    <X size={16} color="white" />
                    <Text className="text-sm font-medium text-white">End</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Main content area - Push-to-Talk UI */}
        <View className="flex-1 items-center justify-center px-4">
          {turnState === "user" && (
            <View className="items-center">
              <Text className="mb-6 text-center text-lg text-gray-600">{isRecording ? "Recording... Release to send" : "Your turn to speak"}</Text>
              <View className="relative">
                <Pressable
                  onPressIn={() => void startRecording()}
                  onPressOut={() => void stopRecording()}
                  className={`h-32 w-32 items-center justify-center rounded-full shadow-lg transition-all duration-300 ease-in-out ${
                    isRecording ? "scale-110 bg-red-500" : "scale-100 bg-blue-500 hover:scale-105"
                  }`}
                  style={{
                    shadowColor: isRecording ? "#ef4444" : "#3b82f6",
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 4 },
                  }}
                  disabled={!audioInitialized || sessionEnded}
                >
                  {isRecording ? <Square size={48} color="white" fill="white" /> : <Mic size={48} color="white" />}
                </Pressable>

                {/* Recording level visualization */}
                {isRecording && (
                  <>
                    {/* Outer pulsing ring */}
                    <View
                      className="absolute -inset-4 rounded-full border-2 border-red-200"
                      style={{
                        borderWidth: 2 + recordingLevel * 4,
                        opacity: recordingLevel * 0.4 + 0.1,
                        transform: [{ scale: 1 + recordingLevel * 0.3 }],
                      }}
                    />
                    {/* Inner intense ring */}
                    <View
                      className="border-3 absolute -inset-2 rounded-full border-red-400"
                      style={{
                        borderWidth: 3 + recordingLevel * 6,
                        opacity: recordingLevel * 0.7 + 0.3,
                        transform: [{ scale: 1 + recordingLevel * 0.15 }],
                      }}
                    />
                  </>
                )}
              </View>

              <Text className="mt-4 text-center text-sm text-gray-500">{isRecording ? "Release to send" : "Hold to speak"}</Text>

              {isRecording && (
                <>
                  <Text className="mt-1 text-xs text-gray-400">Level: {(recordingLevel * 100).toFixed(0)}%</Text>
                  <View className="mt-2 h-3 w-32 overflow-hidden rounded-full bg-gray-200 shadow-inner">
                    <View
                      className="h-full rounded-full bg-gradient-to-r from-red-400 to-red-600 shadow-sm transition-all duration-150 ease-out"
                      style={{
                        width: `${Math.max(recordingLevel * 100, 5)}%`,
                        opacity: recordingLevel > 0.02 ? 1 : 0.3,
                      }}
                    />
                  </View>
                </>
              )}
            </View>
          )}

          {turnState === "assistant" && isAssistantSpeaking && (
            <View className="items-center">
              <Text className="mb-6 text-center text-lg text-blue-600">Assistant is speaking...</Text>
              <View className="relative">
                <View className="h-32 w-32 items-center justify-center rounded-lg bg-blue-500 shadow-lg">
                  <Square size={48} color="white" fill="white" />
                </View>
                {/* Playback level visualization */}
                {playbackLevel > 0.05 && (
                  <>
                    {/* Outer glow */}
                    <View
                      className="absolute -inset-4 rounded-lg border-2 border-blue-200"
                      style={{
                        borderWidth: 2 + playbackLevel * 4,
                        opacity: playbackLevel * 0.4 + 0.1,
                        transform: [{ scale: 1 + playbackLevel * 0.25 }],
                      }}
                    />
                    {/* Inner pulse */}
                    <View
                      className="border-3 absolute -inset-2 rounded-lg border-blue-400"
                      style={{
                        borderWidth: 3 + playbackLevel * 6,
                        opacity: playbackLevel * 0.7 + 0.3,
                        transform: [{ scale: 1 + playbackLevel * 0.12 }],
                      }}
                    />
                  </>
                )}
              </View>
              <Text className="mt-4 text-center text-sm text-gray-500">Please wait</Text>
              <Text className="mt-1 text-xs text-gray-400">Playback: {(playbackLevel * 100).toFixed(0)}%</Text>
              <View className="mt-2 h-3 w-32 overflow-hidden rounded-full bg-gray-200 shadow-inner">
                <View
                  className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 shadow-sm transition-all duration-150 ease-out"
                  style={{
                    width: `${Math.max(playbackLevel * 100, 5)}%`,
                    opacity: playbackLevel > 0.02 ? 1 : 0.3,
                  }}
                />
              </View>
            </View>
          )}

          {turnState === "assistant" && !isAssistantSpeaking && (
            <View className="items-center">
              <Text className="mb-6 text-center text-lg text-gray-600">Processing your message...</Text>
              <View className="h-32 w-32 items-center justify-center rounded-full bg-gray-300 shadow-lg">
                <Mic size={48} color="gray" />
              </View>
              <Text className="mt-4 text-center text-sm text-gray-500">Please wait</Text>
            </View>
          )}

          {sessionEnded && (
            <View className="items-center">
              <Text className="mb-6 text-center text-lg text-gray-600">Session ended</Text>
              <View className="h-32 w-32 items-center justify-center rounded-full bg-gray-300 shadow-lg">
                <X size={48} color="gray" />
              </View>
              <Text className="mt-4 text-center text-sm text-gray-500">Thank you for practicing!</Text>
            </View>
          )}
        </View>
      </View>

      <BottomSheetTranscript ref={transcriptBottomSheetRef} messages={messages} />
    </SafeAreaView>
  )
}

export default RoleplaySession
