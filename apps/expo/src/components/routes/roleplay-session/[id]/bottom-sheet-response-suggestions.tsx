import type { FC } from "react"
import type { ICarouselInstance } from "react-native-reanimated-carousel"
import React, { forwardRef, useRef, useState } from "react"
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet"
import { Dimensions, Pressable, View } from "react-native"
import Carousel from "react-native-reanimated-carousel"

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
    <View className="shadow-custom-sm w-full rounded-2xl bg-white p-5">
      {/* Header */}
      <View className="mb-5 flex-row items-center gap-3">
        <View className="size-8 items-center justify-center rounded-full bg-primary-100">
          <Text className="text-sm font-semibold text-primary-700">{index + 1}</Text>
        </View>
        <View className={cn("rounded-lg px-3 py-1", getDifficultyColor(suggestion.difficulty))}>
          <Text className="text-xs font-medium">{getDifficultyLabel(suggestion.difficulty)}</Text>
        </View>
      </View>

      {/* Response text */}
      <View className="mb-5 rounded-xl bg-primary-50 p-4">
        <Text className="text-lg font-medium text-primary-900" selectable>
          {suggestion.text}
        </Text>
      </View>

      {/* Translation */}
      <View className="rounded-xl bg-neutral-50 p-4">
        <Text className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-500">Translation</Text>
        <Text className="text-base text-neutral-700" selectable>
          {suggestion.translation}
        </Text>
      </View>
    </View>
  )
}

export const BottomSheetResponseSuggestions = forwardRef<BottomSheetModal, Props>(({ suggestions }, ref) => {
  const width = Dimensions.get("window").width
  const carouselWidth = width - 32 // accounting for padding
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef<ICarouselInstance>(null)

  const handleSnapToItem = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <BottomSheetModal ref={ref} backdropComponent={BottomSheetBackdrop} enablePanDownToClose stackBehavior="push">
      <BottomSheetView className="flex-1">
        {/* Fixed Header */}
        <View className="border-b border-neutral-200 px-4 pb-4 pt-1">
          <Text className="text-center text-lg font-bold">Response Suggestions</Text>
          <Text className="mt-1 text-center text-sm text-neutral-600">Swipe to see different difficulty levels</Text>
        </View>

        {suggestions.length > 0 ? (
          <View className="flex-1 px-4 py-6">
            {/* Carousel */}
            <View className="flex-1">
              <Carousel
                ref={carouselRef}
                data={suggestions}
                width={carouselWidth}
                height={400}
                loop={true}
                snapEnabled={true}
                onSnapToItem={handleSnapToItem}
                pagingEnabled={true}
                renderItem={({ item, index }) => <SuggestionCard suggestion={item} index={index} />}
              />
            </View>

            {/* Dot indicators */}
            <View className="mt-6 flex-row items-center justify-center gap-2">
              {suggestions.map((_, index) => (
                <Pressable
                  key={index}
                  onPress={() => carouselRef.current?.scrollTo({ index, animated: true })}
                  className={cn("h-2 w-2 rounded-full", index === currentIndex ? "bg-primary-500" : "bg-neutral-300")}
                />
              ))}
            </View>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center py-12">
            <Text className="text-center text-lg font-medium text-neutral-500">No suggestions available</Text>
            <Text className="mt-2 text-center text-sm text-neutral-400">Try having a conversation first to get response suggestions</Text>
          </View>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  )
})

BottomSheetResponseSuggestions.displayName = "BottomSheetResponseSuggestions"
