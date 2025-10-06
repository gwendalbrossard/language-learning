import type { FC } from "react"
import { useQuery } from "@tanstack/react-query"
import { View } from "react-native"

import { Text } from "~/ui/text"
import { trpc } from "~/utils/api"
import { useUserStore } from "~/utils/zustand/user-store"

const Progress: FC = () => {
  const currentOrganizationId = useUserStore((state) => state.currentOrganizationId)
  if (!currentOrganizationId) throw new Error("Current organization ID not found")

  const profileMe = useQuery(trpc.profile.me.queryOptions())
  if (!profileMe.data) throw new Error("Profile me not found")

  const stats = [
    {
      emoji: "🗣️",
      title: "Minutes Spoken",
      value: 12,
    },
    {
      emoji: "💬",
      title: "Words Spoken",
      value: 12,
    },
    {
      emoji: "🎓",
      title: "Lessons Done",
      value: 12,
    },
    {
      emoji: "🎭",
      title: "Roleplays Done",
      value: 12,
    },
    {
      emoji: "📘",
      title: "Vocab Learned",
      value: 951,
    },
    {
      emoji: "🔥",
      title: "Days of Practice",
      value: 12,
    },
  ]

  return (
    <View className="flex flex-col gap-4">
      {/* Stats */}
      <View className="flex flex-col gap-2">
        <Text className="text-xl font-semibold text-neutral-700">Statistics</Text>
        <View className="gap-2.5">
          {Array.from({ length: Math.ceil(stats.length / 2) }, (_, rowIndex) => (
            <View key={rowIndex} className="flex-row gap-2.5">
              {stats.slice(rowIndex * 2, rowIndex * 2 + 2).map((stat, colIndex) => (
                <View key={rowIndex * 2 + colIndex} className="flex-1">
                  <View className="flex flex-row gap-2 rounded-2xl border-2 border-neutral-100 bg-white p-3">
                    <Text className="text-2xl">{stat.emoji}</Text>
                    <View className="flex flex-1 flex-col">
                      <Text className="line-clamp-1 text-lg font-bold text-neutral-700">{stat.value.toLocaleString()}</Text>
                      <Text className="-mt-1 line-clamp-1 text-xs font-medium text-neutral-400">{stat.title}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

export default Progress
