import { Prisma } from "../../generated/client"

export const profileSelect = Prisma.validator<Prisma.ProfileSelect>()({
  id: true,
  email: true,
  avatar: true,
  name: true,
  timezone: true,
  completedOnboarding: true,
})

export type ProfileSelected = Prisma.ProfileGetPayload<{ select: typeof profileSelect }>
