import type { FC } from "react"
import React, { useEffect } from "react"
import { useRouter } from "expo-router"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ActivityIndicator, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import Icon from "~/components/common/svg/icon"
import { trpc } from "~/utils/api"
import { prefetchMain } from "~/utils/utils"

const LoadingView: FC = () => (
  <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: "white" }}>
    <View className="flex-1 items-center justify-center gap-4">
      <Icon width={56} height={56} />
      <ActivityIndicator size="small" />
    </View>
  </SafeAreaView>
)

export default function Index() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const authMe = useQuery(trpc.auth.me.queryOptions())
  const canQuery = authMe.data !== undefined && authMe.data.user !== null && authMe.data.profile !== null
  const profileMe = useQuery(trpc.profile.me.queryOptions(undefined, { enabled: canQuery }))

  useEffect(() => {
    if (!authMe.data) return

    // User
    if (!authMe.data.user) {
      router.replace("/auth")
      return
    }

    if (!authMe.data.profile) {
      router.replace("/create-profile")
      return
    }

    if (!authMe.data.profile.completedOnboarding) {
      const redirectToOnboarding = async () => {
        await queryClient.fetchQuery(trpc.profile.me.queryOptions())
        router.replace("/onboarding")
      }
      void redirectToOnboarding()
      return
    }

    // The user has a profile and has completed onboarding
    const redirectToMain = async () => {
      await prefetchMain()
      router.replace("/(tabs)/lessons")
    }
    void redirectToMain()
  }, [authMe.data, router, queryClient])

  if (!authMe.data || !authMe.data.user || !authMe.data.profile || !profileMe.data) {
    return <LoadingView />
  }

  return <LoadingView />
}
