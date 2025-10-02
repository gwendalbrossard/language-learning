import { Prisma } from "../../generated/client"
import { roleplaySelect } from "./roleplay-scenario"
import { roleplaySessionMessageSelect } from "./roleplay-session-message"

export const roleplaySessionSelect = Prisma.validator<Prisma.RoleplaySessionSelect>()({
  id: true,
  duration: true,
  userSpeakingDuration: true,
  aiSpeakingDuration: true,
  roleplay: { select: roleplaySelect },
  messages: { select: roleplaySessionMessageSelect },
  createdAt: true,
  updatedAt: true,
})

export type RoleplaySessionSelected = Prisma.RoleplaySessionGetPayload<{ select: typeof roleplaySessionSelect }>
