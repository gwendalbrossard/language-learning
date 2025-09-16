import type { FC } from "react"
import type { Socket } from "socket.io-client"
import { forwardRef, useCallback, useEffect, useRef, useState } from "react"
import { Audio } from "expo-av"
import * as FileSystem from "expo-file-system"
import { useLocalSearchParams } from "expo-router"
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet"
import { FileTextIcon, Mic, Square, X } from "lucide-react-native"
import { Alert, Dimensions, NativeEventEmitter, NativeModules, Pressable, ScrollView, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { io } from "socket.io-client"

import type { TFeedbackSchema, TPracticeSchema } from "@acme/validators"

import { BottomSheetBackdrop } from "~/ui/bottom-sheet"
import * as Button from "~/ui/button"
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

  const socketRef = useRef<Socket | null>(null)
  const recordingRef = useRef<Audio.Recording | null>(null)
  const soundRef = useRef<Audio.Sound | null>(null)
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
      MyModule.playAudio({ delta: data.delta })
    })

    socketRef.current.on("assistantAudioDone", (data: { itemId: string }) => {
      console.log(`Assistant audio stream completed for itemId: ${data.itemId}`)

      setIsAssistantSpeaking(false)
      setTurnState("user")
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
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
      if (recordingRef.current) {
        void recordingRef.current.stopAndUnloadAsync()
      }
      if (soundRef.current) {
        void soundRef.current.unloadAsync()
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
      // PlayAudioContinuouslyManager handles cleanup automatically
    }
  }, [initializeSocket])

  const initializeAudio = async (): Promise<void> => {
    try {
      const { status } = await Audio.requestPermissionsAsync()
      if (status !== Audio.PermissionStatus.GRANTED) {
        Alert.alert("Error", "Microphone permission is required for audio recording.")
        return
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      })

      setAudioInitialized(true)
      console.log("Audio initialized successfully - PlayAudioContinuouslyManager auto-initialized")
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

  const TranscriptBottomSheet = forwardRef<BottomSheetModal, object>((_, ref) => {
    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={["80%"]}
        maxDynamicContentSize={Dimensions.get("window").height * 0.8}
        backdropComponent={BottomSheetBackdrop}
        enablePanDownToClose
        stackBehavior="push"
      >
        <BottomSheetView className="flex-1 px-4 pb-10 pt-2">
          <View className="mb-4">
            <Text className="text-center text-lg font-semibold text-gray-800">Conversation Transcript</Text>
          </View>
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {messages.map((message) => (
              <View key={message.id} className="mb-3">
                <View
                  className={`rounded-lg p-3 ${message.role === "user" ? "max-w-[80%] self-end bg-blue-100" : "max-w-[80%] self-start bg-gray-100"}`}
                >
                  <Text className={`${message.role === "user" ? "text-blue-800" : "text-gray-800"}`}>{message.transcript}</Text>
                </View>

                {/* Feedback display */}
                {message.feedback && (
                  <View className="mt-2 max-w-[90%] self-end rounded-lg border border-blue-200 bg-blue-50 p-4">
                    {/* Header with quality score */}
                    <View className="mb-3 flex-row items-center justify-between">
                      <Text className="text-sm font-semibold text-blue-800">📝 Feedback</Text>
                      <View className="rounded-full bg-blue-100 px-2 py-1">
                        <Text className="text-xs font-bold text-blue-700">{message.feedback.quality}/100</Text>
                      </View>
                    </View>

                    {/* Main feedback */}
                    <View className="mb-3">
                      <Text className="text-sm text-blue-700">{message.feedback.feedback}</Text>
                    </View>

                    {/* Corrected phrase */}
                    {message.feedback.correctedPhrase !== message.transcript && (
                      <View className="mb-3 rounded-lg bg-green-100 p-2">
                        <Text className="mb-1 text-xs font-semibold text-green-700">✨ Corrected:</Text>
                        <Text className="text-sm font-medium text-green-800">"{message.feedback.correctedPhrase}"</Text>
                      </View>
                    )}

                    {/* Individual corrections */}
                    {message.feedback.corrections.length > 0 && (
                      <View className="mb-3">
                        <Text className="mb-2 text-xs font-semibold text-blue-700">🔍 Specific Corrections:</Text>
                        {message.feedback.corrections.map((correction, index) => (
                          <View key={index} className="mb-2 rounded-lg bg-yellow-50 p-2">
                            <View className="mb-1 flex-row">
                              <Text className="text-xs text-red-600 line-through">"{correction.wrong}"</Text>
                              <Text className="mx-1 text-xs text-gray-500">→</Text>
                              <Text className="text-xs font-medium text-green-600">"{correction.correct}"</Text>
                            </View>
                            <Text className="text-xs italic text-gray-600">{correction.explanation}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Scoring breakdown */}
                    <View className="mb-3">
                      <Text className="mb-2 text-xs font-semibold text-blue-700">📊 Detailed Scores:</Text>
                      <View className="space-y-1">
                        <View className="flex-row items-center justify-between">
                          <Text className="text-xs text-gray-600">Accuracy:</Text>
                          <Text className="text-xs font-medium text-blue-600">{message.feedback.accuracy.score}/100</Text>
                        </View>
                        <Text className="text-xs italic text-gray-500">{message.feedback.accuracy.message}</Text>

                        <View className="flex-row items-center justify-between">
                          <Text className="text-xs text-gray-600">Fluency:</Text>
                          <Text className="text-xs font-medium text-blue-600">{message.feedback.fluency.score}/100</Text>
                        </View>
                        <Text className="text-xs italic text-gray-500">{message.feedback.fluency.message}</Text>

                        <View className="flex-row items-center justify-between">
                          <Text className="text-xs text-gray-600">Vocabulary:</Text>
                          <Text className="text-xs font-medium text-blue-600">{message.feedback.vocabulary.score}/100</Text>
                        </View>
                        <Text className="text-xs italic text-gray-500">{message.feedback.vocabulary.message}</Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    )
  })

  const startRecording = async (): Promise<void> => {
    console.log("startRecording called - sessionEnded:", sessionEnded, "turnState:", turnState, "isRecording:", isRecording)

    if (sessionEnded || turnState !== "user") {
      console.log("Recording blocked - sessionEnded:", sessionEnded, "turnState:", turnState)
      return
    }

    if (!isRecording) {
      try {
        console.log("Starting recording...")
        await initializeAudio()

        setIsRecording(true)

        console.log("Requesting microphone access...")

        if (recordingRef.current) {
          await recordingRef.current.stopAndUnloadAsync()
        }

        const recording = new Audio.Recording()
        await recording.prepareToRecordAsync({
          android: {
            extension: ".wav",
            outputFormat: Audio.AndroidOutputFormat.DEFAULT,
            audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
            sampleRate: 24000,
            numberOfChannels: 1,
            bitRate: 128000,
          },
          ios: {
            extension: ".wav",
            outputFormat: Audio.IOSOutputFormat.LINEARPCM,
            audioQuality: Audio.IOSAudioQuality.HIGH,
            sampleRate: 24000,
            numberOfChannels: 1,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
          },
          web: {
            mimeType: "audio/wav",
            bitsPerSecond: 128000,
          },
        })

        recordingRef.current = recording
        await recording.startAsync()

        console.log("Started recording successfully")
      } catch (error) {
        console.error("Error starting recording:", error)
        setIsRecording(false)
        userTextDelta(`error-${Date.now()}`, "❌ Failed to start recording. Please check microphone permissions.")
        Alert.alert("Error", "Failed to start recording. Please check microphone permissions.")
      }
    }
  }

  const stopRecording = async (): Promise<void> => {
    console.log("stopRecording called - isRecording:", isRecording)

    if (isRecording) {
      console.log("Stopping recording...")
      setIsRecording(false)

      try {
        let uri: string | null = null

        if (recordingRef.current) {
          // Stop the recording and get the URI
          await recordingRef.current.stopAndUnloadAsync()
          uri = recordingRef.current.getURI()
          recordingRef.current = null
        }

        if (uri) {
          console.log("Audio recorded at:", uri)

          // Read the audio file as base64
          const base64Audio = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          })

          if (base64Audio && base64Audio.length > 0) {
            // Send complete audio to server as base64
            if (socketRef.current) {
              socketRef.current.emit("completeAudio", base64Audio)
              console.log(`Sent complete audio as base64: ${base64Audio.length} characters`)
            }
          } else {
            console.warn("No audio data in recorded file")
            userTextDelta(`error-${Date.now()}`, "⚠️ No audio data in recorded file")
          }
        } else {
          console.warn("No audio file was created")
          userTextDelta(`error-${Date.now()}`, "⚠️ No audio recorded - check microphone permissions and try speaking")
        }

        console.log("Stopped recording and sent complete audio as base64")
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

        {/* Main content area - Turn-based UI */}
        <View className="flex-1 items-center justify-center px-4">
          {turnState === "user" && !isRecording && (
            <View className="items-center">
              <Text className="mb-6 text-center text-lg text-gray-600">Your turn to speak</Text>
              <Pressable
                onPressIn={() => void startRecording()}
                onPressOut={() => void stopRecording()}
                className="h-32 w-32 items-center justify-center rounded-full bg-blue-500 shadow-lg"
                disabled={!audioInitialized || sessionEnded}
              >
                <Mic size={48} color="white" />
              </Pressable>
              <Text className="mt-4 text-center text-sm text-gray-500">Hold to speak</Text>
            </View>
          )}

          {isRecording && (
            <View className="items-center">
              <Text className="mb-6 text-center text-lg text-red-600">Recording...</Text>
              <Pressable onPressOut={() => void stopRecording()} className="h-32 w-32 items-center justify-center rounded-full bg-red-500 shadow-lg">
                <Square size={48} color="white" fill="white" />
              </Pressable>
              <Text className="mt-4 text-center text-sm text-gray-500">Release to send</Text>
            </View>
          )}

          {turnState === "assistant" && isAssistantSpeaking && (
            <View className="items-center">
              <Text className="mb-6 text-center text-lg text-blue-600">Assistant is speaking...</Text>
              <View className="h-32 w-32 items-center justify-center rounded-lg bg-blue-500 shadow-lg">
                <Square size={48} color="white" fill="white" />
              </View>
              <Text className="mt-4 text-center text-sm text-gray-500">Please wait</Text>
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

      <TranscriptBottomSheet ref={transcriptBottomSheetRef} />
    </SafeAreaView>
  )
}

export default RoleplaySession
