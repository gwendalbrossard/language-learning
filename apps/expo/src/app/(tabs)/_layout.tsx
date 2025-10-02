import type { BottomSheetModal } from "@gorhom/bottom-sheet"
import { useEffect, useRef } from "react"
import { Tabs } from "expo-router"
import { useQuery } from "@tanstack/react-query"
import { BookIcon, ChartNoAxesColumnIncreasingIcon, DramaIcon, GraduationCapIcon } from "lucide-react-native"
import { usePostHog } from "posthog-react-native"
import { Platform } from "react-native"
import Purchases, { LOG_LEVEL } from "react-native-purchases"

import BottomSheetPaywall from "~/components/common/bottom-sheet-paywall"
import BottomSheetStreak from "~/components/common/bottom-sheet-streak"
import BottomSheetSettings from "~/components/routes/main/bottom-sheet-settings"
import { useRevenueCat } from "~/hooks/use-revenuecat"
import { trpc } from "~/utils/api"
import { publicApiKeys } from "~/utils/revenuecat"
import { useBottomSheetsStore } from "~/utils/zustand/bottom-sheets-store"
import { useUserStore } from "~/utils/zustand/user-store"

export default function TabLayout() {
  const bottomSheetSettingsRef = useRef<BottomSheetModal>(null)
  const bottomSheetPaywallRef = useRef<BottomSheetModal>(null)
  const bottomSheetStreakRef = useBottomSheetsStore((state) => state.bottomSheetStreakRef)

  const profileMe = useQuery(trpc.profile.me.queryOptions())
  const profile = profileMe.data
  if (!profile) throw new Error("Profile not found")

  const { hasShownPaywall, updateHasShownPaywall } = useUserStore()
  const { entitlement } = useRevenueCat()
  const posthog = usePostHog()

  useEffect(() => {
    posthog.identify(profile.id, {
      email: profile.email,
    })
  }, [profile, posthog])

  useEffect(() => {
    const setup = async () => {
      if (Platform.OS == "android") {
        Purchases.configure({ apiKey: publicApiKeys.google, appUserID: profile.id })
      } else {
        Purchases.configure({ apiKey: publicApiKeys.apple, appUserID: profile.id })
      }

      await Purchases.setLogLevel(LOG_LEVEL.VERBOSE)
    }

    setup().catch(console.log)
  }, [profile.id])

  useEffect(() => {
    const setup = () => {
      if (entitlement.loaded) {
        if (!entitlement.isUnlimited && !hasShownPaywall) {
          updateHasShownPaywall(true)
          bottomSheetPaywallRef.current?.present()
        }
      }
    }

    setup()
  }, [entitlement, hasShownPaywall, updateHasShownPaywall])

  return (
    <Tabs
      screenOptions={{ headerShown: false, tabBarInactiveTintColor: "#979FAD", tabBarActiveTintColor: "#485261", tabBarLabelStyle: { marginTop: 6 } }}
    >
      <Tabs.Screen
        name="lessons"
        options={{
          title: "Lessons",
          tabBarIcon: ({ color }) => <GraduationCapIcon size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="roleplays"
        options={{
          title: "Roleplays",
          tabBarIcon: ({ color }) => <DramaIcon size={28} color={color} />,
        }}
      />

      <Tabs.Screen
        name="vocabulary"
        options={{
          title: "Vocabulary",
          tabBarIcon: ({ color }) => <BookIcon size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ color }) => <ChartNoAxesColumnIncreasingIcon size={28} color={color} />,
        }}
      />

      <BottomSheetSettings ref={bottomSheetSettingsRef} />
      <BottomSheetPaywall ref={bottomSheetPaywallRef} />
      <BottomSheetStreak ref={bottomSheetStreakRef} />
    </Tabs>
  )
}
