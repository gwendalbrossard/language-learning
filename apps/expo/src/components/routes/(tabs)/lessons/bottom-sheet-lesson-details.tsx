import type { FC } from "react"
import { forwardRef } from "react"
import { router } from "expo-router"
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet"
import { useMutation } from "@tanstack/react-query"
import { Play } from "lucide-react-native"
import { Dimensions, View } from "react-native"

import type { Difficulty } from "~/components/common/difficulty"
import type { DifficultyIconProps } from "~/components/common/filters"
import type { RouterOutputs } from "~/utils/api"
import { getDifficultyIcon, getDifficultyName } from "~/components/common/difficulty"
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

const DifficultyIcon: FC<DifficultyIconProps> = ({ difficulty }) => {
  const Icon = getDifficultyIcon(difficulty)
  return <Icon width={14} height={14} />
}

const BottomSheetLessonDetails = forwardRef<BottomSheetModal, Props>(({ lesson, onClose }, ref) => {
  const currentOrganizationId = useUserStore((state) => state.currentOrganizationId)
  if (!currentOrganizationId) throw new Error("Current organization ID not found")

  const profileLessonSessionCreateMutation = useMutation(
    trpc.profile.lessonSession.create.mutationOptions({
      onSuccess: async (data) => {
        if (ref && "current" in ref && ref.current) {
          ref.current.dismiss()
        }
        await queryClient.fetchQuery(trpc.profile.lessonSession.get.queryOptions({ lessonSessionId: data.id, organizationId: currentOrganizationId }))
        router.replace(`/lesson-session/${data.id}`)
      },
    }),
  )

  const handleStartLesson = () => {
    if (!lesson) throw new Error("Lesson not found")
    profileLessonSessionCreateMutation.mutate({ lessonId: lesson.id, organizationId: currentOrganizationId })
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

                {/* Category and difficulty */}
                <View className="flex flex-row items-center gap-2.5">
                  <Badge.Root variant="white" size="sm">
                    <Badge.Text>
                      {lesson.category.emoji} {lesson.category.name}
                    </Badge.Text>
                  </Badge.Root>

                  <Badge.Root variant="white" size="sm">
                    <DifficultyIcon difficulty={lesson.difficulty as Difficulty} />
                    <Badge.Text>{getDifficultyName(lesson.difficulty as Difficulty)}</Badge.Text>
                  </Badge.Root>
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
            <Button.Root
              className="w-full"
              size="lg"
              variant="primary"
              onPress={handleStartLesson}
              loading={profileLessonSessionCreateMutation.isPending}
            >
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
