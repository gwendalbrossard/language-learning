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
  const [selectedDifficulties, setSelectedDifficulties] = useState<number[]>([])

  // Selected lesson state
  const [selectedLesson, setSelectedLesson] = useState<RouterOutputs["profile"]["lesson"]["getAll"][number] | null>(null)

  // Filter lessons based on selected filters
  const filteredLessons = useMemo(() => {
    return profileLessonGetAll.data.filter((lesson) => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.some(category => category.id === lesson.category.id)
      const difficultyMatch = selectedDifficulties.length === 0 || selectedDifficulties.includes(lesson.difficulty)
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

  const hasActiveFilters = selectedCategories.length > 0 || selectedDifficulties.length > 0

  return (
    <View className="flex flex-col gap-4">
      <View className="flex flex-row items-center justify-between">
        <Text className="text-xl font-semibold">Practice Lessons</Text>

        <View className="flex flex-row items-center gap-2">
          <Button.Root className={cn("w-fit")} size="xs" variant={"primary"} onPress={() => router.push("/create-lesson")}>
            <Button.Icon icon={Plus} />
            <Button.Text>Create</Button.Text>
          </Button.Root>

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
      <View className="flex flex-col gap-3">
        {filteredLessons.map((lesson) => (
          <Pressable
            key={lesson.id}
            onPress={() => handleLessonPress(lesson)}
            className="shadow-custom-sm flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 active:bg-neutral-50"
          >
            {/* Header with emoji and title */}
            <View className="flex flex-col items-start gap-3">
              <View className="flex w-full flex-row items-center justify-between gap-2.5">
                <Text className="text-2xl">{lesson.emoji}</Text>
                <Text className="flex-1 text-lg font-semibold">{lesson.title}</Text>
              </View>

              <TextDescription>{lesson.description}</TextDescription>

              <View className="flex w-full flex-row items-center justify-between gap-2">
                <Badge.Root variant="white" size="sm">
                  <Badge.Text>{lesson.category.name}</Badge.Text>
                </Badge.Root>
                <View className="flex flex-row items-center gap-0.5">{renderDifficultyStars(lesson.difficulty)}</View>
              </View>
            </View>
          </Pressable>
        ))}
      </View>

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
