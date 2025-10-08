import type { FC } from "react"
import React from "react"
import { useQuery } from "@tanstack/react-query"
import { CheckIcon, XIcon } from "lucide-react-native"
import { View } from "react-native"

import { Text } from "~/ui/text"
import { trpc } from "~/utils/api"
import { calculateCurrentWeekProgress, DayStatus } from "~/utils/streak"
import { cn } from "~/utils/utils"

type DayIndicatorProps = {
  status: DayStatus
  day: string
}

const DayIndicator: React.FC<DayIndicatorProps> = ({ status, day }) => {
  return (
    <View className="flex flex-col items-center gap-2">
      <View
        className={cn(
          "size-7 items-center justify-center rounded-full border-2",
          status === DayStatus.COMPLETED && "border-success-500 bg-success-500",
          status === DayStatus.UPCOMING && "border-neutral-100 bg-neutral-100",
          status === DayStatus.MISSED && "border-neutral-300 bg-neutral-300",
          status === DayStatus.PENDING && "border-neutral-300 bg-neutral-50",
        )}
      >
        {status === DayStatus.COMPLETED && <CheckIcon size={16} strokeWidth={4} stroke="white" color="white" />}
        {status === DayStatus.MISSED && <XIcon size={16} strokeWidth={4} stroke="white" color="white" />}
        {status === DayStatus.PENDING && <View className="size-2.5 rounded-full bg-neutral-300" />}
      </View>
      <Text className="text-xs font-semibold text-neutral-400">{day}</Text>
    </View>
  )
}

const Streak: FC = () => {
  const profileMe = useQuery(trpc.profile.me.queryOptions())
  if (!profileMe.data) throw new Error("Failed to fetch profile")

  const profileStreakDays = useQuery(trpc.profile.streakDays.queryOptions({ startDate: undefined, endDate: undefined }))
  if (!profileStreakDays.data) throw new Error("Streak days not found")

  const { daysLabels, weekProgress } = calculateCurrentWeekProgress(profileStreakDays.data, profileMe.data.timezone)

  const stats = [
    {
      emoji: "🔥",
      title: "Current Streak",
      value: profileMe.data.secondsSpoken,
    },
    {
      emoji: "⚡️",
      title: "Longest Streak",
      value: profileMe.data.wordsSpoken,
    },
  ]

  return (
    <>
      <View className="flex flex-col gap-2">
        <Text className="text-xl font-semibold text-neutral-700">Streaks</Text>

        <View className="gap-2.5">
          {Array.from({ length: Math.ceil(stats.length / 2) }, (_, rowIndex) => (
            <View key={rowIndex} className="flex-row gap-2.5">
              {stats.slice(rowIndex * 2, rowIndex * 2 + 2).map((stat, colIndex) => (
                <View key={rowIndex * 2 + colIndex} className="flex-1">
                  <View className="flex flex-row gap-2 rounded-2xl border-2 border-neutral-100 bg-white p-3">
                    <Text className="text-2xl">{stat.emoji}</Text>
                    <View className="flex flex-1 flex-col">
                      <Text className="line-clamp-1 text-lg font-black text-neutral-700">{stat.value}</Text>
                      <Text className="-mt-1 line-clamp-1 text-xs font-semibold text-neutral-400">{stat.title}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>

        <View className="rounded-2xl border-2 border-neutral-100 bg-white">
          <View className="flex flex-row justify-between gap-2 p-3">
            {daysLabels.map((day, index) => (
              <DayIndicator key={day + index} day={day} status={weekProgress[index] ?? DayStatus.UPCOMING} />
            ))}
          </View>
        </View>
      </View>
    </>
  )
}

export default Streak
