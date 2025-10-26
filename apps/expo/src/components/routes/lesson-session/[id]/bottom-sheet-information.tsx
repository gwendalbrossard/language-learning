import type { FC } from "react"
import React, { forwardRef } from "react"
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet"
import { View } from "react-native"

import type { RouterOutputs } from "@acme/api"

import type { Difficulty } from "~/components/common/difficulty"
import type { DifficultyIconProps } from "~/components/common/filters"
import { getDifficultyIcon, getDifficultyName } from "~/components/common/difficulty"
import * as Badge from "~/ui/badge"
import { BottomSheetBackdrop } from "~/ui/bottom-sheet"
import { Text } from "~/ui/text"

type Props = {
  lessonSession: RouterOutputs["profile"]["lessonSession"]["get"]
}

const DifficultyIcon: FC<DifficultyIconProps> = ({ difficulty }) => {
  const Icon = getDifficultyIcon(difficulty)
  return <Icon width={14} height={14} />
}

export const BottomSheetInformation = forwardRef<BottomSheetModal, Props>(({ lessonSession }, ref) => {
  return (
    <BottomSheetModal
      ref={ref}
      backdropComponent={BottomSheetBackdrop}
      snapPoints={["80%"]}
      enablePanDownToClose
      stackBehavior="push"
      enableDynamicSizing={true}
    >
      <BottomSheetView className="px-4 pb-10 pt-2">
        {/* Lesson Details */}
        <View className="flex flex-col gap-6">
          {/* Header */}
          <View className="flex flex-col items-center gap-4">
            <Text className="text-4xl">{lessonSession.lesson.emoji}</Text>
            <View className="flex flex-col items-center gap-2">
              <Text className="text-center text-2xl font-semibold text-neutral-900">{lessonSession.lesson.title}</Text>

              {/* Category and difficulty */}
              <View className="flex flex-row items-center gap-2.5">
                <Badge.Root variant="white" size="md">
                  <Badge.Text>
                    {lessonSession.lesson.category.emoji} {lessonSession.lesson.category.name}
                  </Badge.Text>
                </Badge.Root>

                <Badge.Root variant="white" size="sm">
                  <DifficultyIcon difficulty={lessonSession.lesson.difficulty as Difficulty} />
                  <Badge.Text>{getDifficultyName(lessonSession.lesson.difficulty as Difficulty)}</Badge.Text>
                </Badge.Root>
              </View>
            </View>
          </View>

          {/* Description */}
          <View className="flex flex-col gap-1">
            <Text className="text-lg font-semibold text-neutral-900">About This Lesson</Text>
            <Text className="font-base text-base font-medium leading-6 text-neutral-500">{lessonSession.lesson.description}</Text>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  )
})

BottomSheetInformation.displayName = "BottomSheetInformation"
