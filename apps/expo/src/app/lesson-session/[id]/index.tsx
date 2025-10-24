import type { BottomSheetModal } from "@gorhom/bottom-sheet"
import type { LucideIcon } from "lucide-react-native"
import type { FC } from "react"
import type { Socket } from "socket.io-client"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { router, useLocalSearchParams } from "expo-router"
import { useMutation, useQuery } from "@tanstack/react-query"
import { BadgeQuestionMarkIcon, LightbulbIcon, NotepadTextIcon, PlayIcon, SettingsIcon, Volume2Icon, XIcon } from "lucide-react-native"
import { Alert, Animated, Pressable, TouchableOpacity, View } from "react-native"
import Reanimated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated"
import { SafeAreaView } from "react-native-safe-area-context"
import Rive from "rive-react-native"
import { io } from "socket.io-client"

import type { RouterOutputs } from "@acme/api"
import type { TActionSchema, TPracticeSchema } from "@acme/validators"

import type { LevelUpdateEvent } from "../../../../modules/my-module/src/MyModule.types"
import Microphone from "~/components/common/svg/microphone"
import { BottomSheetResponseSuggestions } from "~/components/routes/roleplay-session/[id]/bottom-sheet-response-suggestions"
import BottomSheetSettings from "~/components/routes/roleplay-session/[id]/bottom-sheet-settings"
import { BottomSheetTranscript } from "~/components/routes/roleplay-session/[id]/bottom-sheet-transcript"
import * as Button from "~/ui/button"
import { Text } from "~/ui/text"
import { queryClient, trpc } from "~/utils/api"
import { getWsBaseUrl } from "~/utils/base-url"
import { getBearerToken } from "~/utils/bearer-store"
import { cn } from "~/utils/utils"
import { useUserStore } from "~/utils/zustand/user-store"
import MyModule from "../../../../modules/my-module"

interface Message {
  id: string
  role: "user" | "assistant"
  transcript: string
  action?: TActionSchema
}

type Suggestion = RouterOutputs["profile"]["roleplaySession"]["getResponseSuggestions"]["suggestions"][number]

type CurrentAction = {
  action: TActionSchema
  pronunciation: {
    audioBase64: string
  } | null
  translation: {
    audioBase64: string
    translation: string
    translationRomanized: string | null
  } | null
}

