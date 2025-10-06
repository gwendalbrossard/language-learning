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
import BottomSheetLessonDetails from "./bottom-sheet-lesson-details"
import BottomSheetLessonFilters from "./bottom-sheet-lessons-filters"

const Lessons: FC = () => {
  const currentOrganizationId = useUserStore((state) => state.currentOrganizationId)
  if (!currentOrganizationId) throw new Error("Current organization ID not found")

  const profileLessonGetAll = useQuery(trpc.profile.lesson.getAll.queryOptions({ organizationId: currentOrganizationId }))
  if (!profileLessonGetAll.data) throw new Error("Lessons not found")

  const profileLessonCategoryGetAll = useQuery(trpc.profile.lessonCategory.getAll.queryOptions({ organizationId: currentOrganizationId }))
  if (!profileLessonCategoryGetAll.data) throw new Error("Lesson categories not found")

  // Bottom sheet refs
  const lessonFiltersBottomSheetRef = useRef<BottomSheetModal>(null)
  const lessonDetailsBottomSheetRef = useRef<BottomSheetModal>(null)

  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<RouterOutputs["profile"]["lessonCategory"]["getAll"][number][]>([])
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>([])

  // Selected lesson state
  const [selectedLesson, setSelectedLesson] = useState<RouterOutputs["profile"]["lesson"]["getAll"][number] | null>(null)

  // Filter lessons based on selected filters
  const filteredLessons = useMemo(() => {
    return profileLessonGetAll.data.filter((lesson) => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.some((category) => category.id === lesson.category.id)
      const difficultyMatch = selectedDifficulties.length === 0 || selectedDifficulties.includes(lesson.difficulty as Difficulty)
      return categoryMatch && difficultyMatch
    })
  }, [profileLessonGetAll.data, selectedCategories, selectedDifficulties])

  const handleLessonPress = (lesson: RouterOutputs["profile"]["lesson"]["getAll"][number]) => {
    setSelectedLesson(lesson)
  }

  useEffect(() => {
    if (!selectedLesson) return
    lessonDetailsBottomSheetRef.current?.present()
  }, [selectedLesson])

  const handleCloseDetails = () => {
    setSelectedLesson(null)
  }

  const hasActiveFilters = selectedCategories.length > 0 || selectedDifficulties.length > 0

  type LessonCardProps = {
    lesson: RouterOutputs["profile"]["lesson"]["getAll"][number]
    onPress: (lesson: RouterOutputs["profile"]["lesson"]["getAll"][number]) => void
  }

  const LessonCard: FC<LessonCardProps> = ({ lesson, onPress }) => {
    return (
      <Pressable
        onPress={() => onPress(lesson)}
        className="shadow-custom-xs flex h-[152px] w-full flex-col gap-2.5 rounded-2xl border border-neutral-200 bg-white p-3 active:bg-neutral-50"
      >
        <Text className="text-[40px]">{lesson.emoji}</Text>
        <Text className="line-clamp-2 text-base font-semibold leading-5 text-neutral-700">{lesson.title}</Text>
        <Text className="mt-auto line-clamp-1 text-xs font-medium text-neutral-400">{lesson.category.name}</Text>
      </Pressable>
    )
  }

  return (
    <View className="flex flex-col gap-4">
      <View className="flex flex-row items-center justify-between">
        <Text className="text-xl font-semibold">Lessons</Text>

        <View className="flex flex-row items-center gap-2">
          <Button.Root className={cn("w-fit")} size="xs" variant={"black"} onPress={() => lessonFiltersBottomSheetRef.current?.present()}>
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

      {/* Lessons */}
      <FlashList
        data={filteredLessons}
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
              <LessonCard lesson={item} onPress={handleLessonPress} />
            </View>
          )
        }}
        keyExtractor={(item) => item.id}
        numColumns={2}
      />

      <BottomSheetLessonFilters
        ref={lessonFiltersBottomSheetRef}
        categories={profileLessonCategoryGetAll.data}
        selectedCategories={selectedCategories}
        selectedDifficulties={selectedDifficulties}
        onCategoryChange={setSelectedCategories}
        onDifficultyChange={setSelectedDifficulties}
        filteredCount={filteredLessons.length}
      />

      <BottomSheetLessonDetails ref={lessonDetailsBottomSheetRef} lesson={selectedLesson} onClose={handleCloseDetails} />
    </View>
  )
}

export default Lessons
