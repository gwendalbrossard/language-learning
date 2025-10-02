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
import BottomSheetRoleplayDetails from "./bottom-sheet-roleplay-details"
import BottomSheetRoleplayFilters from "./bottom-sheet-roleplay-filters"

const Roleplays: FC = () => {
  const currentOrganizationId = useUserStore((state) => state.currentOrganizationId)
  if (!currentOrganizationId) throw new Error("Current organization ID not found")

  const profileRoleplayGetAll = useQuery(trpc.profile.roleplay.getAll.queryOptions({ organizationId: currentOrganizationId }))
  if (!profileRoleplayGetAll.data) throw new Error("Roleplays not found")

  const profileRoleplayCategoryGetAll = useQuery(trpc.profile.roleplayCategory.getAll.queryOptions({ organizationId: currentOrganizationId }))
  if (!profileRoleplayCategoryGetAll.data) throw new Error("Roleplay categories not found")

  // Bottom sheet refs
  const roleplayFiltersBottomSheetRef = useRef<BottomSheetModal>(null)
  const roleplayDetailsBottomSheetRef = useRef<BottomSheetModal>(null)

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<RouterOutputs["profile"]["roleplayCategory"]["getAll"][number] | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null)

  // Selected roleplay state
  const [selectedRoleplay, setSelectedRoleplay] = useState<RouterOutputs["profile"]["roleplay"]["getAll"][number] | null>(null)

  // Filter roleplays based on selected filters
  const filteredRoleplays = useMemo(() => {
    return profileRoleplayGetAll.data.filter((roleplay) => {
      const categoryMatch = !selectedCategory || roleplay.category.id === selectedCategory.id
      const difficultyMatch = !selectedDifficulty || roleplay.difficulty === selectedDifficulty
      return categoryMatch && difficultyMatch
    })
  }, [profileRoleplayGetAll.data, selectedCategory, selectedDifficulty])

  const handleRoleplayPress = (roleplay: RouterOutputs["profile"]["roleplay"]["getAll"][number]) => {
    setSelectedRoleplay(roleplay)
  }

  useEffect(() => {
    if (!selectedRoleplay) return
    roleplayDetailsBottomSheetRef.current?.present()
  }, [selectedRoleplay])

  const handleCloseDetails = () => {
    setSelectedRoleplay(null)
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
          <Button.Root className={cn("w-fit")} size="xs" variant={"primary"} onPress={() => router.push("/create-roleplay")}>
            <Button.Icon icon={Plus} />
            <Button.Text>Create</Button.Text>
          </Button.Root>

          <Button.Root className={cn("w-fit")} size="xs" variant={"black"} onPress={() => roleplayFiltersBottomSheetRef.current?.present()}>
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

      {/* Roleplays */}
      <View className="flex flex-col gap-3">
        {filteredRoleplays.map((roleplay) => (
          <Pressable
            key={roleplay.id}
            onPress={() => handleRoleplayPress(roleplay)}
            className="shadow-custom-sm flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 active:bg-neutral-50"
          >
            {/* Header with emoji and title */}
            <View className="flex flex-col items-start gap-3">
              <View className="flex w-full flex-row items-center justify-between gap-2.5">
                <Text className="text-2xl">{roleplay.emoji}</Text>
                <Text className="flex-1 text-lg font-semibold">{roleplay.title}</Text>
              </View>

              <TextDescription>{roleplay.description}</TextDescription>

              <View className="flex w-full flex-row items-center justify-between gap-2">
                <Badge.Root variant="white" size="sm">
                  <Badge.Text>{roleplay.category.name}</Badge.Text>
                </Badge.Root>
                <View className="flex flex-row items-center gap-0.5">{renderDifficultyStars(roleplay.difficulty)}</View>
              </View>
            </View>
          </Pressable>
        ))}
      </View>

      <BottomSheetRoleplayFilters
        ref={roleplayFiltersBottomSheetRef}
        categories={profileRoleplayCategoryGetAll.data}
        selectedCategory={selectedCategory}
        selectedDifficulty={selectedDifficulty}
        onCategoryChange={setSelectedCategory}
        onDifficultyChange={setSelectedDifficulty}
        filteredCount={filteredRoleplays.length}
      />

      <BottomSheetRoleplayDetails ref={roleplayDetailsBottomSheetRef} roleplay={selectedRoleplay} onClose={handleCloseDetails} />
    </View>
  )
}

export default Roleplays
