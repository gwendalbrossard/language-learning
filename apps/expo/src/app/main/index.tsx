import type { BottomSheetModal } from "@gorhom/bottom-sheet"
import type { FC } from "react"
import { useEffect, useRef } from "react"
import { Stack } from "expo-router"
import { useQuery } from "@tanstack/react-query"
import { CalendarIcon, SettingsIcon } from "lucide-react-native"
import { usePostHog } from "posthog-react-native"
import { Platform, Pressable, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"
import Purchases, { LOG_LEVEL } from "react-native-purchases"
import { SafeAreaView } from "react-native-safe-area-context"

import BottomSheetPaywall from "~/components/common/bottom-sheet-paywall"
import BottomSheetStreak from "~/components/common/bottom-sheet-streak"
import { HeaderTitleLogo } from "~/components/common/stack-screen/header-title-logo"
import BottomSheetSettings from "~/components/routes/main/bottom-sheet-settings"
import RoleplayScenarios from "~/components/routes/main/roleplay-scenarios"
import Streak from "~/components/routes/main/streak"
import { useRevenueCat } from "~/hooks/use-revenuecat"
import { Text } from "~/ui/text"
import { trpc } from "~/utils/api"
import { publicApiKeys } from "~/utils/revenuecat"
import { useBottomSheetsStore } from "~/utils/zustand/bottom-sheets-store"
import { useUserStore } from "~/utils/zustand/user-store"

const Main: FC = () => {
  const bottomSheetSettingsRef = useRef<BottomSheetModal>(null)
  const bottomSheetPaywallRef = useRef<BottomSheetModal>(null)
  const bottomSheetStreakRef = useBottomSheetsStore((state) => state.bottomSheetStreakRef)
  const bottomSheetCalendarRef = useRef<BottomSheetModal>(null)

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
    <SafeAreaView edges={["bottom"]} style={{ flex: 1, padding: 16, backgroundColor: "white" }}>
      <Stack.Screen
        options={{
          title: "",
          headerShown: true,
          headerShadowVisible: false,
          headerLeft: () => <HeaderTitleLogo />,
          headerRight: () => (
            <View className="flex flex-row items-center justify-end gap-3">
              <Pressable
                onPress={() => bottomSheetStreakRef?.current?.present()}
                className="flex flex-row items-center gap-2 rounded-md border border-neutral-400 px-2 py-1"
              >
                <Text className="text-xs font-semibold text-neutral-500">🔥 {profile.currentStreak}</Text>
              </Pressable>
              <Pressable
                onPress={() => bottomSheetCalendarRef.current?.present()}
                className="flex flex-row items-center gap-2 rounded-md border border-neutral-400 px-2 py-1"
              >
                <CalendarIcon size={16} className="text-neutral-500" />
              </Pressable>
              <Pressable onPress={() => bottomSheetSettingsRef.current?.present()} className="relative">
                <SettingsIcon size={24} className="text-neutral-500" />
              </Pressable>
            </View>
          ),
        }}
      />

      <KeyboardAwareScrollView bottomOffset={16} enabled>
        <View className="flex flex-col gap-6">
          <Streak />
          <RoleplayScenarios />
        </View>
      </KeyboardAwareScrollView>

      <BottomSheetSettings ref={bottomSheetSettingsRef} />
      <BottomSheetPaywall ref={bottomSheetPaywallRef} />
      <BottomSheetStreak ref={bottomSheetStreakRef} />
    </SafeAreaView>
  )
}

export default Main
