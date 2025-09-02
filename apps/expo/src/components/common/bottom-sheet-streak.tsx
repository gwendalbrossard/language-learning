import React, { forwardRef } from "react"
import { LinearGradient } from "expo-linear-gradient"
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet"
import MaskedView from "@react-native-masked-view/masked-view"
import { useQuery } from "@tanstack/react-query"
import { CheckIcon, XIcon } from "lucide-react-native"
import { Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Rive from "rive-react-native"

import * as Button from "~/ui/button"
import { trpc } from "~/utils/api"
import { calculateCurrentWeekProgress, DayStatus } from "~/utils/streak"
import { cn } from "~/utils/utils"

type DayIndicatorProps = {
  status: DayStatus
  day: string
}
const DayIndicator: React.FC<DayIndicatorProps> = ({ status, day }) => {
  return (
    <View className="items-center">
      <Text className="mb-2 text-sm text-neutral-500">{day}</Text>
      <View
        className={cn(
          "size-7 items-center justify-center rounded-full border",
          status === DayStatus.COMPLETED && "border-success-500 bg-success-500",
          status === DayStatus.UPCOMING && "border-neutral-200 bg-neutral-200",
          status === DayStatus.MISSED && "border-neutral-300 bg-neutral-300",
          status === DayStatus.PENDING && "border-neutral-300 bg-neutral-100",
        )}
      >
        {status === DayStatus.COMPLETED && <CheckIcon size={16} strokeWidth={4} stroke="white" color="white" />}
        {status === DayStatus.MISSED && <XIcon size={16} strokeWidth={4} stroke="white" color="white" />}
        {status === DayStatus.PENDING && <View className="size-2.5 rounded-full bg-neutral-300" />}
      </View>
    </View>
  )
}

const BottomSheetStreak = forwardRef<BottomSheetModal, object>((_, ref) => {
  const refCurrent = ref as React.RefObject<BottomSheetModal>

  const profileMe = useQuery(trpc.profile.me.queryOptions())
  if (!profileMe.data) throw new Error("Failed to fetch profile")

  const streakDays = useQuery(trpc.profile.streakDays.queryOptions({ startDate: undefined, endDate: undefined }))
  if (!streakDays.data) throw new Error("Failed to fetch streak days")

  const { daysLabels, weekProgress } = calculateCurrentWeekProgress(streakDays.data, profileMe.data.timezone)

  const handleClose = () => {
    refCurrent.current.dismiss()
  }

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={["100%"]}
      enablePanDownToClose={false}
      enableHandlePanningGesture={false}
      enableContentPanningGesture={false}
      handleStyle={{ display: "none" }}
      stackBehavior="push"
    >
      <BottomSheetView className="relative flex-1">
        <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: "white" }}>
          <View className="flex-1 justify-between">
            {/* Body */}
            <View className="items-center justify-center gap-3 pt-12">
              <Rive url="https://assets.daybydayapp.com/rives/fire.riv" style={{ width: 150, height: 180 }} />

              {/* Streak Count */}
              <View className="mb-8">
                <MaskedView
                  style={{ height: 116 }}
                  maskElement={<Text className="text-center text-8xl font-bold">{profileMe.data.currentStreak}</Text>}
                >
                  <LinearGradient colors={["#FFD74A", "#F1793E"]} start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }} />
                </MaskedView>
                <Text className="text-center text-2xl font-bold text-warning-400">days of progress</Text>
              </View>
              {/* Weekly Progress */}
              <View className="mb-4 w-full max-w-[90%] rounded-xl bg-neutral-50 p-4">
                <View className="flex-row justify-between gap-2">
                  {daysLabels.map((day, index) => (
                    <DayIndicator key={day + index} day={day} status={weekProgress[index] ?? DayStatus.UPCOMING} />
                  ))}
                </View>
              </View>

              {/* Message */}
              <Text className="text-center text-sm text-neutral-500">Keep going! Every day counts towards your journey.</Text>
            </View>

            {/* Footer */}
            <View className="flex-1 justify-end">
              <Button.Root onPress={handleClose} className="w-full" size="xl">
                <Button.Text>Continue</Button.Text>
              </Button.Root>
            </View>
          </View>
        </SafeAreaView>
      </BottomSheetView>
    </BottomSheetModal>
  )
})

BottomSheetStreak.displayName = "BottomSheetStreak"

export default BottomSheetStreak
