import type { BottomSheetModal } from "@gorhom/bottom-sheet"
import type { FC } from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { router } from "expo-router"
import { useQuery } from "@tanstack/react-query"
import { Filter, Plus, Star } from "lucide-react-native"
import { Pressable, View } from "react-native"

import type { RouterOutputs } from "~/utils/api"
import * as Badge from "~/ui/badge"
import * as Button from "~/ui/button"
import { Text, TextDescription } from "~/ui/text"
import { trpc } from "~/utils/api"
import { cn } from "~/utils/utils"
import { useUserStore } from "~/utils/zustand/user-store"
import BottomSheetRoleplayScenarioDetails from "./bottom-sheet-roleplay-scenario-details"
import BottomSheetRoleplayScenarioFilters from "./bottom-sheet-roleplay-scenario-filters"

const RoleplayScenarios: FC = () => {
  const currentOrganizationId = useUserStore((state) => state.currentOrganizationId)
  if (!currentOrganizationId) throw new Error("Current organization ID not found")

  const profileRoleplayScenarioGetAll = useQuery(trpc.profile.roleplayScenario.getAll.queryOptions({ organizationId: currentOrganizationId }))
  if (!profileRoleplayScenarioGetAll.data) throw new Error("Roleplay scenarios not found")

  const profileRoleplayCategoryGetAll = useQuery(trpc.profile.roleplayCategory.getAll.queryOptions({ organizationId: currentOrganizationId }))
  if (!profileRoleplayCategoryGetAll.data) throw new Error("Roleplay categories not found")

  // Bottom sheet refs
  const roleplayScenarioFiltersBottomSheetRef = useRef<BottomSheetModal>(null)
  const roleplayScenarioDetailsBottomSheetRef = useRef<BottomSheetModal>(null)

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<RouterOutputs["profile"]["roleplayCategory"]["getAll"][number] | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null)

  // Selected scenario state
  const [selectedScenario, setSelectedScenario] = useState<RouterOutputs["profile"]["roleplayScenario"]["getAll"][number] | null>(null)

  // Filter scenarios based on selected filters
  const filteredScenarios = useMemo(() => {
    return profileRoleplayScenarioGetAll.data.filter((scenario) => {
      const categoryMatch = !selectedCategory || scenario.category.id === selectedCategory.id
      const difficultyMatch = !selectedDifficulty || scenario.difficulty === selectedDifficulty
      return categoryMatch && difficultyMatch
    })
  }, [profileRoleplayScenarioGetAll.data, selectedCategory, selectedDifficulty])

  const handleRoleplayScenarioPress = (scenario: RouterOutputs["profile"]["roleplayScenario"]["getAll"][number]) => {
    setSelectedScenario(scenario)
  }

  useEffect(() => {
    if (!selectedScenario) return
    roleplayScenarioDetailsBottomSheetRef.current?.present()
  }, [selectedScenario])

  const handleCloseDetails = () => {
    setSelectedScenario(null)
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
        <Text className="text-xl font-semibold">Practice Roleplay</Text>

        <View className="flex flex-row items-center gap-2">
          <Button.Root className={cn("w-fit")} size="xs" variant={"primary"} onPress={() => router.push("/create-roleplay-scenario")}>
            <Button.Icon icon={Plus} />
            <Button.Text>Create</Button.Text>
          </Button.Root>

          <Button.Root className={cn("w-fit")} size="xs" variant={"black"} onPress={() => roleplayScenarioFiltersBottomSheetRef.current?.present()}>
            <Button.Icon icon={Filter} />
            <Button.Text>Filters</Button.Text>
            {hasActiveFilters && (
              <View className="ml-1 flex size-4.5 items-center justify-center rounded-full bg-white">
                <Text className="text-xs font-semibold text-neutral-900">{(selectedCategory ? 1 : 0) + (selectedDifficulty ? 1 : 0)}</Text>
              </View>
            )}
          </Button.Root>
        </View>
      </View>

      {/* Scenarios */}
      <View className="flex flex-col gap-3">
        {filteredScenarios.map((scenario) => (
          <Pressable
            key={scenario.id}
            onPress={() => handleRoleplayScenarioPress(scenario)}
            className="shadow-custom-sm flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 active:bg-neutral-50"
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
                  <Badge.Text>{scenario.category.name}</Badge.Text>
                </Badge.Root>
                <View className="flex flex-row items-center gap-0.5">{renderDifficultyStars(scenario.difficulty)}</View>
              </View>
            </View>
          </Pressable>
        ))}
      </View>

      <BottomSheetRoleplayScenarioFilters
        ref={roleplayScenarioFiltersBottomSheetRef}
        categories={profileRoleplayCategoryGetAll.data}
        selectedCategory={selectedCategory}
        selectedDifficulty={selectedDifficulty}
        onCategoryChange={setSelectedCategory}
        onDifficultyChange={setSelectedDifficulty}
        filteredCount={filteredScenarios.length}
      />

      <BottomSheetRoleplayScenarioDetails ref={roleplayScenarioDetailsBottomSheetRef} scenario={selectedScenario} onClose={handleCloseDetails} />
    </View>
  )
}

export default RoleplayScenarios
