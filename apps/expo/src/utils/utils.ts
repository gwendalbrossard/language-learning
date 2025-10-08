import type { ClassValue } from "clsx"
import type { LucideIcon } from "lucide-react-native"
import type { PressableStateCallbackType } from "react-native"
import type { SvgProps } from "react-native-svg"
import { clsx } from "clsx"
import * as LucideIcons from "lucide-react-native"
import { cssInterop } from "nativewind"
import { twMerge } from "tailwind-merge"

import { queryClient, trpc } from "./api"
import { useUserStore } from "./zustand/user-store"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isTextChildren(children: React.ReactNode | ((state: PressableStateCallbackType) => React.ReactNode)) {
  return Array.isArray(children) ? children.every((child) => typeof child === "string") : typeof children === "string"
}

export const interopIcon = (icon: LucideIcon | React.FC<SvgProps>) => {
  cssInterop(icon, {
    className: {
      target: "style",
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
  })
}

export const interopAllLucideIcons = () => {
  Object.values(LucideIcons).forEach((icon) => {
    if ("displayName" in icon) {
      interopIcon(icon as LucideIcon)
    }
  })
}

export const prefetchMain = async () => {
  const updateCurrentOrganizationId = useUserStore.getState().updateCurrentOrganizationId

  const [_profileMe, organizationMe] = await Promise.all([
    queryClient.fetchQuery(trpc.profile.me.queryOptions()),
    queryClient.fetchQuery(trpc.organization.me.queryOptions()),
  ])

  if (!organizationMe[0]) throw new Error("No organization found")
  const currentOrganizationId = organizationMe[0].id
  updateCurrentOrganizationId(currentOrganizationId)

  const [_streakDays, _roleplays, _roleplayCategories, _lessons, _lessonCategories] = await Promise.all([
    queryClient.fetchQuery(trpc.profile.streakDays.queryOptions({ startDate: undefined, endDate: undefined, organizationId: currentOrganizationId })),
    queryClient.fetchQuery(trpc.profile.roleplay.getAll.queryOptions({ organizationId: currentOrganizationId })),
    queryClient.fetchQuery(trpc.profile.roleplayCategory.getAll.queryOptions({ organizationId: currentOrganizationId })),
    queryClient.fetchQuery(trpc.profile.lesson.getAll.queryOptions({ organizationId: currentOrganizationId })),
    queryClient.fetchQuery(trpc.profile.lessonCategory.getAll.queryOptions({ organizationId: currentOrganizationId })),
  ])
}
