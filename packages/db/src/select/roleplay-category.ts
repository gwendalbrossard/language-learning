import { Prisma } from "../../generated/client"

export const roleplayCategorySelect = Prisma.validator<Prisma.RoleplayCategorySelect>()({
  id: true,
  emoji: true,
  name: true,

  profileId: true,
  organizationId: true,

  createdAt: true,
  updatedAt: true,
})

export type RoleplayCategorySelected = Prisma.RoleplayCategoryGetPayload<{ select: typeof roleplayCategorySelect }>
