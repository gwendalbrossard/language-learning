"use client"

import type { FC } from "react"
import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

import type { RouterOutputs } from "@acme/api"

import Loader from "~/components/loader"
import { useTRPC } from "~/trpc/react"
import { DashboardProvider } from "~/utils/zustand/dashboard-store"
import CreateOrganizationDialog from "./_layout/sidebar/create-organization-dialog"
import { SidebarDesktop, SidebarMobile, SidebarProvider } from "./_layout/sidebar/sidebar"

type Props = {
  children: React.ReactNode
}
const DashboardLayout: FC<Props> = ({ children }) => {
  const router = useRouter()

  const trpc = useTRPC()
  const authMe = useQuery(trpc.auth.me.queryOptions())

  const canQuery = authMe.data !== undefined && authMe.data.user !== null && authMe.data.profile !== null

  const profileMe = useQuery(trpc.profile.me.queryOptions(undefined, { enabled: canQuery }))
  const organizationMe = useQuery(trpc.organization.me.queryOptions(undefined, { enabled: canQuery }))

  useEffect(() => {
    if (authMe.isLoading || !authMe.data) return

    if (!authMe.data.user) {
      router.push("/signin")
      return
    }

    if (!authMe.data.profile) {
      router.push("/welcome")
      return
    }

    // The user has a profile
  }, [authMe, router, authMe.data])

  if (!authMe.data || !authMe.data.user || !authMe.data.profile || !profileMe.data || !organizationMe.data || !organizationMe.data[0]) {
    return <Loader />
  }

  const currentOrganization: RouterOutputs["organization"]["me"][number] = organizationMe.data[0]

  return (
    <div className="relative flex h-dvh max-h-dvh flex-col sm:flex-row">
      <DashboardProvider currentOrganizationId={currentOrganization.id} organizations={organizationMe.data}>
        <SidebarProvider profile={profileMe.data} organizations={organizationMe.data}>
          <SidebarDesktop />
          <SidebarMobile />
          <CreateOrganizationDialog />
        </SidebarProvider>

        <div className="h-full w-full overflow-y-auto">{children}</div>
      </DashboardProvider>
    </div>
  )
}

export default DashboardLayout
