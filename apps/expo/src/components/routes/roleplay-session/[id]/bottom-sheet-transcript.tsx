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
        <View className="shadow-custom-sm mt-3 max-w-[92%] self-end rounded-2xl border border-neutral-200 bg-white p-6">
          {/* Header with quality score and close button */}
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-lg font-bold">Feedback</Text>
            <View className="flex-row items-center gap-3">
              <View className="rounded-xl bg-blue-600 px-4 py-2">
                <Text className="text-sm font-bold text-white">{message.feedback.quality}/100</Text>
              </View>
              <TouchableOpacity
                onPress={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setExpandedFeedback(false)
                }}
                className="h-9 w-9 items-center justify-center rounded-full bg-neutral-100 active:bg-neutral-200"
              >
                <X size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Main feedback */}
          <View className="mb-5 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <View className="mb-2 flex-row items-center gap-2">
              <View className="h-6 w-6 items-center justify-center rounded-full bg-neutral-200">
                <Text className="text-xs">💬</Text>
              </View>
              <Text className="text-sm font-semibold text-neutral-800">Overall Feedback</Text>
            </View>
            <Text className="text-sm leading-relaxed text-neutral-700">{message.feedback.feedback}</Text>
          </View>

          {/* Corrected phrase */}
          {message.feedback.correctedPhrase !== message.transcript && (
            <View className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4">
              <View className="mb-2 flex-row items-center gap-2">
                <View className="h-6 w-6 items-center justify-center rounded-full bg-green-100">
                  <Text className="text-xs">✨</Text>
                </View>
                <Text className="text-sm font-semibold text-green-800">Corrected Version</Text>
              </View>
              <Text className="text-sm font-medium text-green-900">"{message.feedback.correctedPhrase}"</Text>
            </View>
          )}

          {/* Individual corrections */}
          {message.feedback.corrections.length > 0 && (
            <View className="mb-5">
              <View className="mb-3 flex-row items-center gap-2">
                <View className="h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                  <Text className="text-xs">🔍</Text>
                </View>
                <Text className="text-sm font-semibold text-gray-800">Specific Corrections</Text>
              </View>
              {message.feedback.corrections.map((correction, index) => (
                <View key={index} className="mb-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <View className="mb-2 flex-row flex-wrap items-center">
                    <View className="rounded-lg bg-red-100 px-2 py-1">
                      <Text className="text-sm text-red-700 line-through">"{correction.wrong}"</Text>
                    </View>
                    <Text className="mx-2 text-sm text-gray-400">→</Text>
                    <View className="rounded-lg bg-green-100 px-2 py-1">
                      <Text className="text-sm font-medium text-green-700">"{correction.correct}"</Text>
                    </View>
                  </View>
                  <Text className="text-sm text-gray-600">{correction.explanation}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Scoring breakdown */}
          <View>
            <View className="mb-4 flex-row items-center gap-2">
              <View className="h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                <Text className="text-xs">📊</Text>
              </View>
              <Text className="text-sm font-semibold text-gray-800">Performance Breakdown</Text>
            </View>
            <View className="flex flex-col gap-3">
              {/* Accuracy Score */}
              <View className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <View className="mb-3 flex-row items-center justify-between">
                  <Text className="text-base font-semibold text-blue-900">Accuracy</Text>
                  <View className="rounded-lg bg-blue-600 px-3 py-1">
                    <Text className="text-sm font-bold text-white">{message.feedback.accuracy.score}</Text>
                  </View>
                </View>
                <Text className="text-sm text-blue-800">{message.feedback.accuracy.message}</Text>
              </View>

              {/* Fluency Score */}
              <View className="rounded-xl border border-purple-200 bg-purple-50 p-4">
                <View className="mb-3 flex-row items-center justify-between">
                  <Text className="text-base font-semibold text-purple-900">Fluency</Text>
                  <View className="rounded-lg bg-purple-600 px-3 py-1">
                    <Text className="text-sm font-bold text-white">{message.feedback.fluency.score}</Text>
                  </View>
                </View>
                <Text className="text-sm text-purple-800">{message.feedback.fluency.message}</Text>
              </View>

              {/* Vocabulary Score */}
              <View className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <View className="mb-3 flex-row items-center justify-between">
                  <Text className="text-base font-semibold text-emerald-900">Vocabulary</Text>
                  <View className="rounded-lg bg-emerald-600 px-3 py-1">
                    <Text className="text-sm font-bold text-white">{message.feedback.vocabulary.score}</Text>
                  </View>
                </View>
                <Text className="text-sm text-emerald-800">{message.feedback.vocabulary.message}</Text>
              </View>
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
