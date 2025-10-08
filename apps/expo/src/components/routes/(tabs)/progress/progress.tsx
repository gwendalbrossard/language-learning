import { forwardRef, useImperativeHandle, useRef } from "react"
import * as Sharing from "expo-sharing"
import { useQuery } from "@tanstack/react-query"
import { View } from "react-native"
import ViewShot from "react-native-view-shot"

import { Text } from "~/ui/text"
import { trpc } from "~/utils/api"
import { useUserStore } from "~/utils/zustand/user-store"
import ShareableStats from "./shareable-stats"

export interface ProgressRef {
  shareStats: () => Promise<void>
}

const Progress = forwardRef<ProgressRef>((_, ref) => {
  const shareableRef = useRef<ViewShot>(null)
  const currentOrganizationId = useUserStore((state) => state.currentOrganizationId)
  if (!currentOrganizationId) throw new Error("Current organization ID not found")

  const profileMe = useQuery(trpc.profile.me.queryOptions())
  if (!profileMe.data) throw new Error("Profile me not found")

  const stats = [
    {
      emoji: "🗣️",
      title: "Seconds Spoken",
      value: profileMe.data.secondsSpoken,
    },
    {
      emoji: "💬",
      title: "Words Spoken",
      value: profileMe.data.wordsSpoken,
    },
    {
      emoji: "📚",
      title: "Seconds In Lessons",
      value: profileMe.data.secondsInLessons,
    },
    {
      emoji: "🎬",
      title: "Seconds In Roleplays",
      value: profileMe.data.secondsInRoleplays,
    },
    {
      emoji: "🎓",
      title: "Lessons Done",
      value: profileMe.data.lessonsDone,
    },
    {
      emoji: "🎭",
      title: "Roleplays Done",
      value: profileMe.data.roleplaysDone,
    },
    {
      emoji: "📘",
      title: "Vocab Learned",
      value: profileMe.data.vocabularyLearned,
    },
    {
      emoji: "🔥",
      title: "Days of Practice",
      value: profileMe.data.daysOfPractice,
    },
  ]

  const handleShare = async () => {
    if (!shareableRef.current) throw new Error("Shareable ref not found")
    if (!shareableRef.current.capture) throw new Error("Shareable ref not found")

    const uri = await shareableRef.current.capture()

    await Sharing.shareAsync(uri, {
      mimeType: "image/png",
      dialogTitle: "Share your progress",
    })
  }

  useImperativeHandle(ref, () => ({
    shareStats: handleShare,
  }))

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
                      <Text className="line-clamp-1 text-lg font-black text-neutral-700">{stat.value}</Text>
                      <Text className="-mt-1 line-clamp-1 text-xs font-semibold text-neutral-400">{stat.title}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* Hidden shareable component for image generation */}
      <View style={{ position: "absolute", top: -10000, left: -10000 }}>
        <ViewShot ref={shareableRef} options={{ fileName: "progress-stats", format: "png", quality: 0.9 }}>
          <ShareableStats stats={stats} />
        </ViewShot>
      </View>
    </View>
  )
})

Progress.displayName = "Progress"

export default Progress
