import type { FC } from "react"
import { View } from "react-native"

import { Text } from "~/ui/text"

interface ShareableStatsProps {
  stats: {
    emoji: string
    title: string
    value: number
  }[]
}

const ShareableStats: FC<ShareableStatsProps> = ({ stats }) => {
  return (
    <View className="flex-col bg-white p-6" style={{ width: 400, height: 600 }}>
      {/* Header */}
      <View className="mb-6 items-center pt-2">
        <Text className="mb-1 text-center text-3xl font-bold text-neutral-700">My Progress</Text>
        <Text className="text-center text-base text-neutral-500">Language Learning Journey</Text>
      </View>

      {/* Stats Grid - matching original layout exactly */}
      <View className="flex-1">
        {Array.from({ length: Math.ceil(stats.length / 2) }, (_, rowIndex) => (
          <View key={rowIndex} className="mb-2.5 flex-row">
            {stats.slice(rowIndex * 2, rowIndex * 2 + 2).map((stat, colIndex) => (
              <View key={rowIndex * 2 + colIndex} className={`flex-1 ${colIndex === 0 ? "mr-2.5" : ""}`}>
                <View className="flex-row items-start rounded-2xl border-2 border-neutral-100 bg-white p-3" style={{ minHeight: 60 }}>
                  <View className="w-8 items-center">
                    <Text className="text-2xl">{stat.emoji}</Text>
                  </View>
                  <View className="ml-2 flex-1 justify-center">
                    <Text className="mb-0.5 text-lg font-bold text-neutral-700">{stat.value.toLocaleString()}</Text>
                    <Text className="-mt-1 text-xs font-medium text-neutral-400">{stat.title}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Footer */}
      <View className="mt-4 items-center">
        <Text className="text-center text-xs text-neutral-400">Generated with Polyglot AI</Text>
      </View>
    </View>
  )
}

export default ShareableStats
