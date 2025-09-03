import type { FC } from "react"
import type { Socket } from "socket.io-client"
import { useEffect, useRef, useState } from "react"
import { Audio } from "expo-av"
import * as FileSystem from "expo-file-system"
import { Mic, Send, Square } from "lucide-react-native"
import { Alert, ScrollView, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { io } from "socket.io-client"

import { Text } from "~/ui/text"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  isFinal: boolean
}

const RecordTest: FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! How can I assist you today?",
      sender: "bot",
      isFinal: true,
    },
  ])
  const [userInput, setUserInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [audioInitialized, setAudioInitialized] = useState(false)
  const [recordedAudioUri, setRecordedAudioUri] = useState<string | null>(null)

  const socketRef = useRef<Socket | null>(null)
  const recordingRef = useRef<Audio.Recording | null>(null)
  const soundRef = useRef<Audio.Sound | null>(null)
  const scrollViewRef = useRef<ScrollView>(null)
  const currentUserMessageRef = useRef<string | null>(null)
  const currentBotMessageRef = useRef<string | null>(null)
  const sentUserMessageRef = useRef<string | null>(null)

  const initializeSocket = (): void => {
    // Replace with your server URL
    socketRef.current = io("http://localhost:3002")

    socketRef.current.on("connect", () => {
      console.log("Connected to server")
    })

    socketRef.current.on("displayUserMessage", ({ text, isFinal }: { text: string; isFinal: boolean }) => {
      displayUserMessage(text, isFinal)
    })

    socketRef.current.on("conversationUpdate", ({ text, isFinal }: { text: string; isFinal: boolean }) => {
      updateBotMessage(text, isFinal)

      if (isFinal) {
        setTimeout(() => {
          setIsPlayingAudio(false)
          console.log("Audio playback completed")
        }, 1000)
      }
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
  }

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
  }, [])

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

  const displayUserMessage = (text: string, isFinal = false) => {
    if (!currentUserMessageRef.current) {
      const messageId = Date.now().toString()
      currentUserMessageRef.current = messageId

      setMessages((prev) => [
        ...prev,
        {
          id: messageId,
          text: `You: ${text}`,
          sender: "user",
          isFinal,
        },
      ])
    } else {
      setMessages((prev) => prev.map((msg) => (msg.id === currentUserMessageRef.current ? { ...msg, text: `You: ${text}`, isFinal } : msg)))
    }

    // Handle typed messages
    if (sentUserMessageRef.current && text === "(item sent)") {
      const sentMessage = sentUserMessageRef.current
      sentUserMessageRef.current = null

      setMessages((prev) => prev.map((msg) => (msg.id === currentUserMessageRef.current ? { ...msg, text: `You: ${sentMessage}` } : msg)))
    }

    scrollToBottom()

    if (isFinal) {
      currentUserMessageRef.current = null
    }
  }

  const updateBotMessage = (newText: string, isFinal = false) => {
    if (!currentBotMessageRef.current) {
      const messageId = Date.now().toString()
      currentBotMessageRef.current = messageId

      setMessages((prev) => [
        ...prev,
        {
          id: messageId,
          text: `Assistant: ${newText}`,
          sender: "bot",
          isFinal,
        },
      ])
    } else {
      setMessages((prev) => prev.map((msg) => (msg.id === currentBotMessageRef.current ? { ...msg, text: `Assistant: ${newText}`, isFinal } : msg)))
    }

    scrollToBottom()

    if (isFinal) {
      currentBotMessageRef.current = null
    }
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }

  const startRecording = async (): Promise<void> => {
    if (!isRecording) {
      try {
        await initializeAudio()

        setIsRecording(true)
        setRecordedAudioUri(null)

        // Add visual feedback for recording
        displayUserMessage("🎤 Recording...", false)

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
        displayUserMessage("❌ Failed to start recording. Please check microphone permissions.", true)
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

        // Update UI to show processing
        displayUserMessage("🔄 Processing audio...", false)

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
            displayUserMessage("🎵 Audio sent, waiting for response...", true)
          } else {
            console.warn("No audio data in recorded file")
            displayUserMessage("⚠️ No audio data in recorded file", true)
          }
        } else {
          console.warn("No audio file was created")
          displayUserMessage("⚠️ No audio recorded - check microphone permissions and try speaking", true)
        }

        console.log("Stopped recording and sent complete audio")
      } catch (error) {
        console.error("Failed to stop recording:", error)
        displayUserMessage("❌ Error stopping recording", true)
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
            <View
              key={message.id}
              className={`mb-3 rounded-lg p-3 ${
                message.sender === "user" ? "max-w-[80%] self-end bg-blue-100" : "max-w-[80%] self-start bg-gray-100"
              }`}
            >
              <Text className={`${message.sender === "user" ? "text-blue-800" : "text-gray-800"}`}>{message.text}</Text>
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

export default RecordTest
