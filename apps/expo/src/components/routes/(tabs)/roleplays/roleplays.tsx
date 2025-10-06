import type { BottomSheetModal } from "@gorhom/bottom-sheet"
import type { FC } from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { FlashList } from "@shopify/flash-list"
import { useQuery } from "@tanstack/react-query"
import { Filter } from "lucide-react-native"
import { Pressable, View } from "react-native"

import type { Difficulty } from "~/components/common/difficulty"
import type { RouterOutputs } from "~/utils/api"
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

  type RoleplayCardProps = {
    roleplay: RouterOutputs["profile"]["roleplay"]["getAll"][number]
    onPress: (roleplay: RouterOutputs["profile"]["roleplay"]["getAll"][number]) => void
  }

  const RoleplayCard: FC<RoleplayCardProps> = ({ roleplay, onPress }) => {
    return (
      <Pressable
        onPress={() => onPress(roleplay)}
        className="flex h-[152px] w-full flex-col gap-2.5 rounded-2xl border-2 border-neutral-100 bg-white p-3 active:bg-neutral-50"
      >
        <Text className="text-[40px]">{roleplay.emoji}</Text>
        <Text className="line-clamp-2 text-base font-semibold leading-5 text-neutral-700">{roleplay.title}</Text>
        <Text className="mt-auto line-clamp-1 text-xs font-medium text-neutral-400">{roleplay.category.name}</Text>
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
        horizontal={false}
        estimatedItemSize={80}
        ItemSeparatorComponent={() => <View className="h-3" />}
        /*  renderItem={({ item }) => <RoleplayExtraCompactCard roleplay={item} onPress={handleRoleplayPress} />} */
        renderItem={({ item, index }) => {
          // Left margin increases for each column, right margin decreases for each column
          // What's important is that marginRight + marginLeft === itemGap
          const numCols = 2
          const itemGap = 6
          const marginLeft = ((index % numCols) / (numCols - 1)) * itemGap
          const marginRight = itemGap - marginLeft

          return (
            <View
              style={{
                flexGrow: 1,
                marginLeft,
                marginRight,
              }}
            >
              <RoleplayCard roleplay={item} onPress={handleRoleplayPress} />
            </View>
          )
        }}
        keyExtractor={(item) => item.id}
        numColumns={2}
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
