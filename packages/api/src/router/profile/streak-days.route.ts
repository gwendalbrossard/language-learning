import { startOfDay } from "date-fns"
import { toZonedTime } from "date-fns-tz"

import { ZProfileStreakDaysSchema } from "@acme/validators"

import { organizationProcedure } from "../../trpc"

export const streakDays = organizationProcedure.input(ZProfileStreakDaysSchema).query(async ({ ctx, input }) => {
  const { startDate: inputStartDate = ctx.profile.createdAt, endDate: inputEndDate } = input

  // Build date filter conditionally
  const dateFilter: { gte: Date; lte?: Date } = {
    gte: startOfDay(toZonedTime(inputStartDate, ctx.profile.timezone)),
  }

  if (inputEndDate) {
    dateFilter.lte = startOfDay(toZonedTime(inputEndDate, ctx.profile.timezone))
  }

  // Fetch streak entries
  const streaks = await ctx.db.streakDay.findMany({
    where: {
      date: dateFilter,
      profileId: ctx.profile.id,
      organizationId: ctx.organization.id,
    },
    orderBy: {
      date: "desc",
    },
  })

  return streaks
})
