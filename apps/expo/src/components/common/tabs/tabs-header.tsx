import type { BottomSheetModal } from "@gorhom/bottom-sheet"
import type { FC } from "react"
import { useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { HistoryIcon, SettingsIcon } from "lucide-react-native"
import { Pressable, Text, View } from "react-native"

import { languageOptions } from "@acme/validators"

import BottomSheetSettings from "~/components/routes/main/bottom-sheet-settings"
import { trpc } from "~/utils/api"
import { useBottomSheetsStore } from "~/utils/zustand/bottom-sheets-store"
import BottomSheetStreak from "../bottom-sheet-streak"

const TabsHeader: FC = () => {
  const bottomSheetSettingsRef = useRef<BottomSheetModal>(null)
  const bottomSheetStreakRef = useBottomSheetsStore((state) => state.bottomSheetStreakRef)

  const profileMe = useQuery(trpc.profile.me.queryOptions())
  const profile = profileMe.data
  if (!profile) throw new Error("Profile not found")

  const findLanguageOption = (code: string) => {
    const languageOption = languageOptions.find((option) => option.code === code)
    if (!languageOption) throw new Error("Language option not found")
    return languageOption
  }

  return (
    <>
      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-row items-center justify-start gap-3">
          <Text className="h-[28px] text-[28px] font-semibold text-neutral-500">{findLanguageOption(profile.learningLanguage).emoji}</Text>

          <Pressable
            onPress={() => bottomSheetStreakRef?.current?.present()}
            className="flex flex-row items-center gap-2 rounded-md border border-neutral-400 px-2 py-1"
          >
            <Text className="text-xs font-semibold text-neutral-500">🔥 {profile.currentStreak}</Text>
          </Pressable>
        </View>
        <View className="flex flex-row items-center justify-end gap-3">
          <Pressable onPress={() => console.log("history")} className="relative">
            <HistoryIcon size={24} className="text-neutral-500" />
          </Pressable>

          <Pressable onPress={() => bottomSheetSettingsRef.current?.present()} className="relative">
            <SettingsIcon size={24} className="text-neutral-500" />
          </Pressable>
        </View>
      </View>
      <BottomSheetSettings ref={bottomSheetSettingsRef} />
      <BottomSheetStreak ref={bottomSheetStreakRef} />
    </>
  )
}

export default TabsHeader
