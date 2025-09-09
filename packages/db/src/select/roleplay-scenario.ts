import { Prisma } from "../../generated/client"

export const roleplayScenarioSelect = Prisma.validator<Prisma.RoleplayScenarioSelect>()({
  id: true,
  emoji: true,
  title: true,
  description: true,
  tags: true,
  createdAt: true,
  updatedAt: true,
})

export type RoleplayScenarioSelected = Prisma.RoleplayScenarioGetPayload<{ select: typeof roleplayScenarioSelect }>
