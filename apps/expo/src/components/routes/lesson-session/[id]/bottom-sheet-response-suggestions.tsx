import type { FC } from "react"
import React, { forwardRef } from "react"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { Dimensions, ScrollView, View } from "react-native"

import type { RouterOutputs } from "@acme/api"

import * as Badge from "~/ui/badge"
import { BottomSheetBackdrop } from "~/ui/bottom-sheet"
import { Text } from "~/ui/text"

type Suggestion = RouterOutputs["profile"]["lessonSession"]["getResponseSuggestions"]["suggestions"][number]

type Props = {
  suggestions: Suggestion[]
}

const getDifficultyLabel = (difficulty: Suggestion["difficulty"]) => {
  switch (difficulty) {
    case "beginner":
      return "Beginner"
    case "intermediate":
      return "Intermediate"
    case "advanced":
      return "Advanced"
    default:
      return difficulty
  }
}

type SuggestionCardProps = {
  suggestion: Suggestion
}

const getDifficultyColor = (difficulty: Suggestion["difficulty"]): Badge.BadgeProps["variant"] => {
  switch (difficulty) {
    case "beginner":
      return "success"
    case "intermediate":
      return "white"
    case "advanced":
      return "error"
    default:
      return "neutral"
  }
}

const SuggestionCard: FC<SuggestionCardProps> = ({ suggestion }) => {
  return (
    <View className="relative flex flex-col gap-3 rounded-xl border-2 border-neutral-100 bg-white px-3.5 py-4">
      <Text className="text-base font-medium text-neutral-700">{suggestion.text}</Text>
      <View className="h-0.5 w-full bg-neutral-100" />
      <Text className="text-sm font-medium text-neutral-500">{suggestion.translation}</Text>
      <Badge.Root variant={getDifficultyColor(suggestion.difficulty)} size="md" className="absolute -right-2 -top-3">
        <Badge.Text>{getDifficultyLabel(suggestion.difficulty)}</Badge.Text>
      </Badge.Root>
    </View>
  )
}

export const BottomSheetResponseSuggestions = forwardRef<BottomSheetModal, Props>(({ suggestions }, ref) => {
  return (
    <BottomSheetModal
      ref={ref}
      backdropComponent={BottomSheetBackdrop}
      snapPoints={["80%"]}
      maxDynamicContentSize={Dimensions.get("window").height * 0.8}
      enablePanDownToClose
      stackBehavior="push"
      enableDynamicSizing={false}
    >
      <View className="flex-1">
        {/* Fixed Header */}
        <View className="border-b-2 border-neutral-100 px-4 pb-4 pt-1">
          <Text className="text-center text-lg font-semibold">Response Suggestions</Text>
        </View>

        <ScrollView className="mb-4 flex-1 px-4 py-6">
          {suggestions.length > 0 ? (
            <View className="flex flex-1 flex-col gap-6">
              {suggestions.map((suggestion) => (
                <SuggestionCard key={suggestion.difficulty} suggestion={suggestion} />
              ))}
            </View>
          ) : (
            <View className="flex-1 items-center justify-center py-12">
              <Text className="text-center text-lg font-medium text-neutral-500">No suggestions available</Text>
              <Text className="mt-2 text-center text-sm text-neutral-400">Try having a conversation first to get response suggestions</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </BottomSheetModal>
  )
})

BottomSheetResponseSuggestions.displayName = "BottomSheetResponseSuggestions"
