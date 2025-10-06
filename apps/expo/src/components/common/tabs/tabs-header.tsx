import type { BottomSheetModal } from "@gorhom/bottom-sheet"
import type { FC } from "react"
import { useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { SettingsIcon } from "lucide-react-native"
import { Pressable, Text, View } from "react-native"

import { languageOptions } from "~/components/common/language"
import { trpc } from "~/utils/api"
import BottomSheetSettings from "../bottom-sheet-settings"
import BottomSheetStreak from "../bottom-sheet-streak"
import Flame from "../svg/flame"

const TabsHeader: FC = () => {
  const bottomSheetSettingsRef = useRef<BottomSheetModal>(null)
  const bottomSheetStreakRef = useRef<BottomSheetModal>(null)

  const profileMe = useQuery(trpc.profile.me.queryOptions())
  const profile = profileMe.data
  if (!profile) throw new Error("Profile not found")

  const findLanguageOption = (code: string) => {
    const languageOption = languageOptions.find((option) => option.code === code)
    if (!languageOption) throw new Error("Language option not found")
    return languageOption
  }

  const FlagIcon = () => {
    const languageOption = findLanguageOption(profile.learningLanguage)
    const Icon = languageOption.icon

    return (
      <View className="overflow-hidden rounded" style={{ boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.05)" }}>
        <Icon height={24} width={36} />
      </View>
    )
  }

  return (
    <>
      <View className="flex flex-col gap-4 border-b-2 border-neutral-200 px-4 pb-3 pt-1">
        {/* Language and streak counter */}
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center justify-start gap-6">
            <FlagIcon />

            <Pressable onPress={() => bottomSheetStreakRef.current?.present()} className="flex flex-row items-center gap-1 rounded-md">
              <Flame width={28} height={28} />
              <Text className="text-base font-bold text-neutral-400">{profile.currentStreak}</Text>
            </Pressable>
          </View>
          <View className="flex flex-row items-center justify-end gap-3">
            {/* <Pressable onPress={() => console.log("history")} className="relative">
            <HistoryIcon size={24} className="text-neutral-500" />
          </Pressable> */}

            <Pressable onPress={() => bottomSheetSettingsRef.current?.present()} className="relative">
              <SettingsIcon size={28} strokeWidth={2} className="text-neutral-400" />
            </Pressable>
          </View>
        </View>
      </View>

      <BottomSheetSettings ref={bottomSheetSettingsRef} />
      <BottomSheetStreak ref={bottomSheetStreakRef} />
    </>
  )
}

export default TabsHeader
