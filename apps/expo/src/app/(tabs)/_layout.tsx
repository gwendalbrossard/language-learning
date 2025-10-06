import type { BottomSheetModal } from "@gorhom/bottom-sheet"
import React, { useEffect, useRef } from "react"
import { Tabs } from "expo-router"
import { useQuery } from "@tanstack/react-query"
import { usePostHog } from "posthog-react-native"
import { Platform } from "react-native"
import Purchases, { LOG_LEVEL } from "react-native-purchases"

import BottomSheetPaywall from "~/components/common/bottom-sheet-paywall"
import Book from "~/components/common/svg/tabs/book"
import BookFilled from "~/components/common/svg/tabs/book-filled"
import Chart from "~/components/common/svg/tabs/chart"
import ChartFilled from "~/components/common/svg/tabs/chart-filled"
import GraduationCap from "~/components/common/svg/tabs/graduation-cap"
import GraduationCapFilled from "~/components/common/svg/tabs/graduation-cap-filled"
import Mask from "~/components/common/svg/tabs/mask"
import MaskFilled from "~/components/common/svg/tabs/mask-filled"
import { useRevenueCat } from "~/hooks/use-revenuecat"
import { trpc } from "~/utils/api"
import { publicApiKeys } from "~/utils/revenuecat"
import { useUserStore } from "~/utils/zustand/user-store"

export default function TabLayout() {
  const bottomSheetPaywallRef = useRef<BottomSheetModal>(null)

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
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: "#979FAD",
        tabBarActiveTintColor: "#485261",
        tabBarLabelStyle: { marginTop: 0 },
      }}
    >
      <Tabs.Screen
        name="lessons"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (focused ? <GraduationCapFilled width={28} height={28} /> : <GraduationCap width={28} height={28} />),
        }}
      />
      <Tabs.Screen
        name="roleplays"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (focused ? <MaskFilled width={28} height={28} /> : <Mask width={28} height={28} />),
        }}
      />

      <Tabs.Screen
        name="vocabulary"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (focused ? <BookFilled width={28} height={28} /> : <Book width={28} height={28} />),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (focused ? <ChartFilled width={28} height={28} /> : <Chart width={28} height={28} />),
        }}
      />

      <BottomSheetPaywall ref={bottomSheetPaywallRef} />
    </Tabs>
  )
}
