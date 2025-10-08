import type { TRPCRouterRecord } from "@trpc/server"

import { create } from "./create.route"
import { lessonCategoryRouter } from "./lesson-category/_router"
import { lessonSessionRouter } from "./lesson-session/_router"
import { lessonRouter } from "./lesson/_router"
import { me } from "./me.route"
import { onboard } from "./onboard.route"
import { roleplayCategoryRouter } from "./roleplay-category/_router"
import { roleplaySessionRouter } from "./roleplay-session/_router"
import { roleplayRouter } from "./roleplay/_router"
import { streakDays } from "./streak-days.route"
import { updateStreakDay } from "./update-streak-day"

export const profileRouter = {
  create: create,
  lesson: lessonRouter,
  lessonCategory: lessonCategoryRouter,
  lessonSession: lessonSessionRouter,
  me: me,
  onboard: onboard,
  streakDays: streakDays,
  roleplay: roleplayRouter,
  roleplayCategory: roleplayCategoryRouter,
  roleplaySession: roleplaySessionRouter,
  updateStreakDay: updateStreakDay,
} satisfies TRPCRouterRecord
