import { forwardRef } from "react"
import { router } from "expo-router"
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet"
import { useMutation } from "@tanstack/react-query"
import { Play, Star } from "lucide-react-native"
import { Dimensions, View } from "react-native"

import type { RouterOutputs } from "~/utils/api"
import * as Badge from "~/ui/badge"
import { BottomSheetBackdrop } from "~/ui/bottom-sheet"
import * as Button from "~/ui/button"
import { Text, TextDescription } from "~/ui/text"
import { queryClient, trpc } from "~/utils/api"
import { useUserStore } from "~/utils/zustand/user-store"

type Props = {
  lesson: RouterOutputs["profile"]["lesson"]["getAll"][number] | null
  onClose: () => void
}

const BottomSheetLessonDetails = forwardRef<BottomSheetModal, Props>(({ lesson, onClose }, ref) => {
  const currentOrganizationId = useUserStore((state) => state.currentOrganizationId)
  if (!currentOrganizationId) throw new Error("Current organization ID not found")

  const profileLessonCreateMutation = useMutation(
    trpc.profile.lessonSession.create.mutationOptions({
      onSuccess: async (data) => {
        if (ref && "current" in ref && ref.current) {
          ref.current.dismiss()
        }
        await queryClient.fetchQuery(trpc.profile.lessonSession.get.queryOptions({ lessonSessionId: data.id, organizationId: currentOrganizationId }))
        router.push(`/lesson-session/${data.id}`)
      },
    }),
  )

  const handleStartLesson = () => {
    if (!lesson) throw new Error("Lesson not found")
    profileLessonCreateMutation.mutate({ lessonId: lesson.id, organizationId: currentOrganizationId })
  }

  // Helper function to render difficulty stars
  const renderDifficultyStars = (difficulty: number) => {
    const stars = []
    const maxStars = 5

    for (let i = 1; i <= maxStars; i++) {
      const isFilled = i <= difficulty
      stars.push(<Star key={i} size={16} fill={isFilled ? "#F59E0B" : "transparent"} color={isFilled ? "#F59E0B" : "#D1D5DB"} strokeWidth={1.5} />)
    }

    return stars
  }

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={["50%"]}
      maxDynamicContentSize={Dimensions.get("window").height * 0.8}
      backdropComponent={BottomSheetBackdrop}
      enablePanDownToClose
      stackBehavior="push"
      enableDynamicSizing={false}
      onDismiss={onClose}
    >
      {lesson && (
        <BottomSheetView className="h-full flex-1 justify-between px-4 pb-10 pt-2">
          {/* Lesson Details */}
          <View className="flex flex-col gap-6">
            {/* Header */}
            <View className="flex flex-col items-center gap-4">
              <Text className="text-4xl">{lesson.emoji}</Text>
              <View className="flex flex-col items-center gap-2">
                <Text className="text-center text-2xl font-semibold">{lesson.title}</Text>
                <View className="flex flex-row items-center gap-3">
                  <Badge.Root variant="white" size="sm">
                    <Badge.Text>{lesson.category.name}</Badge.Text>
                  </Badge.Root>
                  <View className="flex flex-row items-center gap-0.5">{renderDifficultyStars(lesson.difficulty)}</View>
                </View>
              </View>
            </View>

            {/* Description */}
            <View className="flex flex-col gap-3">
              <Text className="text-lg font-semibold">About This Lesson</Text>
              <TextDescription className="text-base leading-6">{lesson.description}</TextDescription>
            </View>
          </View>

          {/* Start Button */}
          <View className="pt-6">
            <Button.Root className="w-full" size="lg" variant="primary" onPress={handleStartLesson} loading={profileLessonCreateMutation.isPending}>
              <Button.Icon icon={Play} />
              <Button.Text>Start Lesson</Button.Text>
            </Button.Root>
          </View>
        </BottomSheetView>
      )}
    </BottomSheetModal>
  )
})

BottomSheetLessonDetails.displayName = "BottomSheetLessonDetails"

export default BottomSheetLessonDetails
