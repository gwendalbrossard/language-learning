import type { FC } from "react"
import React, { forwardRef } from "react"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { ChevronRightIcon, Volume2Icon } from "lucide-react-native"
import { Dimensions, ScrollView, TouchableOpacity, View } from "react-native"

import type { RouterOutputs } from "@acme/api"

import { BottomSheetBackdrop } from "~/ui/bottom-sheet"
import { Text } from "~/ui/text"
import { cn } from "~/utils/utils"

type Suggestion = RouterOutputs["profile"]["roleplaySession"]["getResponseSuggestions"]["suggestions"][number]

type Props = {
  suggestions: Suggestion[]
}

const getDifficultyColor = (difficulty: Suggestion["difficulty"]) => {
  switch (difficulty) {
    case "beginner":
      return "bg-green-100 border-green-200 text-green-800"
    case "intermediate":
      return "bg-amber-100 border-amber-200 text-amber-800"
    case "advanced":
      return "bg-red-100 border-red-200 text-red-800"
    default:
      return "bg-neutral-100 border-neutral-200 text-neutral-800"
  }
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
  index: number
}

const SuggestionCard: FC<SuggestionCardProps> = ({ suggestion, index }) => {
  return (
    <TouchableOpacity className="mb-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm active:bg-neutral-50">
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="size-8 items-center justify-center rounded-full bg-primary-100">
            <Text className="text-sm font-bold text-primary-700">{index + 1}</Text>
          </View>
          <View className={cn("rounded-lg border px-3 py-1", getDifficultyColor(suggestion.difficulty))}>
            <Text className="text-xs font-semibold">{getDifficultyLabel(suggestion.difficulty)}</Text>
          </View>
        </View>

        <TouchableOpacity className="size-8 items-center justify-center rounded-full bg-primary-100">
          <Volume2Icon size={16} className="text-primary-600" />
        </TouchableOpacity>
      </View>

      {/* Response text */}
      <View className="mb-4 rounded-xl bg-primary-50 p-4">
        <Text className="text-lg font-medium text-primary-900" selectable>
          {suggestion.text}
        </Text>
      </View>

      {/* Translation */}
      <View className="mb-4 rounded-xl bg-neutral-50 p-4">
        <View className="mb-2 flex-row items-center gap-2">
          <Text className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Translation</Text>
        </View>
        <Text className="text-base text-neutral-700" selectable>
          {suggestion.translation}
        </Text>
      </View>

      {/* Action indicator */}
      <View className="mt-4 flex-row items-center justify-center">
        <View className="flex-row items-center gap-2 rounded-full bg-primary-100 px-4 py-2">
          <Text className="text-sm font-medium text-primary-700">Tap to use this response</Text>
          <ChevronRightIcon size={16} className="text-primary-600" />
        </View>
      </View>
    </TouchableOpacity>
  )
}

export const BottomSheetResponseSuggestions = forwardRef<BottomSheetModal, Props>(({ suggestions }, ref) => {
  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={["85%"]}
      maxDynamicContentSize={Dimensions.get("window").height * 0.85}
      backdropComponent={BottomSheetBackdrop}
      enablePanDownToClose
      stackBehavior="push"
      enableDynamicSizing={false}
    >
      <View className="flex-1">
        {/* Fixed Header */}
        <View className="border-b border-neutral-200 px-4 pb-4 pt-1">
          <Text className="text-center text-lg font-bold">Response Suggestions</Text>
          <Text className="mt-1 text-center text-sm text-neutral-600">Choose a response to continue the conversation</Text>
        </View>

        {/* Scrollable Content*/}
        <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
          {suggestions.length > 0 ? (
            <View className="pb-10">
              {suggestions.map((suggestion, index) => (
                <SuggestionCard key={index} suggestion={suggestion} index={index} />
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
