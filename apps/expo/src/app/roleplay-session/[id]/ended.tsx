import type { FC } from "react"
import { forwardRef, useRef } from "react"
import { router, useLocalSearchParams } from "expo-router"
import * as Sharing from "expo-sharing"
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet"
import { useQuery } from "@tanstack/react-query"
import { Dimensions, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import ViewShot from "react-native-view-shot"

import type { TRoleplaySessionGetFeedbackSchema } from "@acme/validators"
import { ZRoleplaySessionGetFeedbackSchema } from "@acme/validators"

import * as BottomSheet from "~/ui/bottom-sheet"
import { BottomSheetBackdrop } from "~/ui/bottom-sheet"
import * as Button from "~/ui/button"
import { Text } from "~/ui/text"
import ShareableRating from "~/components/routes/roleplay-session/[id]/ended/shareable-rating"
import { trpc } from "~/utils/api"
import { cn } from "~/utils/utils"
import { useUserStore } from "~/utils/zustand/user-store"

type Color = "yellow" | "green" | "teal" | "sky" | "indigo" | "purple"

type StatData = {
  title: string
  value: number
  feedback: string
  color: Color
}

type StatCardProps = StatData

type BottomSheetDetailsProps = {
  title: string
  value: number
  feedback: string
  color: Color
  onClose: () => void
}

const COLOR_MAP: Record<Color, { bg: string; text: string; progressBg: string }> = {
  yellow: { bg: "bg-[#FFED87]", text: "text-[#FFED87]", progressBg: "bg-[#FFED87]/30" },
  green: { bg: "bg-[#9FEED9]", text: "text-[#9FEED9]", progressBg: "bg-[#9FEED9]/30" },
  teal: { bg: "bg-[#EB71A8]", text: "text-[#EB71A8]", progressBg: "bg-[#EB71A8]/30" },
  sky: { bg: "bg-[#90C2FF]", text: "text-[#90C2FF]", progressBg: "bg-[#90C2FF]/30" },
  indigo: { bg: "bg-[#CD82FF]", text: "text-[#CD82FF]", progressBg: "bg-[#CD82FF]/30" },
  purple: { bg: "bg-[#FF988A]", text: "text-[#FF988A]", progressBg: "bg-[#FF988A]/30" },
}

const STATS_COLUMNS = 2

const createStatsFromFeedback = (feedback: TRoleplaySessionGetFeedbackSchema): StatData[] => [
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

const BottomSheetEndedCardDetails = forwardRef<BottomSheetModal, BottomSheetDetailsProps>(({ title, value, feedback, color, onClose }, ref) => {
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
})

BottomSheetEndedCardDetails.displayName = "BottomSheetEndedCardDetails"

// ==================== Main Component ====================

const RoleplaySessionIdEnded: FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const shareableRef = useRef<ViewShot>(null)

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
        <View className="gap-5">
          {Array.from({ length: Math.ceil(stats.length / STATS_COLUMNS) }, (_, rowIndex) => (
            <View key={rowIndex} className="flex-row gap-5">
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
            stats={stats.map(stat => ({
              title: stat.title,
              value: stat.value,
              color: stat.color,
            }))}
          />
        </ViewShot>
      </View>
    </SafeAreaView>
  )
}

export default RoleplaySessionIdEnded
