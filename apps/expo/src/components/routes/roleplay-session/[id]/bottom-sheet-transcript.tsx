import type { FC } from "react"
import React, { forwardRef, useState } from "react"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { CheckCircle, Circle, X, XCircle, Zap } from "lucide-react-native"
import { ActivityIndicator, Dimensions, ScrollView, TouchableOpacity, View } from "react-native"
import Markdown from "react-native-markdown-display"

import type { TFeedbackSchema } from "@acme/validators"

import { markdownStyles } from "~/components/common/markdown"
import { BottomSheetBackdrop } from "~/ui/bottom-sheet"
import { Text } from "~/ui/text"
import { cn } from "~/utils/utils"

type Message = {
  id: string
  role: "user" | "assistant"
  transcript: string
  feedback?: TFeedbackSchema
}

type FeedbackIconProps = {
  message: Message
}

enum FeedbackGrade {
  Excellent = "excellent",
  Good = "good",
  NeedsImprovement = "needs-improvement",
  Poor = "poor",
}

const getFeedbackGrade = (quality: number): FeedbackGrade => {
  if (quality >= 85) return FeedbackGrade.Excellent
  if (quality >= 70) return FeedbackGrade.Good
  if (quality >= 50) return FeedbackGrade.NeedsImprovement
  return FeedbackGrade.Poor
}

const FeedbackIcon: React.FC<FeedbackIconProps> = ({ message }) => {
  if (!message.feedback) {
    // Show spinner when waiting for feedback
    return (
      <View className="h-8 w-8 items-center justify-center rounded-full bg-gray-100">
        <ActivityIndicator size="small" color="#6B7280" />
      </View>
    )
  }

  const grade = getFeedbackGrade(message.feedback.quality)

  let IconComponent: React.ReactNode
  let containerStyle: string

  switch (grade) {
    case FeedbackGrade.Excellent:
      IconComponent = <CheckCircle size={20} strokeWidth={2} color="#16A34A" />
      containerStyle = "bg-green-100 border-green-200"
      break
    case FeedbackGrade.Good:
      IconComponent = <Zap size={20} strokeWidth={2} color="#2563EB" />
      containerStyle = "bg-blue-100 border-blue-200"
      break
    case FeedbackGrade.NeedsImprovement:
      IconComponent = <Circle size={20} strokeWidth={2} color="#D97706" />
      containerStyle = "bg-yellow-100 border-yellow-200"
      break
    case FeedbackGrade.Poor:
      IconComponent = <XCircle size={20} strokeWidth={2} color="#DC2626" />
      containerStyle = "bg-red-100 border-red-200"
      break
    default:
      throw new Error("Invalid feedback grade")
  }

  return <View className={cn(`size-8 items-center justify-center rounded-full border`, containerStyle)}>{IconComponent}</View>
}

type UserMessageProps = {
  message: Message
}

const UserMessage: FC<UserMessageProps> = ({ message }) => {
  const [expandedFeedback, setExpandedFeedback] = useState<boolean>(false)
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          if (message.feedback) {
            setExpandedFeedback(!expandedFeedback)
          }
        }}
        className="flex w-full flex-row items-center justify-end gap-3"
      >
        <FeedbackIcon message={message} />

        <View className="flex max-w-[80%] break-words rounded-xl bg-blue-600 px-3.5 py-0.5">
          <Markdown style={{ ...markdownStyles, body: { color: "#FFFFFF" } }}>{message.transcript}</Markdown>
        </View>
      </TouchableOpacity>

      {/* Feedback display - only show when expanded */}
      {message.feedback && expandedFeedback && (
        <View className="mt-2 max-w-[90%] self-end rounded-lg border border-blue-200 bg-blue-50 p-4">
          {/* Header with quality score and close button */}
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-blue-800">📝 Feedback</Text>
            <View className="flex-row items-center gap-2">
              <View className="rounded-full bg-blue-100 px-2 py-1">
                <Text className="text-xs font-bold text-blue-700">{message.feedback.quality}/100</Text>
              </View>
              <TouchableOpacity
                onPress={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setExpandedFeedback(false)
                }}
                className="h-6 w-6 items-center justify-center rounded-full bg-blue-200"
              >
                <X size={12} color="#1E40AF" />
              </TouchableOpacity>
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
    </>
  )
}

type AssistantMessageProps = {
  message: Message
}

const AssistantMessage: FC<AssistantMessageProps> = ({ message }) => {
  return (
    <View className="flex w-full max-w-[85%] flex-row gap-3">
      <View className="flex flex-1 flex-row break-words rounded-xl bg-neutral-100 px-3.5 py-0.5">
        <Markdown style={markdownStyles}>{message.transcript}</Markdown>
      </View>
    </View>
  )
}

type Props = {
  messages: Message[]
}

export const BottomSheetTranscript = forwardRef<BottomSheetModal, Props>(({ messages }, ref) => {
  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={["80%"]}
      maxDynamicContentSize={Dimensions.get("window").height * 0.8}
      backdropComponent={BottomSheetBackdrop}
      enablePanDownToClose
      stackBehavior="push"
      enableDynamicSizing={false}
    >
      <View className="flex-1">
        {/* Fixed Header */}
        <View className="border-b border-neutral-200 px-4 pb-4 pt-1">
          <Text className="text-center text-lg font-bold">Conversation Transcript</Text>
        </View>

        {/* Scrollable Content*/}
        <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
          <View className="flex flex-col gap-3 pb-10">
            {messages.map((message) => (
              <View key={message.id}>
                {message.role === "user" && <UserMessage message={message} />}
                {message.role === "assistant" && <AssistantMessage message={message} />}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </BottomSheetModal>
  )
})

BottomSheetTranscript.displayName = "TranscriptBottomSheet"
