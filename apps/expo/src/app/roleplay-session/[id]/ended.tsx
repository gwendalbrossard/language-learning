import type { FC } from "react"
import { forwardRef, useRef, useState } from "react"
import { useLocalSearchParams } from "expo-router"
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet"
import { useQuery } from "@tanstack/react-query"
import { Dimensions, Pressable, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { ZRoleplaySessionGetFeedbackSchema } from "@acme/validators"

import * as BottomSheet from "~/ui/bottom-sheet"
import { BottomSheetBackdrop } from "~/ui/bottom-sheet"
import * as Button from "~/ui/button"
import { Text } from "~/ui/text"
import { trpc } from "~/utils/api"
import { cn } from "~/utils/utils"
import { useUserStore } from "~/utils/zustand/user-store"

export const description = "A radar chart"

type StatCardProps = {
  title: string
  value: number
}

type Color = "neutral" | "yellow" | "green" | "teal" | "sky" | "indigo" | "purple" | "pink"
const colorMap: Record<Color, { bg: string; text: string; progressBg: string }> = {
  neutral: { bg: "bg-neutral-500", text: "text-neutral-500", progressBg: "bg-neutral-100" },
  yellow: { bg: "bg-[#FFED87]", text: "text-[#FFED87]", progressBg: "bg-[#FFED87]/30" },
  green: { bg: "bg-[#9FEED9]", text: "text-[#9FEED9]", progressBg: "bg-[#9FEED9]/30" },
  teal: { bg: "bg-[#EB71A8]", text: "text-[#EB71A8]", progressBg: "bg-[#EB71A8]/30" },
  sky: { bg: "bg-[#90C2FF]", text: "text-[#90C2FF]", progressBg: "bg-[#90C2FF]/30" },
  indigo: { bg: "bg-[#CD82FF]", text: "text-[#CD82FF]", progressBg: "bg-[#CD82FF]/30" },
  purple: { bg: "bg-[#FF988A]", text: "text-[#FF988A]", progressBg: "bg-[#FF988A]/30" },
  pink: { bg: "bg-[#EB71A8]", text: "text-[#EB71A8]", progressBg: "bg-[#EB71A8]/30" },
  /* yellow: { bg: "bg-yellow-400", text: "text-yellow-400", progressBg: "bg-yellow-100" },
  green: { bg: "bg-green-400", text: "text-green-400", progressBg: "bg-green-100" },
  teal: { bg: "bg-teal-400", text: "text-teal-400", progressBg: "bg-teal-100" },
  sky: { bg: "bg-sky-400", text: "text-sky-400", progressBg: "bg-sky-100" },
  indigo: { bg: "bg-indigo-400", text: "text-indigo-400", progressBg: "bg-indigo-100" },
  purple: { bg: "bg-purple-400", text: "text-purple-400", progressBg: "bg-purple-100" },
  pink: { bg: "bg-pink-400", text: "text-pink-400", progressBg: "bg-pink-100" }, */
}

type StatCardColorProps = {
  title: string
  value: number
  feedback: string
  color: Color
  onPress: () => void
}
/* const StatCardColor: FC<StatCardColorProps> = ({ title, value, color }) => {
  const colors = colorMap[color]

  return (
    <View className={cn("flex-1 rounded-3xl p-[3px]", colors.bg)}>
      <Text className="py-0.5 text-center text-xs font-black uppercase text-white">{title}</Text>
      <View className="flex flex-col items-center gap-1 rounded-[22px] bg-white px-7 pb-5 pt-4">
        <Text className={cn("text-center text-4xl font-black text-neutral-700")}>{value}</Text>
        <View className={cn("flex h-3 w-full rounded-full", colors.progressBg)}>
          <View className={cn("h-full rounded-full", colors.bg)} style={{ width: `${value}%` }} />
        </View>
      </View>
    </View>
  )
} */

const StatCardColor: FC<StatCardColorProps> = ({ title, value, _feedback, color, onPress }) => {
  const colors = colorMap[color]

  return (
    <TouchableOpacity onPress={onPress} className={cn("flex-1 rounded-3xl border-2 border-neutral-100 bg-neutral-50 p-2")}>
      <Text className="pb-1 text-center text-xs font-black uppercase text-neutral-500">{title}</Text>
      <View className="flex flex-col items-center gap-1 rounded-[22px] border-2 border-neutral-100 bg-white px-5 pb-5 pt-4">
        <Text className={cn("text-center text-[40px] font-black text-neutral-700")}>{value}</Text>
        <View className={cn("flex h-3 w-full rounded-full", colors.progressBg)}>
          <View className={cn("h-full rounded-full", colors.bg)} style={{ width: `${value}%` }} />
        </View>
      </View>
    </TouchableOpacity>
  )
}

const RoleplaySessionIdEnded: FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [selectedCard, setSelectedCard] = useState<Omit<StatCardColorProps, "onPress"> | null>(null)

  const bottomSheetEndedCardDetailsRef = useRef<BottomSheetModal>(null)

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

  const stats: Omit<StatCardColorProps, "onPress">[] = [
    {
      title: "Filler Words",
      value: feedback.data.fillerWords.score,
      color: "purple",
    },
    {
      title: "Fluency",
      value: feedback.data.fluency.score,
      color: "green",
    },
    {
      title: "Grammar",
      value: feedback.data.grammar.score,
      color: "yellow",
    },
    {
      title: "Interaction",
      value: feedback.data.interaction.score,
      color: "sky",
    },
    {
      title: "Vocabulary",
      value: feedback.data.vocabulary.score,
      color: "teal",
    },
    {
      title: "Vocabulary",
      value: feedback.data.vocabulary.score,
      color: "indigo",
    },
  ]

  const handlePressCard = (card: Omit<StatCardColorProps, "onPress">) => {
    setSelectedCard(card)
    bottomSheetEndedCardDetailsRef.current?.present()
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-white p-4">
      {/*  <Text>{feedback.data.summary}</Text> */}
      {/*  <View className="gap-2.5">
        {Array.from({ length: Math.ceil(stats.length / 2) }, (_, rowIndex) => (
          <View key={rowIndex} className="flex-row gap-2.5">
            {stats.slice(rowIndex * 2, rowIndex * 2 + 2).map((stat, colIndex) => (
              <StatCard key={rowIndex * 2 + colIndex} title={stat.title} value={stat.value} />
            ))}
          </View>
        ))}
      </View> */}

      <View className="flex-1 flex-col justify-between">
        <View className="flex flex-col items-center gap-0.5">
          <Text className="text-center text-2xl font-bold text-neutral-700">Roleplay Session Rating</Text>
          <Text className="text-center text-sm font-medium text-neutral-400">Press on a card to see more details</Text>
        </View>

        {/* <View className="flex flex-col gap-3">
          <View className="flex flex-col gap-2 rounded-2xl border-2 border-neutral-100 p-4">
            <View className="flex flex-row items-center justify-between gap-2">
              <Text className="text-lg font-semibold text-neutral-700">Overall Score</Text>
              <ChevronRightIcon size={24} className="text-neutral-300" />
            </View>
            <View className="flex h-4 w-full rounded-full bg-neutral-200">
              <View className="h-full rounded-full bg-primary-500" style={{ width: `${feedback.data.overallScore}%` }} />
            </View>
          </View>
          <View className="flex flex-col gap-2 rounded-2xl border-2 border-neutral-100 p-4">
            <View className="flex flex-row items-center justify-between gap-2">
              <Text className="text-lg font-semibold text-neutral-700">Overall Score</Text>
              <ChevronRightIcon size={24} className="text-neutral-300" />
            </View>
            <View className="flex h-4 w-full rounded-full bg-neutral-200">
              <View className="h-full rounded-full bg-primary-500" style={{ width: `${feedback.data.overallScore}%` }} />
            </View>
          </View>
          <View className="flex flex-col gap-2 rounded-2xl border-2 border-neutral-100 p-4">
            <View className="flex flex-row items-center justify-between gap-2">
              <Text className="text-lg font-semibold text-neutral-700">Overall Score</Text>
              <ChevronRightIcon size={24} className="text-neutral-300" />
            </View>
            <View className="flex h-4 w-full rounded-full bg-neutral-200">
              <View className="h-full rounded-full bg-primary-500" style={{ width: `${feedback.data.overallScore}%` }} />
            </View>
          </View>
          <View className="flex flex-col gap-2 rounded-2xl border-2 border-neutral-100 p-4">
            <View className="flex flex-row items-center justify-between gap-2">
              <Text className="text-lg font-semibold text-neutral-700">Overall Score</Text>
              <ChevronRightIcon size={24} className="text-neutral-300" />
            </View>
            <View className="flex h-4 w-full rounded-full bg-neutral-200">
              <View className="h-full rounded-full bg-primary-500" style={{ width: `${feedback.data.overallScore}%` }} />
            </View>
          </View>
          <View className="flex flex-col gap-2 rounded-2xl border-2 border-neutral-100 p-4">
            <View className="flex flex-row items-center justify-between gap-2">
              <Text className="text-lg font-semibold text-neutral-700">Overall Score</Text>
              <ChevronRightIcon size={24} className="text-neutral-300" />
            </View>
            <View className="flex h-4 w-full rounded-full bg-neutral-200">
              <View className="h-full rounded-full bg-primary-500" style={{ width: `${feedback.data.overallScore}%` }} />
            </View>
          </View>
          <View className="flex flex-col gap-2 rounded-2xl border-2 border-neutral-100 p-4">
            <View className="flex flex-row items-center justify-between gap-2">
              <Text className="text-lg font-semibold text-neutral-700">Overall Score</Text>
              <ChevronRightIcon size={24} className="text-neutral-300" />
            </View>
            <View className="flex h-4 w-full rounded-full bg-neutral-200">
              <View className="h-full rounded-full bg-primary-500" style={{ width: `${feedback.data.overallScore}%` }} />
            </View>
          </View>
        </View> */}

        {/* <View className="gap-5">
          {Array.from({ length: Math.ceil(stats.length / 2) }, (_, rowIndex) => (
            <View key={rowIndex} className="flex-row gap-5">
              {stats.slice(rowIndex * 2, rowIndex * 2 + 2).map((stat, colIndex) => (
                <StatNotColored key={rowIndex * 2 + colIndex} title={stat.title} value={stat.value} color={stat.color} />
              ))}
            </View>
          ))}
        </View> */}

        <View className="gap-5">
          {Array.from({ length: Math.ceil(stats.length / 2) }, (_, rowIndex) => (
            <View key={rowIndex} className="flex-row gap-5">
              {stats.slice(rowIndex * 2, rowIndex * 2 + 2).map((stat, colIndex) => (
                <StatCardColor
                  key={rowIndex * 2 + colIndex}
                  title={stat.title}
                  value={stat.value}
                  feedback={stat.feedback}
                  color={stat.color}
                  onPress={() => handlePressCard(stat)}
                />
              ))}
            </View>
          ))}
        </View>

        {/* <View className="gap-3">
          {Array.from({ length: Math.ceil(stats.length / 3) }, (_, rowIndex) => (
            <View key={rowIndex} className="flex-row gap-3">
              {stats.slice(rowIndex * 3, rowIndex * 3 + 3).map((stat, colIndex) => (
                <StatCardColorSmall key={rowIndex * 2 + colIndex} title={stat.title} value={stat.value} color={stat.color} />
              ))}
            </View>
          ))}
        </View> */}

        <View className="flex flex-col gap-2">
          <Button.Root variant="ghost" className="w-full">
            <Button.Text>Share Rating</Button.Text>
          </Button.Root>

          <Button.Root variant="primary" className="w-full">
            <Button.Text>Continue</Button.Text>
          </Button.Root>
        </View>
      </View>

      {/* <View className="gap-2.5">
        <View className="flex-row gap-2.5">
          <StatCardColor title="Overall Score" value={feedback.data.overallScore} color="neutral" />
        </View>
        {Array.from({ length: Math.ceil(stats.length / 2) }, (_, rowIndex) => (
          <View key={rowIndex} className="flex-row gap-2.5">
            {stats.slice(rowIndex * 2, rowIndex * 2 + 2).map((stat, colIndex) => (
              <StatCardColor key={rowIndex * 2 + colIndex} title={stat.title} value={stat.value} color={stat.color} />
            ))}
          </View>
        ))}
      </View> */}

      {/*  <View className="rounded-2xl border-2 border-neutral-100">
        <View className="flex flex-row items-center gap-4 border-b-2 border-neutral-100 p-3">
          <Volume2Icon size={24} color="#666E7D" />
          <View className="flex flex-col">
            <Text className="text-base font-bold text-neutral-700">please</Text>
            <Text className="text-sm font-medium text-neutral-400">improve your filler words</Text>
          </View>
        </View>
        <View className="flex flex-row items-center gap-4 p-3">
          <Volume2Icon size={24} color="#666E7D" />
          <View className="flex flex-col">
            <Text className="text-base font-bold text-neutral-700">please</Text>
            <Text className="text-sm font-medium text-neutral-400">improve your filler words</Text>
          </View>
        </View>
      </View> */}

      {/* <Text>Overall Score</Text>
      <Text>{feedback.data.overallScore}</Text>
      <Text>Filler Words</Text>
      <Text>{feedback.data.fillerWords.score}</Text>
      <Text>Fluency</Text>
      <Text>{feedback.data.fluency.score}</Text>
      <Text>Grammar</Text>
      <Text>{feedback.data.grammar.score}</Text>
      <Text>Interaction</Text>
      <Text>{feedback.data.interaction.score}</Text>
      <Text>Vocabulary</Text>
      <Text>{feedback.data.vocabulary.score}</Text>
      <Text>Messages</Text>
      <Text>Duration</Text>
      <Text>User Speaking Duration</Text>
      <Text>AI Speaking Duration</Text>
      <Text>Created At</Text>
      <Text>Updated At</Text> */}

      <BottomSheetEndedCardDetails
        ref={bottomSheetEndedCardDetailsRef}
        title={selectedCard?.title ?? ""}
        value={selectedCard?.value ?? 0}
        feedback={selectedCard?.feedback ?? ""}
        color={selectedCard?.color ?? "neutral"}
        onClose={() => bottomSheetEndedCardDetailsRef.current?.dismiss()}
      />
    </SafeAreaView>
  )
}

export default RoleplaySessionIdEnded

type Props = {
  title: string
  value: number
  feedback: string
  color: Color
  onClose: () => void
}

const BottomSheetEndedCardDetails = forwardRef<BottomSheetModal, Props>(({ title, value, feedback, color, onClose }, ref) => {
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
          <BottomSheet.HeaderTitle>{title}</BottomSheet.HeaderTitle>
        </BottomSheet.Header>
        <View className="flex flex-col gap-6 p-4">
          {/* Progress Bar */}
          <View className="relative flex h-4 w-full rounded-full bg-neutral-200">
            <View className={cn("h-full rounded-full", colorMap[color].bg)} style={{ width: `${value}%` }} />
            <Text className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-white">{value}/100</Text>
          </View>

          {/* Feedback */}
          <Text className="text-sm font-medium text-neutral-400">{feedback}</Text>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  )
})

BottomSheetEndedCardDetails.displayName = "BottomSheetEndedCardDetails"
