import { addDays, differenceInCalendarDays, startOfDay } from "date-fns"
import { toZonedTime } from "date-fns-tz"

import { profileSelect } from "@acme/db"
import { ZProfileUpdateStreakDaySchema } from "@acme/validators"

import { organizationProcedure } from "../../trpc"

export const updateStreakDay = organizationProcedure.input(ZProfileUpdateStreakDaySchema).mutation(async ({ ctx }) => {
  // Get current time in profile's timezone
  const now = new Date()
  const profileLocalDate = toZonedTime(now, ctx.profile.timezone)
  const profileLocalDay = startOfDay(profileLocalDate)

  // Check if user has started a roleplay or lesson session today
  const todayStart = profileLocalDay
  const todayEnd = addDays(profileLocalDay, 1)

  const [roleplaySession, lessonSession] = await Promise.all([
    ctx.db.roleplaySession.findFirst({
      where: {
        profileId: ctx.profile.id,
        organizationId: ctx.organization.id,
        createdAt: {
          gte: todayStart,
          lt: todayEnd,
        },
      },
    }),
    ctx.db.lessonSession.findFirst({
      where: {
        profileId: ctx.profile.id,
        organizationId: ctx.organization.id,
        createdAt: {
          gte: todayStart,
          lt: todayEnd,
        },
      },
    }),
  ])

  if (!roleplaySession && !lessonSession) {
    return { showStreak: false }
  }

  // Create or update streak day for today
  const streakDay = await ctx.db.streakDay.upsert({
    where: {
      profileId_date_organizationId: {
        date: profileLocalDay,
        profileId: ctx.profile.id,
        organizationId: ctx.organization.id,
      },
    },
    create: {
      date: profileLocalDay,
      profileId: ctx.profile.id,
      organizationId: ctx.organization.id,
    },
    update: {}, // No updates needed if it exists
  })

  // If last streak day was today, no need to update streak count
  if (ctx.profile.lastStreakDay) {
    const lastStreakDate = toZonedTime(ctx.profile.lastStreakDay.date, ctx.profile.timezone)
    const lastStreakDay = startOfDay(lastStreakDate)

    if (profileLocalDay.getTime() === lastStreakDay.getTime()) {
      // Already recorded streak for today
      return { showStreak: false }
    }

    // Check if the last streak was yesterday or earlier
    const dayDifference = differenceInCalendarDays(profileLocalDay, lastStreakDay)

    if (dayDifference === 1) {
      // Last streak was yesterday, increase streak
      const newStreak = ctx.profile.currentStreak + 1
      await ctx.db.profile.update({
        where: { id: ctx.profile.id },
        data: {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, ctx.profile.longestStreak),
          lastStreakDayId: streakDay.id,
        },
        select: profileSelect,
      })

      return { showStreak: true }
    } else if (dayDifference > 1) {
      // Streak broken, reset to 1
      await ctx.db.profile.update({
        where: { id: ctx.profile.id },
        data: {
          currentStreak: 1,
          lastStreakDayId: streakDay.id,
        },
        select: profileSelect,
      })

      return { showStreak: true }
    }
  }

  // First streak ever, set streak to 1
  await ctx.db.profile.update({
    where: { id: ctx.profile.id },
    data: {
      currentStreak: 1,
      longestStreak: 1,
      lastStreakDayId: streakDay.id,
    },
    select: profileSelect,
  })

  return { showStreak: true }
})
