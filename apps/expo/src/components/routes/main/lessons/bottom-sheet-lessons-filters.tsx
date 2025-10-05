import { forwardRef } from "react"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { Dimensions, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"

import type { Difficulty } from "~/components/common/difficulty"
import type { RouterOutputs } from "~/utils/api"
import { difficulties, getDifficultyName } from "~/components/common/difficulty"
import { DifficultyIcon, FilterOption, FilterSection } from "~/components/common/filters"
import { BottomSheetBackdrop } from "~/ui/bottom-sheet"
import * as Button from "~/ui/button"
import { Text } from "~/ui/text"

type Props = {
  categories: RouterOutputs["profile"]["lessonCategory"]["getAll"][number][]
  selectedCategories: RouterOutputs["profile"]["lessonCategory"]["getAll"][number][]
  selectedDifficulties: Difficulty[]
  onCategoryChange: (categories: RouterOutputs["profile"]["lessonCategory"]["getAll"][number][]) => void
  onDifficultyChange: (difficulties: Difficulty[]) => void
  filteredCount: number
}

const BottomSheetLessonFilters = forwardRef<BottomSheetModal, Props>(
  ({ categories, selectedCategories, selectedDifficulties, onCategoryChange, onDifficultyChange, filteredCount }, ref) => {
    const hasActiveFilters = selectedCategories.length > 0 || selectedDifficulties.length > 0

    const clearAllFilters = () => {
      onCategoryChange([])
      onDifficultyChange([])
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
            <Text className="text-center text-lg font-semibold">Filter Lessons</Text>
          </View>

          {/* Scrollable Content with Footer Space */}
          <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
            <View className="flex flex-col gap-6">
              {/* Category Filter */}
              <FilterSection title="Category">
                {categories.map((category) => {
                  const isSelected = selectedCategories.some((selected) => selected.id === category.id)
                  const toggleCategory = () => {
                    if (isSelected) {
                      onCategoryChange(selectedCategories.filter((selected) => selected.id !== category.id))
                    } else {
                      onCategoryChange([...selectedCategories, category])
                    }
                  }

                  return (
                    <FilterOption
                      key={category.id}
                      title={category.name}
                      isSelected={isSelected}
                      onPress={toggleCategory}
                      leftElement={<Text className="text-sm font-medium">{category.emoji}</Text>}
                    />
                  )
                })}
              </FilterSection>

              {/* Difficulty Filter */}
              <FilterSection title="Difficulty">
                {difficulties.map((difficulty) => {
                  const isSelected = selectedDifficulties.includes(difficulty)
                  const toggleDifficulty = () => {
                    if (isSelected) {
                      onDifficultyChange(selectedDifficulties.filter((selected) => selected !== difficulty))
                    } else {
                      onDifficultyChange([...selectedDifficulties, difficulty])
                    }
                  }

                  return (
                    <FilterOption
                      key={difficulty}
                      title={getDifficultyName(difficulty)}
                      isSelected={isSelected}
                      onPress={toggleDifficulty}
                      leftElement={<DifficultyIcon difficulty={difficulty} />}
                    />
                  )
                })}
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
                  Apply Filters ({filteredCount} lesson{filteredCount !== 1 ? "s" : ""})
                </Button.Text>
              </Button.Root>
            </View>
          </View>
        </View>
      </BottomSheetModal>
    )
  },
)

BottomSheetLessonFilters.displayName = "BottomSheetLessonFilters"

export default BottomSheetLessonFilters
