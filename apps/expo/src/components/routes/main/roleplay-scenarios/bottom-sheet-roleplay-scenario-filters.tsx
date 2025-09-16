import { forwardRef } from "react"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { Star } from "lucide-react-native"
import { Dimensions, Pressable, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"

import { BottomSheetBackdrop } from "~/ui/bottom-sheet"
import * as Button from "~/ui/button"
import { Text } from "~/ui/text"
import { cn } from "~/utils/utils"

// Shared Components

type DifficultyStarsProps = {
  difficulty: number
  maxStars?: number
}

const DifficultyStars = ({ difficulty, maxStars = 5 }: DifficultyStarsProps) => {
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
  rightElement?: React.ReactNode
}

const FilterOption = ({ title, isSelected, onPress, rightElement }: FilterOptionProps) => {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "flex flex-row items-center justify-between rounded-xl border-2 px-4 py-2.5",
        !isSelected && "border-neutral-100",
        isSelected && "border-primary-600 bg-primary-50",
      )}
    >
      <Text className={cn("text-base font-medium", isSelected ? "text-primary-700" : "text-neutral-700")}>{title}</Text>
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
      <View className="flex flex-col gap-2">{children}</View>
    </View>
  )
}

type Props = {
  categories: string[]
  selectedCategory: string | null
  selectedDifficulty: number | null
  onCategoryChange: (category: string | null) => void
  onDifficultyChange: (difficulty: number | null) => void
  filteredCount: number
}

const BottomSheetRoleplayScenarioFilters = forwardRef<BottomSheetModal, Props>(
  ({ categories, selectedCategory, selectedDifficulty, onCategoryChange, onDifficultyChange, filteredCount }, ref) => {
    const hasActiveFilters = selectedCategory !== null || selectedDifficulty !== null

    const difficulties = [1, 2, 3, 4, 5]

    const getDifficultyName = (difficulty: number): string => {
      const names = {
        1: "Very Easy",
        2: "Easy",
        3: "Medium",
        4: "Hard",
        5: "Expert",
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
            <Text className="text-center text-lg font-bold">Filter Scenarios</Text>
          </View>

          {/* Scrollable Content with Footer Space */}
          <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
            <View className="flex flex-col gap-6">
              {/* Category Filter */}
              <FilterSection title="Category">
                <FilterOption title="All Categories" isSelected={!selectedCategory} onPress={() => onCategoryChange(null)} />
                {categories.map((category) => (
                  <FilterOption
                    key={category}
                    title={category}
                    isSelected={selectedCategory === category}
                    onPress={() => onCategoryChange(category)}
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
                  Apply Filters ({filteredCount} scenario{filteredCount !== 1 ? "s" : ""})
                </Button.Text>
              </Button.Root>
            </View>
          </View>
        </View>
      </BottomSheetModal>
    )
  },
)

BottomSheetRoleplayScenarioFilters.displayName = "BottomSheetRoleplayScenarioFilters"

export default BottomSheetRoleplayScenarioFilters
