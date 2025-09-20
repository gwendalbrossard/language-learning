import type { FC } from "react"
import React, { useEffect } from "react"
import { useRouter } from "expo-router"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ActivityIndicator, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import type { RouterOutputs } from "~/utils/api"
import Icon from "~/components/common/svg/icon"
import { trpc } from "~/utils/api"
import { prefetchMain } from "~/utils/utils"
import { useUserStore } from "~/utils/zustand/user-store"

const LoadingView: FC = () => (
  <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: "white" }}>
    <View className="flex-1 items-center justify-center gap-4">
      <Icon width={56} height={56} />
      <ActivityIndicator size="small" />
    </View>
  </SafeAreaView>
)

export default function Index() {
  const updateCurrentOrganizationId = useUserStore((state) => state.updateCurrentOrganizationId)
  const queryClient = useQueryClient()

  const router = useRouter()

  const authMe = useQuery(trpc.auth.me.queryOptions())

  const canQuery = authMe.data !== undefined && authMe.data.user !== null && authMe.data.profile !== null

  const profileMe = useQuery(trpc.profile.me.queryOptions(undefined, { enabled: canQuery }))
  const organizationMe = useQuery(trpc.organization.me.queryOptions(undefined, { enabled: canQuery }))

  useEffect(() => {
    if (authMe.isLoading || !authMe.data) return

    // User
    if (!authMe.data.user) {
      router.replace("/landing")
      return
    }

    if (!authMe.data.profile) {
      router.replace("/create-profile")
      return
    }

    // Organization
    if (organizationMe.isLoading || !organizationMe.data) return

    // At this point, the user has a profile, so they must have an organization.
    if (!organizationMe.data[0]) {
      throw new Error("No organization found. Please contact support.")
    }

    updateCurrentOrganizationId(organizationMe.data[0].id)

    if (!authMe.data.profile.completedOnboarding) {
      const redirectToOnboarding = async () => {
        await Promise.all([queryClient.prefetchQuery(trpc.profile.me.queryOptions()), queryClient.prefetchQuery(trpc.organization.me.queryOptions())])
        router.push("/onboarding")
      }
      void redirectToOnboarding()
      return
    }

    // The user has a profile and has completed onboarding
    const redirectToMain = async () => {
      await prefetchMain()
      router.replace("/main")
    }
    void redirectToMain()
  }, [authMe, router, authMe.data, queryClient, organizationMe, organizationMe.data, updateCurrentOrganizationId])

  if (!authMe.data || !authMe.data.user || !authMe.data.profile || !profileMe.data || !organizationMe.data || !organizationMe.data[0]) {
    return <LoadingView />
  }

  const _currentOrganization: RouterOutputs["organization"]["me"][number] = organizationMe.data[0]

  return <LoadingView />
}
