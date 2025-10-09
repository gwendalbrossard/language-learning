import type { BottomSheetModal } from "@gorhom/bottom-sheet"
import type { FC } from "react"
import { useRef } from "react"
import { TouchableOpacity, View } from "react-native"

import { Text } from "~/ui/text"
import { cn } from "~/utils/utils"
import BottomSheetEndedCardDetails from "./bottom-sheet-details"

export type Color = "yellow" | "green" | "teal" | "sky" | "indigo" | "purple"

export type StatCardProps = {
  title: string
  value: number
  feedback: string
  color: Color
}

export const COLOR_MAP: Record<Color, { bg: string; text: string; progressBg: string }> = {
  yellow: { bg: "bg-[#FFED87]", text: "text-[#FFED87]", progressBg: "bg-[#FFED87]/30" },
  green: { bg: "bg-[#9FEED9]", text: "text-[#9FEED9]", progressBg: "bg-[#9FEED9]/30" },
  teal: { bg: "bg-[#EB71A8]", text: "text-[#EB71A8]", progressBg: "bg-[#EB71A8]/30" },
  sky: { bg: "bg-[#90C2FF]", text: "text-[#90C2FF]", progressBg: "bg-[#90C2FF]/30" },
  indigo: { bg: "bg-[#CD82FF]", text: "text-[#CD82FF]", progressBg: "bg-[#CD82FF]/30" },
  purple: { bg: "bg-[#FF988A]", text: "text-[#FF988A]", progressBg: "bg-[#FF988A]/30" },
}

const StatCard: FC<StatCardProps> = ({ title, value, color, feedback }) => {
  const colors = COLOR_MAP[color]
  const bottomSheetRef = useRef<BottomSheetModal>(null)

  const handlePress = () => {
    bottomSheetRef.current?.present()
  }

  return (
    <>
      <TouchableOpacity onPress={handlePress} className="flex-1 rounded-3xl border-2 border-neutral-100 bg-neutral-50 p-2">
        <Text className="pb-1 text-center text-xs font-black uppercase text-neutral-500">{title}</Text>
        <View className="flex flex-col items-center gap-1 rounded-[22px] border-2 border-neutral-100 bg-white px-5 pb-5 pt-4">
          <Text className="text-center text-[40px] font-black text-neutral-700">{value}</Text>
          <View className={cn("flex h-3 w-full rounded-full", colors.progressBg)}>
            <View className={cn("h-full rounded-full", colors.bg)} style={{ width: `${value}%` }} />
          </View>
        </View>
      </TouchableOpacity>

      <BottomSheetEndedCardDetails
        ref={bottomSheetRef}
        title={title}
        value={value}
        feedback={feedback}
        color={color}
        onClose={() => bottomSheetRef.current?.dismiss()}
      />
    </>
  )
}

export default StatCard