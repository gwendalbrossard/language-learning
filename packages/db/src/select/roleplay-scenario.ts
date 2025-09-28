import { Prisma } from "../../generated/client"
import { roleplayCategorySelect } from "./category"

export const roleplayScenarioSelect = Prisma.validator<Prisma.RoleplayScenarioSelect>()({
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

  createdAt: true,
  updatedAt: true,
})

export type RoleplayScenarioSelected = Prisma.RoleplayScenarioGetPayload<{ select: typeof roleplayScenarioSelect }>
