import type { TRPCRouterRecord } from "@trpc/server"

import { create } from "./create.route"
import { me } from "./me.route"
import { onboard } from "./onboard.route"
import { roleplayCategoryRouter } from "./roleplay-category/_router"
import { roleplayScenarioRouter } from "./roleplay-scenario/_router"
import { roleplaySessionRouter } from "./roleplay-session/_router"
import { streakDays } from "./streak-days.route"

export const profileRouter = {
  create: create,
  me: me,
  onboard: onboard,
  streakDays: streakDays,
  roleplayCategory: roleplayCategoryRouter,
  roleplayScenario: roleplayScenarioRouter,
  roleplaySession: roleplaySessionRouter,
} satisfies TRPCRouterRecord