const LessonSession: FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>()

  const currentOrganizationId = useUserStore((state) => state.currentOrganizationId)
  if (!currentOrganizationId) throw new Error("Current organization ID not found")

  const profileMe = useQuery(trpc.profile.me.queryOptions())
  if (!profileMe.data) throw new Error("Profile me not found")

  const profileLessonSessionGet = useQuery(
    trpc.profile.lessonSession.get.queryOptions({ organizationId: currentOrganizationId, lessonSessionId: id }),
  )
  if (!profileLessonSessionGet.data) throw new Error("Lesson session not found")

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

  const profileUpdateStreakDayMutation = useMutation(
    trpc.profile.updateStreakDay.mutationOptions({
      onError: (error) => {
        console.error("Failed to update streak day:", error)
        Alert.alert("Error", "Failed to update streak day. Please try again.")
      },
    }),
  )

  const profileRoleplaySessionGenerateFeedbackMutation = useMutation(
    trpc.profile.roleplaySession.generateFeedback.mutationOptions({
      onSuccess: async (_data) => {
        await queryClient.invalidateQueries(
          trpc.profile.roleplaySession.get.queryOptions({ roleplaySessionId: id, organizationId: currentOrganizationId }),
        )
      },
      onError: (error) => {
        if (error.data?.code === "PAYMENT_REQUIRED") {
          Alert.alert("Subscription required", "You need to upgrade your plan to have access to this feature")
        } else {
          Alert.alert("An error occurred", error.message ? error.message : "An unknown error occurred")
        }
      },
    }),
  )

  const profileUtilsGetPronunciationMutation = useMutation(
    trpc.profile.utils.getPronunciation.mutationOptions({
      onSuccess: (data) => {
        MyModule.playAudio({ audio: data.audioBase64 })

        setCurrentAction((prev) => {
          if (!prev) return null
          return { ...prev, pronunciation: { audioBase64: data.audioBase64 } }
        })
      },
      onError: (error) => {
        if (error.data?.code === "PAYMENT_REQUIRED") {
          Alert.alert("Subscription required", "You need to upgrade your plan to have access to this feature")
        } else {
          Alert.alert("An error occurred", error.message ? error.message : "An unknown error occurred")
        }
      },
    }),
  )

  const profileUtilsGetTranslationMutation = useMutation(
    trpc.profile.utils.getTranslation.mutationOptions({
      onSuccess: (data) => {
        MyModule.playAudio({ audio: data.audioBase64 })

        setCurrentAction((prev) => {
          if (!prev) return null
          return {
            ...prev,
            translation: { audioBase64: data.audioBase64, translation: data.translation, translationRomanized: data.translationRomanized },
          }
        })
      },
      onError: (error) => {
        if (error.data?.code === "PAYMENT_REQUIRED") {
          Alert.alert("Subscription required", "You need to upgrade your plan to have access to this feature")
        } else {
          Alert.alert("An error occurred", error.message ? error.message : "An unknown error occurred")
        }
      },
    }),
  )

  const [messages, setMessages] = useState<Message[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false)
  const [currentAction, setCurrentAction] = useState<CurrentAction | null>(null)

  const [audioInitialized, setAudioInitialized] = useState(false)
  const [sessionEnded, setSessionEnded] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [recordingLevel, setRecordingLevel] = useState(0)
  const [playbackLevel, setPlaybackLevel] = useState(0)

  const animatedScale = useRef(new Animated.Value(80)).current

  // Smooth progress bar animation
  const progressWidth = useSharedValue(100)

  const progressAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value}%`,
    }
  })

  // Cache for response suggestions to avoid duplicate fetches
  const [cachedSuggestions, setCachedSuggestions] = useState<Record<string, Suggestion[]>>({})

  const socketRef = useRef<Socket | null>(null)
  const sentUserMessageRef = useRef<string | null>(null)
  const sessionStartTimeRef = useRef<number>(Date.now())
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const bottomSheetTranscriptRef = useRef<BottomSheetModal>(null)
  const bottomSheetResponseSuggestionsRef = useRef<BottomSheetModal>(null)
  const bottomSheetSettingsRef = useRef<BottomSheetModal>(null)

  const endSession = useCallback(() => {
    setSessionEnded(true)

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
    }

    // Trigger feedback generation immediately when session ends
    void profileRoleplaySessionGenerateFeedbackMutation.mutateAsync({ roleplaySessionId: id, organizationId: currentOrganizationId })
  }, [id, currentOrganizationId, profileRoleplaySessionGenerateFeedbackMutation])

  const initializeSocket = useCallback((): void => {
    if (!id) throw new Error("Session ID is required")

    const practice: TPracticeSchema = {
      lessonSessionId: id,
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

    socketRef.current.on("action", (data: { messageId: string; action: TActionSchema }) => {
      console.log("Received action:", data)
      addActionToMessage(data)
    })

    socketRef.current.on("sessionEnded", () => {
      endSession()
      // Disconnect after server confirms session is ended
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    })
  }, [id])

  const goToEnded = () => {
    setIsNavigating(true)
    profileUpdateStreakDayMutation.mutate({ organizationId: currentOrganizationId })
  }

  // Navigate when both mutations are successful
  useEffect(() => {
    if (profileRoleplaySessionGenerateFeedbackMutation.isSuccess && profileUpdateStreakDayMutation.isSuccess) {
      const showStreak = profileUpdateStreakDayMutation.data.showStreak
      setIsNavigating(false)
      router.replace(`/lesson-session/${id}/ended?showStreak=${showStreak}`)
    }
  }, [profileRoleplaySessionGenerateFeedbackMutation.isSuccess, profileUpdateStreakDayMutation.isSuccess, profileUpdateStreakDayMutation.data, id])

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

  // Super smooth continuous progress bar animation
  useEffect(() => {
    const startTime = sessionStartTimeRef.current
    const totalDuration = 5 * 60 * 1000 // 5 minutes in milliseconds

    const animateProgress = () => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, totalDuration - elapsed)
      const percentage = (remaining / totalDuration) * 100

      progressWidth.value = percentage

      if (remaining > 0) {
        requestAnimationFrame(animateProgress)
      }
    }

    // Start the continuous animation
    requestAnimationFrame(animateProgress)
  }, [progressWidth])

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

  const addActionToMessage = (data: { messageId: string; action: TActionSchema }) => {
    setMessages((prev) => {
      // Find the message by ID
      const messageIndex = prev.findIndex((msg) => msg.id === data.messageId)
      if (messageIndex === -1) return prev

      const updatedMessages = [...prev]
      const currentMessage = updatedMessages[messageIndex]
      if (currentMessage) {
        updatedMessages[messageIndex] = {
          ...currentMessage,
          action: data.action,
        }
      }

      return updatedMessages
    })

    // Set the current action for display with empty cache
    setCurrentAction({
      action: data.action,
      pronunciation: null,
      translation: null,
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

  const getCurrentSuggestions = (): Suggestion[] => {
    const latestAssistantMessage = getLatestAssistantMessage()
    if (latestAssistantMessage) {
      const cached = cachedSuggestions[latestAssistantMessage.id]
      if (cached) return cached
    }
    return profileGetResponseSuggestionsMutation.data?.suggestions ?? []
  }

  const getLatestAssistantMessage = () => {
    return [...messages].reverse().find((msg) => msg.role === "assistant")
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

  const handleGetPronunciation = async () => {
    if (!currentAction) return
    if (currentAction.action.actionType !== "REPEAT") return

    // Use cached pronunciation if available
    if (currentAction.pronunciation) {
      MyModule.playAudio({ audio: currentAction.pronunciation.audioBase64 })
      return
    }

    // Fetch pronunciation if not cached
    await profileUtilsGetPronunciationMutation.mutateAsync({
      phrase: currentAction.action.targetContent,
      language: profileMe.data.learningLanguage,
      organizationId: currentOrganizationId,
    })
  }

  const handleGetTranslation = async () => {
    if (!currentAction) return
    if (currentAction.action.actionType !== "ANSWER") return

    // Use cached translation if available
    if (currentAction.translation) {
      MyModule.playAudio({ audio: currentAction.translation.audioBase64 })
      return
    }

    // Fetch translation if not cached
    await profileUtilsGetTranslationMutation.mutateAsync({
      phrase: currentAction.action.targetContent,
      sourceLanguage: profileMe.data.nativeLanguage,
      targetLanguage: profileMe.data.learningLanguage,
      organizationId: currentOrganizationId,
    })
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1, backgroundColor: "white" }}>
      <View className="flex flex-1 flex-col">
        {/* Header */}
        <View className="flex py-4">
          <Text className="mx-auto line-clamp-1 max-w-[80%] text-center text-xl font-semibold text-neutral-700">
            {profileLessonSessionGet.data.lesson.title}
          </Text>
        </View>

        {/* Progress Bar Timer */}
        <View className="mt-2 flex flex-row items-center gap-3 px-4">
          <View className="h-4 flex-1 rounded-full bg-neutral-200">
            <Reanimated.View className="h-full rounded-full bg-success-400" style={progressAnimatedStyle} />
          </View>
        </View>

        {/* Main content area */}
        <View className="mt-6 flex-1 flex-col items-center px-4">
          <View className="relative flex h-[60%] w-full items-center justify-center">
            <View className="absolute inset-0">
              <Rive url="https://assets.studyunfold.com/rives/fire.riv" style={{ width: "100%" }} />
            </View>
            <Pressable
              onPressIn={() => void startRecording()}
              onPressOut={() => void stopRecording()}
              className="flex h-full w-full items-center justify-center"
            />
          </View>

          <View className="flex h-[40%] w-full flex-col items-center justify-center">
            {sessionEnded && (
              <View className="items-center">
                <Text className="font-shantell-semibold text-center text-lg text-neutral-700">Your session has ended!</Text>
                <Text className="font-shantell-medium text-center text-base text-neutral-500">Click on "Review Session" to continue.</Text>
              </View>
            )}

            {!sessionEnded && !currentAction && (
              <View className="items-center">
                <Text className="font-shantell-semibold text-center text-lg text-neutral-700">Generating the content...</Text>
                <Text className="font-shantell-medium text-center text-base text-neutral-500">
                  Please wait while we prepare the content for your lesson.
                </Text>
              </View>
            )}

            {!sessionEnded && currentAction && currentAction.action.actionType === "REPEAT" && (
              <View className="w-full rounded-2xl border-2 border-neutral-100">
                <View className="flex flex-col gap-1 px-4 py-2">
                  <Text className="font-shantell-semibold text-center text-lg text-neutral-900">{currentAction.action.targetContent}</Text>
                  {currentAction.action.targetContentRomanized && (
                    <Text className="font-shantell-medium text-center text-base text-neutral-400">{currentAction.action.targetContentRomanized}</Text>
                  )}
                </View>
                <View className="h-0.5 bg-neutral-100" />
                <View className="flex flex-col gap-1 px-4 py-2">
                  <Text className="font-shantell-medium text-center text-base text-neutral-400">{currentAction.action.targetContentTranslated}</Text>
                </View>
                <View className="h-0.5 bg-neutral-100" />
                <View className="flex flex-row items-center justify-center gap-5 px-4 py-2">
                  <TouchableOpacity
                    onPress={handleGetPronunciation}
                    className="size-7 items-center justify-center rounded-xl"
                    disabled={!currentAction}
                  >
                    <Volume2Icon size={24} className="text-neutral-400" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {!sessionEnded && currentAction && currentAction.action.actionType === "ANSWER" && (
              <View className="w-full rounded-2xl border-2 border-neutral-100">
                <View className="flex flex-col gap-1 px-4 py-2">
                  <Text className="font-shantell-semibold text-center text-lg text-neutral-900">{currentAction.action.targetContent}</Text>
                  {currentAction.action.targetContentRomanized && (
                    <Text className="font-shantell-medium text-center text-base text-neutral-400">{currentAction.action.targetContentRomanized}</Text>
                  )}
                </View>
                {currentAction.translation && (
                  <>
                    <View className="h-0.5 bg-neutral-100" />
                    <View className="flex flex-col gap-1 px-4 py-2">
                      <Text className="font-shantell-medium text-center text-base text-neutral-700">{currentAction.translation.translation}</Text>
                      {currentAction.translation.translationRomanized && (
                        <Text className="font-shantell-medium text-center text-sm text-neutral-400">
                          {currentAction.translation.translationRomanized}
                        </Text>
                      )}
                    </View>
                  </>
                )}
                <View className="h-0.5 bg-neutral-100" />
                <View className="flex flex-row items-center justify-center gap-5 px-4 py-2">
                  <TouchableOpacity
                    onPress={handleGetTranslation}
                    className="size-7 items-center justify-center rounded-xl"
                    disabled={!currentAction}
                  >
                    <BadgeQuestionMarkIcon size={24} className="text-neutral-400" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Bottom */}
        <View className="mt-6 flex w-full flex-row items-end justify-center px-4">
          {!sessionEnded && (
            <View className="flex w-full flex-row items-end justify-evenly gap-4">
              {/* <OptionButton Icon={NotepadTextIcon} onPress={() => bottomSheetTranscriptRef.current?.present()} />
              <OptionButton Icon={LightbulbIcon} onPress={() => bottomSheetResponseSuggestionsRef.current?.present()} /> */}
              <OptionButton Icon={SettingsIcon} onPress={() => bottomSheetSettingsRef.current?.present()} />
              {/* Record */}
              <View className="flex flex-col items-center gap-5">
                {/* <Text className="font-shantell-medium text-xs text-neutral-400">Hold to speak</Text> */}
                <Pressable
                  onPressIn={() => void startRecording()}
                  onPressOut={() => void stopRecording()}
                  className={cn(`flex size-24 items-center justify-center rounded-full`, isRecording ? "bg-error-600" : "bg-neutral-800")}
                >
                  <Microphone color="white" height={56} width={56} />
                  {/* {isRecording ? <Square size={56} color="white" fill="white" /> : <Mic size={56} className="text-white" />} */}
                </Pressable>
              </View>
              <OptionButton Icon={XIcon} onPress={() => handleEndSession()} />
            </View>
          )}
          {sessionEnded && (
            <Button.Root className="w-full" size="lg" variant="primary" onPress={goToEnded} loading={isNavigating}>
              <Button.Icon icon={PlayIcon} />
              <Button.Text>Review Session</Button.Text>
            </Button.Root>
          )}
        </View>
      </View>

      <BottomSheetSettings
        ref={bottomSheetSettingsRef}
        isResponseSuggestionsLoading={profileGetResponseSuggestionsMutation.isPending}
        onOpenTranscript={() => bottomSheetTranscriptRef.current?.present()}
        onOpenResponseSuggestions={() => void handleGetResponseSuggestions()}
      />
      <BottomSheetTranscript ref={bottomSheetTranscriptRef} messages={messages} />
      <BottomSheetResponseSuggestions ref={bottomSheetResponseSuggestionsRef} suggestions={getCurrentSuggestions()} />
    </SafeAreaView>
  )
}

export default LessonSession

type OptionButtonProps = {
  Icon: LucideIcon
  onPress: () => void
}
const OptionButton: FC<OptionButtonProps> = ({ Icon, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} className={cn("size-16 items-center justify-center rounded-full bg-neutral-100")}>
      <Icon size={26} strokeWidth={2.5} className="text-neutral-500" />
    </TouchableOpacity>
  )
}
