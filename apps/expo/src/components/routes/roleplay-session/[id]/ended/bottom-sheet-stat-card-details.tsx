import { forwardRef } from "react"
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet"
import { Dimensions, View } from "react-native"

import type { Color } from "./stat-card"
import * as BottomSheet from "~/ui/bottom-sheet"
import { BottomSheetBackdrop } from "~/ui/bottom-sheet"
import { Text } from "~/ui/text"
import { cn } from "~/utils/utils"
import { COLOR_MAP } from "./stat-card"

export type BottomSheetStatCardDetailsProps = {
  title: string
  value: number
  feedback: string
  color: Color
  onClose: () => void
}

const BottomSheetStatCardDetails = forwardRef<BottomSheetModal, BottomSheetStatCardDetailsProps>(
  ({ title, value, feedback, color, onClose }, ref) => {
    const colors = COLOR_MAP[color]

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
        <BottomSheetView className="flex-1">
          <BottomSheet.Header>
            <BottomSheet.HeaderTitle>{title} Details</BottomSheet.HeaderTitle>
          </BottomSheet.Header>

          <View className="p-4">
            <View className="flex flex-col">
              <Text className="text-lg font-semibold text-neutral-800">Score</Text>
              <View className="flex flex-col gap-1 pb-5">
                <Text className="text-base font-medium text-neutral-500">{value} / 100</Text>
                <View className={cn("flex h-2 w-1/2 rounded-full", colors.progressBg)}>
                  <View className={cn("h-full rounded-full", colors.bg)} style={{ width: `${value}%` }} />
                </View>
              </View>
            </View>

            <View className="flex flex-col">
              <Text className="text-lg font-semibold text-neutral-800">Feedback</Text>
              <Text className="text-base font-medium text-neutral-500">{feedback}</Text>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    )
  },
)

BottomSheetStatCardDetails.displayName = "BottomSheetStatCardDetails"

export default BottomSheetStatCardDetails
