import type { BottomSheetModal } from "@gorhom/bottom-sheet"
import type { FC } from "react"
import { useEffect, useRef } from "react"
import { router, useLocalSearchParams } from "expo-router"
import * as Sharing from "expo-sharing"
import { useQuery } from "@tanstack/react-query"
import { View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import ViewShot from "react-native-view-shot"

import type { TRoleplaySessionGetFeedbackSchema } from "@acme/validators"
import { ZRoleplaySessionGetFeedbackSchema } from "@acme/validators"

import type { StatCardProps } from "~/components/routes/roleplay-session/[id]/ended/stat-card"
import BottomSheetStreak from "~/components/common/bottom-sheet-streak"
import ShareableRating from "~/components/routes/roleplay-session/[id]/ended/shareable-rating"
import StatCard from "~/components/routes/roleplay-session/[id]/ended/stat-card"
import * as Button from "~/ui/button"
import { Text } from "~/ui/text"
import { trpc } from "~/utils/api"
import { useUserStore } from "~/utils/zustand/user-store"

const STATS_COLUMNS = 2

const createStatsFromFeedback = (feedback: TRoleplaySessionGetFeedbackSchema): StatCardProps[] => [
  {
    title: "Filler Words",
    value: feedback.fillerWords.score,
    feedback: feedback.fillerWords.feedback,
    color: "purple",
  },
  {
    title: "Fluency",
    value: feedback.fluency.score,
    feedback: feedback.fluency.feedback,
    color: "green",
  },
  {
    title: "Grammar",
    value: feedback.grammar.score,
    feedback: feedback.grammar.feedback,
    color: "yellow",
  },
  {
    title: "Interaction",
    value: feedback.interaction.score,
    feedback: feedback.interaction.feedback,
    color: "sky",
  },
  {
    title: "Vocabulary",
    value: feedback.vocabulary.score,
    feedback: feedback.vocabulary.feedback,
    color: "teal",
  },
  {
    title: "Confidence",
    value: feedback.confidence.score,
    feedback: feedback.confidence.feedback,
    color: "indigo",
  },
]

const RoleplaySessionIdEnded: FC = () => {
  const { id, showStreak } = useLocalSearchParams<{ id: string; showStreak: string }>()
  const shareableRef = useRef<ViewShot>(null)
  const bottomSheetStreakRef = useRef<BottomSheetModal>(null)

  const currentOrganizationId = useUserStore((state) => state.currentOrganizationId)
  if (!currentOrganizationId) throw new Error("Current organization ID not found")

  const profileRoleplaySessionGet = useQuery(
    trpc.profile.roleplaySession.get.queryOptions({ organizationId: currentOrganizationId, roleplaySessionId: id }),
  )
  if (!profileRoleplaySessionGet.data) throw new Error("Roleplay session not found")
  if (!profileRoleplaySessionGet.data.feedback) throw new Error("Feedback not found")

  const roleplaySession = profileRoleplaySessionGet.data

  const feedback = ZRoleplaySessionGetFeedbackSchema.safeParse(roleplaySession.feedback)
  if (!feedback.success) throw new Error("Invalid feedback")

  const stats = createStatsFromFeedback(feedback.data)

  useEffect(() => {
    if (showStreak === "true") {
      bottomSheetStreakRef.current?.present()
    }
  }, [showStreak])

  const handleShareRating = async () => {
    if (!shareableRef.current?.capture) {
      console.error("Shareable ref not found")
      return
    }

    try {
      const uri = await shareableRef.current.capture()
      await Sharing.shareAsync(uri, {
        mimeType: "image/png",
        dialogTitle: "Share your roleplay rating",
      })
    } catch (error) {
      console.error("Error sharing rating:", error)
    }
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-white p-4">
      <View className="flex-1 flex-col justify-between">
        {/* Header */}
        <View className="flex flex-col items-center gap-0.5">
          <Text className="text-center text-2xl font-bold text-neutral-700">Roleplay Session Rating</Text>
          <Text className="text-center text-sm font-medium text-neutral-400">Press on a card to see more details</Text>
        </View>

        {/* Stats Grid */}
        <View className="gap-4">
          {Array.from({ length: Math.ceil(stats.length / STATS_COLUMNS) }, (_, rowIndex) => (
            <View key={rowIndex} className="flex-row gap-4">
              {stats.slice(rowIndex * STATS_COLUMNS, rowIndex * STATS_COLUMNS + STATS_COLUMNS).map((stat, colIndex) => (
                <StatCard key={`${rowIndex}-${colIndex}`} {...stat} />
              ))}
            </View>
          ))}
        </View>

        {/* Actions */}
        <View className="flex flex-col gap-2">
          <Button.Root variant="ghost" className="w-full" onPress={handleShareRating}>
            <Button.Text>Share Rating</Button.Text>
          </Button.Root>
          <Button.Root variant="primary" className="w-full" onPress={() => router.replace(`/(tabs)/roleplays`)}>
            <Button.Text>Continue</Button.Text>
          </Button.Root>
        </View>
      </View>

      {/* Hidden shareable component for image generation */}
      <View style={{ position: "absolute", top: -10000, left: -10000 }}>
        <ViewShot ref={shareableRef} options={{ fileName: "roleplay-rating", format: "png", quality: 0.9 }}>
          <ShareableRating
            stats={stats.map((stat) => ({
              title: stat.title,
              value: stat.value,
              color: stat.color,
            }))}
          />
        </ViewShot>
      </View>

      <BottomSheetStreak ref={bottomSheetStreakRef} />
    </SafeAreaView>
  )
}

export default RoleplaySessionIdEnded
