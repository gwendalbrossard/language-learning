import { startOfDay } from "date-fns"
import { toZonedTime } from "date-fns-tz"

import { ZProfileStreakDaysSchema } from "@acme/validators"

import { profileProcedure } from "../../trpc"

export const streakDays = profileProcedure.input(ZProfileStreakDaysSchema).query(async ({ ctx, input }) => {
  const { profile, db } = ctx
  const { startDate: inputStartDate = profile.createdAt, endDate: inputEndDate } = input

  // Build date filter conditionally
  const dateFilter: { gte: Date; lte?: Date } = {
    gte: startOfDay(toZonedTime(inputStartDate, profile.timezone)),
  }

  if (inputEndDate) {
    dateFilter.lte = startOfDay(toZonedTime(inputEndDate, profile.timezone))
  }

  // Fetch streak entries
  const streaks = await db.streakDay.findMany({
    where: {
      profileId: profile.id,
      date: dateFilter,
    },
    orderBy: {
      date: "desc",
    },
  })

  return streaks
})
