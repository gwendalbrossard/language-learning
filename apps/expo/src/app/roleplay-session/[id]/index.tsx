import type { BottomSheetModal } from "@gorhom/bottom-sheet"
import type { FC } from "react"
import type { Socket } from "socket.io-client"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Stack, useLocalSearchParams } from "expo-router"
import { useQuery } from "@tanstack/react-query"
import { CircleStopIcon, ClockIcon, LightbulbIcon, Mic, NotepadTextIcon, Square, X } from "lucide-react-native"
import { Alert, Pressable, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { io } from "socket.io-client"

import type { TFeedbackSchema, TPracticeSchema } from "@acme/validators"

import type { LevelUpdateEvent } from "../../../../modules/my-module/src/MyModule.types"
import { BottomSheetTranscript } from "~/components/routes/roleplay-session/[id]/bottom-sheet-transcript"
import * as Button from "~/ui/button"
import { Text } from "~/ui/text"
import { trpc } from "~/utils/api"
import { getWsBaseUrl } from "~/utils/base-url"
import { getBearerToken } from "~/utils/bearer-store"
import { cn } from "~/utils/utils"
import { useUserStore } from "~/utils/zustand/user-store"
import MyModule from "../../../../modules/my-module"

interface Message {
  id: string
  role: "user" | "assistant"
  transcript: string
  feedback?: TFeedbackSchema
}

const RoleplaySession: FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>()

  const currentOrganizationId = useUserStore((state) => state.currentOrganizationId)
  if (!currentOrganizationId) throw new Error("Current organization ID not found")

  const profileRoleplaySessionGet = useQuery(
    trpc.profile.roleplaySession.get.queryOptions({ organizationId: currentOrganizationId, roleplaySessionId: id }),
  )
  if (!profileRoleplaySessionGet.data) throw new Error("Roleplay session not found")

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      transcript: "Hello! How can I assist you today?",
    },
  ])
  const [isRecording, setIsRecording] = useState(false)
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false)

  const [audioInitialized, setAudioInitialized] = useState(false)
  const [sessionEnded, setSessionEnded] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(5 * 60) // 5 minutes in seconds
  const [recordingLevel, setRecordingLevel] = useState(0)
  const [playbackLevel, setPlaybackLevel] = useState(0)

  const socketRef = useRef<Socket | null>(null)
  const sentUserMessageRef = useRef<string | null>(null)
  const sessionStartTimeRef = useRef<number>(Date.now())
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const bottomSheetTranscriptRef = useRef<BottomSheetModal>(null)

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
      console.log("Audio playback completed")
      setIsAssistantSpeaking(false)
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
    Alert.alert("End Conversation", "Are you sure you want to end this conversation?", [
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
    if (sessionEnded || isAssistantSpeaking) {
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
    <SafeAreaView edges={["bottom"]} style={{ flex: 1, backgroundColor: "white" }}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerShadowVisible: false,
          headerTitle: () => <View />,
          headerLeft: () => (
            <Button.Root variant="secondary" size="sm" onPress={undefined}>
              <Button.Icon icon={ClockIcon} />
              <Button.Text className="w-[30px]">{formatTime(timeRemaining)}</Button.Text>
            </Button.Root>
          ),
          headerRight: () => (
            <Button.Root variant="destructive" size="sm" onPress={handleEndSession}>
              <Button.Icon icon={CircleStopIcon} />
              <Button.Text>End</Button.Text>
            </Button.Root>
          ),
        }}
      />
      <View className="flex flex-1 flex-col">
        {/* Main content area */}
        <View className="flex-1 items-center justify-center px-6">
          {sessionEnded ? (
            <View className="items-center">
              <Text className="mb-8 text-center text-xl font-medium text-neutral-700">Session ended</Text>
              <View className="h-40 w-40 items-center justify-center rounded-3xl bg-neutral-300 shadow-lg">
                <X size={56} color="#666E7D" />
              </View>
              <Text className="mt-6 text-center text-lg font-medium text-success-600">Thank you for practicing!</Text>
            </View>
          ) : isAssistantSpeaking ? (
            <View className="items-center">
              <Text className="mb-8 text-center text-xl font-medium text-primary-700">Assistant is speaking...</Text>

              {/* ChatGPT-style voice visualization - 6 circles */}
              <View className="flex-row items-end gap-2">
                {[0, 1, 2, 3].map((index) => {
                  const baseHeight = 20
                  const maxHeight = 60
                  const animationDelay = index * 0.1
                  const heightMultiplier = Math.sin((playbackLevel * 10 + animationDelay) * Math.PI) * 0.5 + 0.5
                  const circleHeight = baseHeight + (maxHeight - baseHeight) * heightMultiplier * (playbackLevel > 0.05 ? 1 : 0.3)

                  return (
                    <View
                      key={index}
                      className="w-3 rounded-full bg-primary-600"
                      style={{
                        height: circleHeight,
                        opacity: playbackLevel > 0.02 ? 0.8 + heightMultiplier * 0.2 : 0.4,
                      }}
                    />
                  )
                })}
              </View>

              <Text className="mt-6 text-center text-base font-medium text-neutral-600">Listening...</Text>
            </View>
          ) : (
            <View className="items-center">
              <Text className="mb-8 text-center text-xl font-medium text-neutral-600">{isRecording ? "Recording..." : "Ready to listen"}</Text>

              {/* Recording level visualization when recording */}
              {isRecording && (
                <View className="mb-8 items-center">
                  <Text className="mb-4 text-sm text-neutral-500">Level: {(recordingLevel * 100).toFixed(0)}%</Text>
                  <View className="h-4 w-40 overflow-hidden rounded-full bg-neutral-200 shadow-inner">
                    <View
                      className="h-full rounded-full bg-error-500 shadow-sm transition-all duration-150 ease-out"
                      style={{
                        width: `${Math.max(recordingLevel * 100, 8)}%`,
                        opacity: recordingLevel > 0.02 ? 1 : 0.4,
                      }}
                    />
                  </View>
                </View>
              )}
            </View>
          )}
        </View>

        <Text className="mb-8 text-center text-xl font-medium text-neutral-600">{profileRoleplaySessionGet.data.scenario.title}</Text>

        <View className="flex-1 flex-col items-center pt-[15%]">
          <View
            className="size-52 items-center justify-center rounded-full bg-primary-600 duration-75"
            style={{
              /* opacity: recordingLevel * 0.8 + 0.2, */
              transform: [{ scale: 1 + recordingLevel * 0.15 }],
            }}
          />
          <Text className="mt-20 max-w-[90%] text-center text-xl font-medium">Your turn to speak</Text>
        </View>

        {/* Bottom */}
        <View className="flex flex-row items-end gap-14 bg-red-50 px-4">
          {/* Help */}
          <View className="flex w-full items-end">
            <View className="flex flex-col items-center gap-3">
              <TouchableOpacity
                onPress={() => {
                  /*  bottomSheetAnswerRef.current?.present() */
                }}
                className="size-16 items-center justify-center rounded-full bg-neutral-100"
              >
                <LightbulbIcon size={28} className="text-neutral-500" />
              </TouchableOpacity>
              <Text className="text-xs font-medium text-neutral-600">Answer</Text>
            </View>
          </View>

          {/* Record */}
          <View className="flex w-full">
            <View className="flex flex-col items-center gap-3">
              <Pressable
                onPressIn={() => void startRecording()}
                onPressOut={() => void stopRecording()}
                className={cn(`flex size-32 items-center justify-center rounded-full`, isRecording ? "bg-error-600" : "bg-primary-600")}
              >
                {isRecording ? <Square size={56} color="white" fill="white" /> : <Mic size={56} className="text-white" />}
              </Pressable>
              <Text className="text-xs font-medium text-neutral-600">Hold to speak</Text>
            </View>
          </View>

          {/* Transcript */}
          <View className="flex w-full items-start">
            <View className="flex flex-col items-center gap-3">
              <TouchableOpacity
                onPress={() => {
                  bottomSheetTranscriptRef.current?.present()
                }}
                className="size-16 items-center justify-center rounded-full bg-neutral-100"
              >
                <NotepadTextIcon size={28} className="text-neutral-500" />
              </TouchableOpacity>
              <Text className="text-xs font-medium text-neutral-600">Transcript</Text>
            </View>
          </View>
        </View>
      </View>

      <BottomSheetTranscript ref={bottomSheetTranscriptRef} messages={messages} />
    </SafeAreaView>
  )
}

export default RoleplaySession
