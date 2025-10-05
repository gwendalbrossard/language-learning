import type { BottomSheetModal } from "@gorhom/bottom-sheet"
import type { FC } from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { FlashList } from "@shopify/flash-list"
import { useQuery } from "@tanstack/react-query"
import { ChevronRightIcon, Filter } from "lucide-react-native"
import { Pressable, View } from "react-native"

import type { Difficulty } from "~/components/common/difficulty"
import type { DifficultyIconProps } from "~/components/common/filters"
import type { RouterOutputs } from "~/utils/api"
import { getDifficultyIcon, getDifficultyName } from "~/components/common/difficulty"
import * as Button from "~/ui/button"
import { Text } from "~/ui/text"
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
  const [selectedCategories, setSelectedCategories] = useState<RouterOutputs["profile"]["roleplayCategory"]["getAll"][number][]>([])
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>([])

  // Selected roleplay state
  const [selectedRoleplay, setSelectedRoleplay] = useState<RouterOutputs["profile"]["roleplay"]["getAll"][number] | null>(null)

  // Filter roleplays based on selected filters
  const filteredRoleplays = useMemo<RouterOutputs["profile"]["roleplay"]["getAll"][number][]>(() => {
    return profileRoleplayGetAll.data.filter((roleplay) => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.some((category) => category.id === roleplay.category.id)
      const difficultyMatch = selectedDifficulties.length === 0 || selectedDifficulties.includes(roleplay.difficulty as Difficulty)
      return categoryMatch && difficultyMatch
    })
  }, [profileRoleplayGetAll.data, selectedCategories, selectedDifficulties])

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

  const DifficultyIcon: FC<DifficultyIconProps> = ({ difficulty }) => {
    const Icon = getDifficultyIcon(difficulty)
    return <Icon width={12} height={12} />
  }

  const RoleplayCompactCard: FC<{
    roleplay: RouterOutputs["profile"]["roleplay"]["getAll"][number]
    onPress: (roleplay: RouterOutputs["profile"]["roleplay"]["getAll"][number]) => void
  }> = ({ roleplay, onPress }) => {
    return (
      <Pressable
        onPress={() => onPress(roleplay)}
        className="shadow-custom-xs flex flex-row items-center gap-3 rounded-xl border border-neutral-200 bg-white px-2.5 py-3.5 active:bg-neutral-50"
      >
        {/* Emoji */}
        <View className="flex size-11 items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50">
          <Text className="text-3xl">{roleplay.emoji}</Text>
        </View>

        {/* Content */}
        <View className="flex flex-1 flex-col gap-0.5">
          {/* Title */}
          <Text className="line-clamp-2 text-base font-semibold text-neutral-700">{roleplay.title}</Text>

          {/* Category and difficulty */}
          <View className="flex flex-row items-center gap-2">
            <Text className="text-xs font-medium text-neutral-500">
              {roleplay.category.emoji} {roleplay.category.name}
            </Text>

            <View className="flex flex-row items-center gap-1">
              <DifficultyIcon difficulty={roleplay.difficulty as Difficulty} />
              <Text className="text-xs font-medium text-neutral-500">{getDifficultyName(roleplay.difficulty as Difficulty)}</Text>
            </View>
          </View>
        </View>

        {/* Chevron right */}
        <View className="flex size-11 items-center justify-center rounded-xl">
          <ChevronRightIcon className="text-neutral-400" size={20} />
        </View>
      </Pressable>
    )
  }

  const hasActiveFilters = selectedCategories.length > 0 || selectedDifficulties.length > 0

  return (
    <View className="flex flex-col gap-4">
      <View className="flex flex-row items-center justify-between">
        <Text className="text-xl font-semibold">Roleplays</Text>

        <View className="flex flex-row items-center gap-2">
          <Button.Root className={cn("w-fit")} size="xs" variant={"black"} onPress={() => roleplayFiltersBottomSheetRef.current?.present()}>
            <Button.Icon icon={Filter} />
            <Button.Text>Filters</Button.Text>
            {hasActiveFilters && (
              <View className="ml-1 flex size-4.5 items-center justify-center rounded-full bg-white">
                <Text className="text-xs font-semibold text-neutral-900">{selectedCategories.length + selectedDifficulties.length}</Text>
              </View>
            )}
          </Button.Root>
        </View>
      </View>

      {/* Roleplays */}
      <FlashList
        data={filteredRoleplays}
        estimatedItemSize={80}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => <RoleplayCompactCard roleplay={item} onPress={handleRoleplayPress} />}
        keyExtractor={(item) => item.id}
      />

      <BottomSheetRoleplayFilters
        ref={roleplayFiltersBottomSheetRef}
        categories={profileRoleplayCategoryGetAll.data}
        selectedCategories={selectedCategories}
        selectedDifficulties={selectedDifficulties}
        onCategoryChange={setSelectedCategories}
        onDifficultyChange={setSelectedDifficulties}
        filteredCount={filteredRoleplays.length}
      />

      <BottomSheetRoleplayDetails ref={roleplayDetailsBottomSheetRef} roleplay={selectedRoleplay} onClose={handleCloseDetails} />
    </View>
  )
}

export default Roleplays
