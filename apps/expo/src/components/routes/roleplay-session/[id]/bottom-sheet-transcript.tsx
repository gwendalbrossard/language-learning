import type { FC } from "react"
import React, { forwardRef, useState } from "react"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { CheckIcon, XIcon } from "lucide-react-native"
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

const FeedbackIcon: React.FC<FeedbackIconProps> = ({ message }) => {
  if (!message.feedback) {
    // Show spinner when waiting for feedback
    return (
      <View className="h-8 w-8 items-center justify-center rounded-full bg-neutral-100">
        <ActivityIndicator size="small" color="#6B7280" />
      </View>
    )
  }

  // If feedback is correct (no corrections needed), show a check icon
  if (message.feedback.isCorrect) {
    return (
      <View className={cn(`size-8 items-center justify-center rounded-full border`, "border-success-100 bg-success-50")}>
        <CheckIcon size={20} strokeWidth={2} color="#16A34A" />
      </View>
    )
  }

  // If feedback exists (corrections needed), show an info icon
  return (
    <View className={cn(`size-8 items-center justify-center rounded-full border`, "border-error-100 bg-error-50")}>
      <XIcon size={20} strokeWidth={2} color="#D97706" />
    </View>
  )
}

type UserMessageProps = {
  message: Message
}

const UserMessage: FC<UserMessageProps> = ({ message }) => {
  const [width, setWidth] = useState(0)
  const [expandedFeedback, setExpandedFeedback] = useState<boolean>(false)

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          if (message.feedback && !message.feedback.isCorrect) {
            setExpandedFeedback(!expandedFeedback)
          }
        }}
        className="flex w-full flex-row items-center justify-end gap-3"
      >
        <View className="flex flex-col items-end">
          <View className="flex flex-row items-center gap-3">
            <FeedbackIcon message={message} />

            <View
              onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
              className="z-10 flex max-w-[80%] break-words rounded-xl bg-blue-600 px-3.5 py-0.5"
            >
              <Markdown style={{ ...markdownStyles, body: { color: "#FFFFFF" } }}>{message.transcript}</Markdown>
            </View>
          </View>

          {message.feedback && !message.feedback.isCorrect && expandedFeedback && (
            <View className="-mt-4 flex flex-col gap-3 rounded-b-xl bg-primary-50 px-3.5 pb-4 pt-8" style={{ width: width }}>
              <Text className="text-sm text-primary-600">{message.feedback.correctedPhrase}</Text>
              <View className="h-px w-full bg-primary-200" />
              <Text className="text-sm text-primary-600">{message.feedback.feedback}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
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
          <Text className="text-center text-lg font-semibold">Conversation Transcript</Text>
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
