import type { FC } from "react"
import type { Socket } from "socket.io-client"
import { useCallback, useEffect, useRef, useState } from "react"
import { Audio } from "expo-av"
import * as FileSystem from "expo-file-system"
import { useLocalSearchParams } from "expo-router"
import { Mic, Send, Square } from "lucide-react-native"
import { Alert, ScrollView, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { io } from "socket.io-client"

import type { TFeedbackSchema, TPracticeSchema } from "@acme/validators"

import { Text } from "~/ui/text"
import { getWsBaseUrl } from "~/utils/base-url"
import { getBearerToken } from "~/utils/bearer-store"

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
  const [userInput, setUserInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [audioInitialized, setAudioInitialized] = useState(false)
  const [_recordedAudioUri, setRecordedAudioUri] = useState<string | null>(null)

  const socketRef = useRef<Socket | null>(null)
  const recordingRef = useRef<Audio.Recording | null>(null)
  const soundRef = useRef<Audio.Sound | null>(null)
  const scrollViewRef = useRef<ScrollView>(null)
  const sentUserMessageRef = useRef<string | null>(null)

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

    socketRef.current.on("displayUserMessage", ({ id, text }: { id: string; text: string }) => {
      displayUserMessage(id, text)
    })

    socketRef.current.on("conversationUpdate", ({ id, text }: { id: string; text: string }) => {
      updateBotMessage(id, text)
    })

    socketRef.current.on("audioStream", async (arrayBuffer: ArrayBuffer, id: string) => {
      if (arrayBuffer.byteLength > 0) {
        try {
          await playAudioChunk(arrayBuffer, id)
        } catch (error) {
          console.error("Error playing audio:", error)
          setIsPlayingAudio(false)
        }
      }
    })

    socketRef.current.on("conversationInterrupted", () => {
      void interruptAudio()
    })

    socketRef.current.on("feedback", (data: { messageId: string; feedback: TFeedbackSchema }) => {
      addFeedbackToMessage(data)
    })
  }, [id])

  useEffect(() => {
    initializeSocket()
    void initializeAudio()

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
      console.log("Audio initialized successfully")
    } catch (error) {
      console.error("Failed to initialize audio:", error)
      Alert.alert("Error", "Failed to initialize audio. Please check permissions.")
    }
  }

  const sendMessage = async () => {
    const message = userInput.trim()
    if (message && socketRef.current) {
      if (!audioInitialized) {
        await initializeAudio()
      }

      sentUserMessageRef.current = message
      socketRef.current.emit("userMessage", message)
      setUserInput("")
    }
  }

  const displayUserMessage = (id: string, transcript: string) => {
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
            transcript,
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
            transcript,
          },
        ]
      }
    })

    // Handle typed messages
    if (sentUserMessageRef.current && transcript === "(item sent)") {
      const sentMessage = sentUserMessageRef.current
      sentUserMessageRef.current = null

      setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, transcript: sentMessage } : msg)))
    }

    scrollToBottom()
  }

  const updateBotMessage = (id: string, transcript: string) => {
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
            transcript,
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
            transcript,
          },
        ]
      }
    })

    scrollToBottom()
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 100)
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

    scrollToBottom()
  }

  const startRecording = async (): Promise<void> => {
    if (!isRecording) {
      try {
        await initializeAudio()

        setIsRecording(true)
        setRecordedAudioUri(null)

        // Add visual feedback for recording
        displayUserMessage(`recording-${Date.now()}`, "🎤 Recording...")

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
        displayUserMessage(`error-${Date.now()}`, "❌ Failed to start recording. Please check microphone permissions.")
        Alert.alert("Error", "Failed to start recording. Please check microphone permissions.")
      }
    }
  }

  const convertAudioFileToArrayBuffer = async (uri: string): Promise<ArrayBuffer | null> => {
    try {
      // Read the file as base64
      const base64Audio = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      })

      // Convert base64 to ArrayBuffer
      const binaryString = atob(base64Audio)
      const bytes = new Uint8Array(binaryString.length)

      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      console.log(`Converted audio file: ${bytes.byteLength} bytes`)
      return bytes.buffer
    } catch (error) {
      console.error("Error converting audio file:", error)
      return null
    }
  }

  const stopRecording = async (): Promise<void> => {
    if (isRecording) {
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
          setRecordedAudioUri(uri)
          console.log("Audio recorded at:", uri)

          // Read the audio file and convert to ArrayBuffer
          const audioData = await convertAudioFileToArrayBuffer(uri)

          if (audioData && audioData.byteLength > 0) {
            // Send complete audio to server
            if (socketRef.current) {
              socketRef.current.emit("completeAudio", audioData)
              console.log(`Sent complete audio: ${audioData.byteLength} bytes`)
            }

            // Update UI to show audio was sent
            displayUserMessage(`sent-${Date.now()}`, "🎵 Audio sent, waiting for response...")
          } else {
            console.warn("No audio data in recorded file")
            displayUserMessage(`error-${Date.now()}`, "⚠️ No audio data in recorded file")
          }
        } else {
          console.warn("No audio file was created")
          displayUserMessage(`error-${Date.now()}`, "⚠️ No audio recorded - check microphone permissions and try speaking")
        }

        console.log("Stopped recording and sent complete audio")
      } catch (error) {
        console.error("Failed to stop recording:", error)
        displayUserMessage(`error-${Date.now()}`, "❌ Error stopping recording")
      }
    }
  }

  const playAudioChunk = async (arrayBuffer: ArrayBuffer, id: string) => {
    try {
      // Convert ArrayBuffer to base64 for expo-av
      const uint8Array = new Uint8Array(arrayBuffer)
      const base64String = btoa(String.fromCharCode.apply(null, Array.from(uint8Array)))
      const uri = `data:audio/wav;base64,${base64String}`

      const { sound } = await Audio.Sound.createAsync({ uri })
      soundRef.current = sound

      if (!isPlayingAudio) {
        setIsPlayingAudio(true)
        console.log("Started playing audio response")
      }

      await sound.playAsync()
      console.log(`Playing audio chunk with ID: ${id}`)
    } catch (error) {
      console.error("Error playing audio chunk:", error)
    }
  }

  const interruptAudio = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync()
        await soundRef.current.unloadAsync()
        soundRef.current = null
      }

      setIsPlayingAudio(false)
      console.log("Audio playback interrupted")

      if (socketRef.current) {
        socketRef.current.emit("cancelResponse", { trackId: "current", offset: 0 })
      }
    } catch (error) {
      console.error("Error interrupting audio:", error)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View className="flex flex-1 flex-col">
        <ScrollView ref={scrollViewRef} className="flex-1 px-4 py-2" showsVerticalScrollIndicator={false}>
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

        <View className="border-t border-gray-200 px-4 py-3">
          <View className="flex-row items-center gap-2">
            <TextInput
              value={userInput}
              onChangeText={setUserInput}
              placeholder="Type your message..."
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-base"
              onSubmitEditing={sendMessage}
              returnKeyType="send"
              editable={!isRecording}
            />

            <TouchableOpacity onPress={sendMessage} className="rounded-lg bg-blue-500 p-2" disabled={!userInput.trim() || isRecording}>
              <Send size={20} color="white" />
            </TouchableOpacity>

            {!isRecording ? (
              <TouchableOpacity onPress={() => void startRecording()} className="rounded-lg bg-green-500 p-2" disabled={!audioInitialized}>
                <Mic size={20} color="white" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => void stopRecording()} className="rounded-lg bg-red-500 p-2">
                <Square size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default RoleplaySession
