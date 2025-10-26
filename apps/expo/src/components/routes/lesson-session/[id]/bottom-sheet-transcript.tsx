import type { FC } from "react"
import React, { forwardRef } from "react"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { Dimensions, ScrollView, View } from "react-native"
import Markdown from "react-native-markdown-display"

import { markdownStyles } from "~/components/common/markdown"
import { BottomSheetBackdrop } from "~/ui/bottom-sheet"
import { Text } from "~/ui/text"

type Message = {
  id: string
  role: "user" | "assistant"
  transcript: string
}

type UserMessageProps = {
  message: Message
}

const UserMessage: FC<UserMessageProps> = ({ message }) => {
  return (
    <View className="flex flex-row justify-end">
      <View className="z-10 flex max-w-[80%] break-words rounded-xl bg-blue-600 px-3.5 py-0.5">
        <Markdown style={{ ...markdownStyles, body: { color: "#FFFFFF" } }}>{message.transcript}</Markdown>
      </View>
    </View>
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
