import type { BottomSheetModal } from "@gorhom/bottom-sheet"
import type { FC } from "react"
import React, { useEffect, useRef } from "react"
import { Tabs } from "expo-router"
import { useQuery } from "@tanstack/react-query"
import { usePostHog } from "posthog-react-native"
import { Platform, View } from "react-native"
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
import { cn } from "~/utils/utils"
import { useUserStore } from "~/utils/zustand/user-store"

type ItemContainerProps = {
  children: React.ReactNode
  focused: boolean
}
const ItemContainer: FC<ItemContainerProps> = ({ children, focused }) => {
  return (
    <View className="pb-2">
      <View
        className={cn(
          "flex size-11 items-center justify-center rounded-[10px] border-2 border-transparent bg-white",
          focused && "border-primary-200 bg-primary-50",
        )}
      >
        {children}
      </View>
    </View>
  )
}

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
        tabBarStyle: {
          borderTopColor: "#DFE3EB",
          borderTopWidth: 2,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          height: 84,
        },
      }}
    >
      <Tabs.Screen
        name="lessons"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <ItemContainer focused={focused}>
              {focused ? <GraduationCapFilled width={32} height={32} /> : <GraduationCap width={32} height={32} />}
            </ItemContainer>
          ),
        }}
      />
      <Tabs.Screen
        name="roleplays"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <ItemContainer focused={focused}>{focused ? <MaskFilled width={32} height={32} /> : <Mask width={32} height={32} />}</ItemContainer>
          ),
        }}
      />

      <Tabs.Screen
        name="vocabulary"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <ItemContainer focused={focused}>{focused ? <BookFilled width={32} height={32} /> : <Book width={32} height={32} />}</ItemContainer>
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <ItemContainer focused={focused}>{focused ? <ChartFilled width={32} height={32} /> : <Chart width={32} height={32} />}</ItemContainer>
          ),
        }}
      />

      <BottomSheetPaywall ref={bottomSheetPaywallRef} />
    </Tabs>
  )
}
