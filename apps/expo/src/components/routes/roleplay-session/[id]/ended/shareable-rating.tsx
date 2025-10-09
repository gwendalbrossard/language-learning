import type { FC } from "react"
import { View } from "react-native"

import { Text } from "~/ui/text"
import { cn } from "~/utils/utils"

type Color = "yellow" | "green" | "teal" | "sky" | "indigo" | "purple"

interface ShareableRatingProps {
  stats: {
    title: string
    value: number
    color: Color
  }[]
}

const COLOR_MAP: Record<Color, { bg: string; progressBg: string }> = {
  yellow: { bg: "bg-[#FFED87]", progressBg: "bg-[#FFED87]/30" },
  green: { bg: "bg-[#9FEED9]", progressBg: "bg-[#9FEED9]/30" },
  teal: { bg: "bg-[#EB71A8]", progressBg: "bg-[#EB71A8]/30" },
  sky: { bg: "bg-[#90C2FF]", progressBg: "bg-[#90C2FF]/30" },
  indigo: { bg: "bg-[#CD82FF]", progressBg: "bg-[#CD82FF]/30" },
  purple: { bg: "bg-[#FF988A]", progressBg: "bg-[#FF988A]/30" },
}

const ShareableRating: FC<ShareableRatingProps> = ({ stats }) => {
  return (
    <View className="flex-col bg-white p-6" style={{ width: 400, height: 600 }}>
      {/* Header */}
      <View className="mb-6 items-center pt-2">
        <Text className="mb-1 text-center text-3xl font-bold text-neutral-700">Roleplay Rating</Text>
        <Text className="text-center text-base text-neutral-500">Performance Feedback</Text>
      </View>

      {/* Stats Grid - matching ended screen layout */}
      <View className="flex-1 justify-center">
        {Array.from({ length: Math.ceil(stats.length / 2) }, (_, rowIndex) => (
          <View key={rowIndex} className="mb-4 flex-row">
            {stats.slice(rowIndex * 2, rowIndex * 2 + 2).map((stat, colIndex) => (
              <View key={rowIndex * 2 + colIndex} className={`flex-1 ${colIndex === 0 ? "mr-3" : ""}`}>
                <View className="rounded-3xl border-2 border-neutral-100 bg-neutral-50 p-2">
                  <Text className="pb-1 text-center text-xs font-black uppercase text-neutral-500">{stat.title}</Text>
                  <View className="flex flex-col items-center gap-1 rounded-[22px] border-2 border-neutral-100 bg-white px-4 pb-4 pt-3">
                    <Text className="text-center text-3xl font-black text-neutral-700">{stat.value}</Text>
                    <View className={cn("flex h-2 w-full rounded-full", COLOR_MAP[stat.color].progressBg)}>
                      <View className={cn("h-full rounded-full", COLOR_MAP[stat.color].bg)} style={{ width: `${stat.value}%` }} />
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Footer */}
      <View className="mt-4 items-center">
        <Text className="text-center text-xs text-neutral-400">Generated with StudyUnfold</Text>
      </View>
    </View>
  )
}

export default ShareableRating