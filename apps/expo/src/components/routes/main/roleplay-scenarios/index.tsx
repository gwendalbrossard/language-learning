import type { BottomSheetModal } from "@gorhom/bottom-sheet"
import type { FC } from "react"
import { useMemo, useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Filter, Star } from "lucide-react-native"
import { Pressable, View } from "react-native"

import * as Badge from "~/ui/badge"
import * as Button from "~/ui/button"
import { Text, TextDescription } from "~/ui/text"
import { trpc } from "~/utils/api"
import { cn } from "~/utils/utils"
import BottomSheetRoleplayScenarioFilters from "./bottom-sheet-roleplay-scenario-filters"

const RoleplayScenarios: FC = () => {
  const roleplayScenarios = useQuery(trpc.roleplayScenario.getAll.queryOptions())
  if (!roleplayScenarios.data) throw new Error("Roleplay scenarios not found")

  // Bottom sheet ref
  const bottomSheetRef = useRef<BottomSheetModal>(null)

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null)

  // Get unique categories and difficulties for filters
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(roleplayScenarios.data.map((s) => s.category))]
    return uniqueCategories.sort()
  }, [roleplayScenarios.data])

  // Filter scenarios based on selected filters
  const filteredScenarios = useMemo(() => {
    return roleplayScenarios.data.filter((scenario) => {
      const categoryMatch = !selectedCategory || scenario.category === selectedCategory
      const difficultyMatch = !selectedDifficulty || scenario.difficulty === selectedDifficulty
      return categoryMatch && difficultyMatch
    })
  }, [roleplayScenarios.data, selectedCategory, selectedDifficulty])

  const handleScenarioPress = (scenarioId: string) => {
    // TODO: Navigate to roleplay session
    console.log("Selected scenario:", scenarioId)
  }

  // Helper function to render difficulty stars
  const renderDifficultyStars = (difficulty: number) => {
    const stars = []
    const maxStars = 5

    for (let i = 1; i <= maxStars; i++) {
      const isFilled = i <= difficulty
      stars.push(<Star key={i} size={14} fill={isFilled ? "#F59E0B" : "transparent"} color={isFilled ? "#F59E0B" : "#D1D5DB"} strokeWidth={1.5} />)
    }

    return stars
  }

  const hasActiveFilters = selectedCategory !== null || selectedDifficulty !== null

  return (
    <View className="flex flex-col gap-4">
      <View className="flex flex-row items-center justify-between">
        <Text className="text-xl font-bold">Practice Roleplay</Text>

        <Button.Root className={cn("w-fit")} size="xs" variant={"black"} onPress={() => bottomSheetRef.current?.present()}>
          <Button.Icon icon={Filter} />
          <Button.Text>Filters</Button.Text>
          {hasActiveFilters && (
            <View className="ml-1 flex size-4.5 items-center justify-center rounded-full bg-white">
              <Text className="text-xs font-semibold text-neutral-900">{(selectedCategory ? 1 : 0) + (selectedDifficulty ? 1 : 0)}</Text>
            </View>
          )}
        </Button.Root>
      </View>

      {/* Scenarios */}
      <View className="flex flex-col gap-3">
        {filteredScenarios.map((scenario) => (
          <Pressable
            key={scenario.id}
            onPress={() => handleScenarioPress(scenario.id)}
            className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm active:bg-neutral-50"
          >
            {/* Header with emoji and title */}
            <View className="flex flex-col items-start gap-3">
              <View className="flex w-full flex-row items-center justify-between gap-2.5">
                <Text className="text-2xl">{scenario.emoji}</Text>
                <Text className="flex-1 text-lg font-semibold">{scenario.title}</Text>
              </View>

              <TextDescription>{scenario.description}</TextDescription>

              <View className="flex w-full flex-row items-center justify-between gap-2">
                <Badge.Root variant="white" size="sm">
                  <Badge.Text>{scenario.category}</Badge.Text>
                </Badge.Root>
                <View className="flex flex-row items-center gap-0.5">{renderDifficultyStars(scenario.difficulty)}</View>
              </View>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Filter Bottom Sheet */}
      <BottomSheetRoleplayScenarioFilters
        ref={bottomSheetRef}
        categories={categories}
        selectedCategory={selectedCategory}
        selectedDifficulty={selectedDifficulty}
        onCategoryChange={setSelectedCategory}
        onDifficultyChange={setSelectedDifficulty}
        filteredCount={filteredScenarios.length}
      />
    </View>
  )
}

export default RoleplayScenarios
