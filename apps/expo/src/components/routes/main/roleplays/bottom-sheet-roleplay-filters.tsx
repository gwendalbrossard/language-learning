import { forwardRef } from "react"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { Star } from "lucide-react-native"
import { Dimensions, Pressable, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"

import type { RouterOutputs } from "~/utils/api"
import { BottomSheetBackdrop } from "~/ui/bottom-sheet"
import * as Button from "~/ui/button"
import { Text } from "~/ui/text"
import { cn } from "~/utils/utils"

// Shared Components

type DifficultyStarsProps = {
  difficulty: number
  maxStars?: number
}

const DifficultyStars = ({ difficulty, maxStars = 3 }: DifficultyStarsProps) => {
  const stars = []

  for (let i = 1; i <= maxStars; i++) {
    const isFilled = i <= difficulty
    stars.push(<Star key={i} size={14} fill={isFilled ? "#F59E0B" : "transparent"} color={isFilled ? "#F59E0B" : "#D1D5DB"} strokeWidth={1.5} />)
  }

  return <View className="flex flex-row items-center gap-0.5">{stars}</View>
}

type FilterOptionProps = {
  title: string
  isSelected: boolean
  onPress: () => void
  leftElement?: React.ReactNode
  rightElement?: React.ReactNode
}

const FilterOption = ({ title, isSelected, onPress, leftElement, rightElement }: FilterOptionProps) => {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "flex flex-row items-center justify-between gap-1.5 rounded-xl border-2 px-3 py-2",
        !isSelected && "border-neutral-100",
        isSelected && "border-primary-600 bg-primary-50",
      )}
    >
      {leftElement}
      <Text className={cn("text-sm font-medium", isSelected ? "text-primary-700" : "text-neutral-700")}>{title}</Text>
      {rightElement}
    </Pressable>
  )
}

type FilterSectionProps = {
  title: string
  children: React.ReactNode
}

const FilterSection = ({ title, children }: FilterSectionProps) => {
  return (
    <View className="flex flex-col gap-3">
      <Text className="text-base font-semibold text-neutral-900">{title}</Text>
      <View className="flex flex-row flex-wrap gap-2">{children}</View>
    </View>
  )
}

type Props = {
  categories: RouterOutputs["profile"]["roleplayCategory"]["getAll"][number][]
  selectedCategory: RouterOutputs["profile"]["roleplayCategory"]["getAll"][number] | null
  selectedDifficulty: number | null
  onCategoryChange: (category: RouterOutputs["profile"]["roleplayCategory"]["getAll"][number] | null) => void
  onDifficultyChange: (difficulty: number | null) => void
  filteredCount: number
}

const BottomSheetRoleplayFilters = forwardRef<BottomSheetModal, Props>(
  ({ categories, selectedCategory, selectedDifficulty, onCategoryChange, onDifficultyChange, filteredCount }, ref) => {
    const hasActiveFilters = selectedCategory !== null || selectedDifficulty !== null

    const difficulties = [1, 2, 3]

    const getDifficultyName = (difficulty: number): string => {
      const names = {
        1: "Easy",
        2: "Medium",
        3: "Hard",
      }

      const name = names[difficulty as keyof typeof names]
      if (!name) throw new Error(`Unknown difficulty level: ${difficulty}`)
      return name
    }

    const clearAllFilters = () => {
      onCategoryChange(null)
      onDifficultyChange(null)
    }

    const closeBottomSheet = () => {
      if (ref && "current" in ref && ref.current) {
        ref.current.dismiss()
      }
    }

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
          <View className="px-4 pb-4 pt-2">
            <Text className="text-center text-lg font-semibold">Filter Roleplays</Text>
          </View>

          {/* Scrollable Content with Footer Space */}
          <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
            <View className="flex flex-col gap-6">
              {/* Category Filter */}
              <FilterSection title="Category">
                <FilterOption title="All Categories" isSelected={!selectedCategory} onPress={() => onCategoryChange(null)} />
                {categories.map((category) => (
                  <FilterOption
                    key={category.id}
                    title={category.name}
                    isSelected={selectedCategory === category}
                    onPress={() => onCategoryChange(category)}
                    leftElement={<Text className="text-sm font-medium">{category.emoji}</Text>}
                  />
                ))}
              </FilterSection>

              {/* Difficulty Filter */}
              <FilterSection title="Difficulty">
                <FilterOption title="All Difficulties" isSelected={!selectedDifficulty} onPress={() => onDifficultyChange(null)} />
                {difficulties.map((difficulty) => (
                  <FilterOption
                    key={difficulty}
                    title={getDifficultyName(difficulty)}
                    isSelected={selectedDifficulty === difficulty}
                    onPress={() => onDifficultyChange(difficulty)}
                    rightElement={<DifficultyStars difficulty={difficulty} />}
                  />
                ))}
              </FilterSection>
            </View>
          </ScrollView>

          {/* Fixed Footer with Buttons */}
          <View className="border-t border-neutral-100 bg-white px-4 pb-10 pt-4">
            <View className="flex flex-col gap-3">
              <Button.Root variant="secondary" onPress={clearAllFilters} disabled={!hasActiveFilters} className="w-full">
                <Button.Text>Clear All Filters</Button.Text>
              </Button.Root>

              <Button.Root variant="primary" onPress={closeBottomSheet} className="w-full">
                <Button.Text>
                  Apply Filters ({filteredCount} roleplay{filteredCount !== 1 ? "s" : ""})
                </Button.Text>
              </Button.Root>
            </View>
          </View>
        </View>
      </BottomSheetModal>
    )
  },
)

BottomSheetRoleplayFilters.displayName = "BottomSheetRoleplayFilters"

export default BottomSheetRoleplayFilters
