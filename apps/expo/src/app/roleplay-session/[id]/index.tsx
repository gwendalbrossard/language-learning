import type { BottomSheetModal } from "@gorhom/bottom-sheet"
import type { FC } from "react"
import type { Socket } from "socket.io-client"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Stack, useLocalSearchParams } from "expo-router"
import { useMutation, useQuery } from "@tanstack/react-query"
import { ClockIcon, LightbulbIcon, Mic, NotepadTextIcon, PhoneOff, Square, X } from "lucide-react-native"
import { ActivityIndicator, Alert, Animated, Pressable, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Rive from "rive-react-native"
import { io } from "socket.io-client"

import type { RouterOutputs } from "@acme/api"
import type { TFeedbackSchema, TPracticeSchema } from "@acme/validators"

import type { LevelUpdateEvent } from "../../../../modules/my-module/src/MyModule.types"
import { BottomSheetResponseSuggestions } from "~/components/routes/roleplay-session/[id]/bottom-sheet-response-suggestions"
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

type Suggestion = RouterOutputs["profile"]["roleplaySession"]["getResponseSuggestions"]["suggestions"][number]

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

  const animatedScale = useRef(new Animated.Value(80)).current

  // Cache for response suggestions to avoid duplicate fetches
  const [cachedSuggestions, setCachedSuggestions] = useState<Record<string, Suggestion[]>>({})

  const socketRef = useRef<Socket | null>(null)
  const sentUserMessageRef = useRef<string | null>(null)
  const sessionStartTimeRef = useRef<number>(Date.now())
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const bottomSheetTranscriptRef = useRef<BottomSheetModal>(null)
  const bottomSheetResponseSuggestionsRef = useRef<BottomSheetModal>(null)

  const profileGetResponseSuggestionsMutation = useMutation(
    trpc.profile.roleplaySession.getResponseSuggestions.mutationOptions({
      onSuccess: (data) => {
        // Cache the suggestions by the latest assistant message ID
        const latestAssistantMessage = getLatestAssistantMessage()
        if (latestAssistantMessage) {
          setCachedSuggestions((prev) => ({
            ...prev,
            [latestAssistantMessage.id]: data.suggestions,
          }))
        }
        bottomSheetResponseSuggestionsRef.current?.present()
      },
      onError: (error) => {
        console.error("Failed to get response suggestions:", error)
        Alert.alert("Error", "Failed to get response suggestions. Please try again.")
      },
    }),
  )

  const initializeSocket = useCallback((): void => {
    if (!id) throw new Error("Session ID is required")

    const practice: TPracticeSchema = {
      roleplaySessionId: id,
      organizationId: currentOrganizationId,
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

  // Animate scale based on audio levels with immediate response for 240fps
  useEffect(() => {
    const targetScale = 80 + (isRecording ? recordingLevel : playbackLevel) * 20

    // Use timing with very short duration for immediate response at 240fps
    Animated.spring(animatedScale, {
      toValue: targetScale,
      tension: 200,
      friction: 5,
      useNativeDriver: false,
    }).start()
  }, [recordingLevel, playbackLevel, isRecording, animatedScale])

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

  const getLatestAssistantMessage = () => {
    return [...messages].reverse().find((msg) => msg.role === "assistant")
  }

  const getCurrentSuggestions = (): Suggestion[] => {
    const latestAssistantMessage = getLatestAssistantMessage()
    if (latestAssistantMessage) {
      const cached = cachedSuggestions[latestAssistantMessage.id]
      if (cached) return cached
    }
    return profileGetResponseSuggestionsMutation.data?.suggestions ?? []
  }

  const handleGetResponseSuggestions = async () => {
    const latestAssistantMessage = getLatestAssistantMessage()

    if (!latestAssistantMessage) {
      Alert.alert("Error", "No assistant message found to generate suggestions from.")
      return
    }

    // Check if we already have cached suggestions for this message
    if (cachedSuggestions[latestAssistantMessage.id]) {
      bottomSheetResponseSuggestionsRef.current?.present()
      return
    }

    // Fetch new suggestions
    await profileGetResponseSuggestionsMutation.mutateAsync({
      roleplaySessionId: id,
      organizationId: currentOrganizationId,
    })
  }

  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1, backgroundColor: "white" }}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerShadowVisible: false,
          headerTitle: () => <View />,
          headerLeft: () => <View />,
          /*  headerLeft: () => (
            <View className="flex size-12 flex-row items-center justify-center rounded-full border border-neutral-300 bg-white shadow-custom-xs">
              <Text className="text-sm font-medium text-neutral-700">{formatTime(timeRemaining)}</Text>
            </View>
          ), */
          /* headerRight: () => (
            <Button.Root variant="destructive" size="sm" onPress={handleEndSession}>
              <Button.Icon icon={CircleStopIcon} />
              <Button.Text>End</Button.Text>
            </Button.Root>
          ), */
          /*   headerRight: () => (
            <View className="flex flex-row items-center gap-2">
              <Pressable className="flex size-12 flex-row items-center justify-center rounded-full bg-error-600 shadow-custom-xs" onPress={handleEndSession}>
                <PhoneOff size={16} className="text-white" />
              </Pressable>
            </View>
          ), */
          headerRight: () => <View />,
        }}
      />
      <View className="flex flex-1 flex-col">
        {/* Main content area */}
        <View className="flex-1 flex-col items-center pt-[15%]">
          {/*  <View className="mb-1 flex flex-row items-center gap-2">
            <ClockIcon size={16} className="text-neutral-400" />
            <Text className="text-sm font-medium text-neutral-400">{formatTime(timeRemaining)}</Text>
          </View> */}
          <Text className="mb-8 text-center text-xl font-medium text-neutral-600">{profileRoleplaySessionGet.data.roleplay.title}</Text>

          {sessionEnded && (
            <View className="items-center">
              <Text className="mb-8 text-center text-xl font-medium text-neutral-700">Session ended</Text>
              <View className="shadow-custom-lg h-40 w-40 items-center justify-center rounded-3xl bg-neutral-300">
                <X size={56} color="#666E7D" />
              </View>
              <Text className="mt-6 text-center text-lg font-medium text-success-600">Thank you for practicing!</Text>
            </View>
          )}
          <Animated.View
            style={{
              marginTop: 40,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
              width: animatedScale.interpolate({
                inputRange: [80, 100],
                outputRange: ["80%", "100%"],
              }),
              height: animatedScale.interpolate({
                inputRange: [80, 100],
                outputRange: ["80%", "100%"],
              }),
            }}
          >
            <Rive url="https://assets.studyunfold.com/rives/fire.riv" style={{ width: "100%", height: "100%" }} />
          </Animated.View>

          <View className="mt-10 flex flex-col items-center gap-2">
            <View className="flex flex-row items-center gap-2">
              <ClockIcon size={16} className="text-neutral-400" />
              <Text className="text-sm font-medium text-neutral-400">{formatTime(timeRemaining)}</Text>
            </View>
            <Button.Root variant="destructive" size="sm" onPress={handleEndSession}>
              <Button.Icon icon={PhoneOff} />
              <Button.Text>End Conversation</Button.Text>
            </Button.Root>
          </View>
        </View>

        {/* Bottom */}
        <View className="flex w-full flex-row items-end justify-center gap-8 px-4">
          {/* Help */}
          <View className="flex w-[90px] flex-col items-center gap-3">
            <TouchableOpacity
              onPress={() => void handleGetResponseSuggestions()}
              disabled={profileGetResponseSuggestionsMutation.isPending}
              className={cn(
                "size-16 items-center justify-center rounded-full",
                profileGetResponseSuggestionsMutation.isPending ? "bg-neutral-200" : "bg-neutral-100",
              )}
            >
              {profileGetResponseSuggestionsMutation.isPending ? (
                <ActivityIndicator size="small" color="#6B7280" />
              ) : (
                <LightbulbIcon size={28} className="text-neutral-500" />
              )}
            </TouchableOpacity>
            <Text className="text-xs font-medium text-neutral-600">Answer</Text>
          </View>

          {/* Record */}
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

          {/* Transcript */}
          <View className="flex w-[90px] flex-col items-center gap-3">
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

      <BottomSheetTranscript ref={bottomSheetTranscriptRef} messages={messages} />
      <BottomSheetResponseSuggestions ref={bottomSheetResponseSuggestionsRef} suggestions={getCurrentSuggestions()} />
    </SafeAreaView>
  )
}

export default RoleplaySession
