import type { BottomSheetModal } from "@gorhom/bottom-sheet"
import React, { useRef } from "react"
import { Stack } from "expo-router"

import BottomSheetStreak from "~/components/common/bottom-sheet-streak"
import { usePushNotifications } from "~/hooks/use-push-notifications"
import { useBottomSheetsStore } from "~/utils/zustand/bottom-sheets-store"

export default function Layout() {
  const _pushNotifications = usePushNotifications()

  const bottomSheetStreakRef = useRef<BottomSheetModal>(null)

  const setBottomSheetStreakRef = useBottomSheetsStore((state) => state.setBottomSheetStreakRef)

  // Set the ref in the store when the component mounts
  setBottomSheetStreakRef(bottomSheetStreakRef)
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: true,
          animation: "default",
        }}
      />
      <BottomSheetStreak ref={bottomSheetStreakRef} />
    </>
  )
}
