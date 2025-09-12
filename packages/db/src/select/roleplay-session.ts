import { Prisma } from "../../generated/client"
import { roleplayScenarioSelect } from "./roleplay-scenario"
import { roleplaySessionMessageSelect } from "./roleplay-session-message"

export const roleplaySessionSelect = Prisma.validator<Prisma.RoleplaySessionSelect>()({
  id: true,
  duration: true,
  userSpeakingDuration: true,
  aiSpeakingDuration: true,
  scenario: { select: roleplayScenarioSelect },
  messages: { select: roleplaySessionMessageSelect },
  createdAt: true,
  updatedAt: true,
})

export type RoleplaySessionSelected = Prisma.RoleplaySessionGetPayload<{ select: typeof roleplaySessionSelect }>
