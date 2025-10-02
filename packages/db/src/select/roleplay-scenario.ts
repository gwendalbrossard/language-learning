import { Prisma } from "../../generated/client"
import { roleplayCategorySelect } from "./roleplay-category"

export const roleplaySelect = Prisma.validator<Prisma.RoleplaySelect>()({
  id: true,
  emoji: true,
  title: true,
  assistantRole: true,
  userRole: true,
  description: true,
  isPublic: true,

  difficulty: true,

  category: { select: roleplayCategorySelect },

  profileId: true,
  organizationId: true,

  createdAt: true,
  updatedAt: true,
})

export type RoleplaySelected = Prisma.RoleplayGetPayload<{ select: typeof roleplaySelect }>
