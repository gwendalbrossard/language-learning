import { eachDayOfInterval, endOfWeek, startOfDay, startOfWeek } from "date-fns"
import { toZonedTime } from "date-fns-tz"

export enum DayStatus {
  COMPLETED = "COMPLETED",
  UPCOMING = "UPCOMING",
  MISSED = "MISSED",
  PENDING = "PENDING",
}

export type CurrentWeekProgress = {
  weekDays: Date[]
  daysLabels: string[]
  weekProgress: DayStatus[]
}

export const calculateCurrentWeekProgress = (streakDays: { date: Date }[], timezone: string, now: Date = new Date()): CurrentWeekProgress => {
  // Get current week's days (Sunday to Saturday)
  const profileLocalDate = toZonedTime(now, timezone)
  const weekStart = startOfWeek(profileLocalDate, { weekStartsOn: 1 }) // 1 = Monday
  const weekEnd = endOfWeek(profileLocalDate, { weekStartsOn: 1 })

  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Create a map of dates to streak entries
  const streakMap = new Map(streakDays.map((streak) => [startOfDay(toZonedTime(streak.date, timezone)).toISOString(), true]))

  // Calculate week progress
  const weekProgress = weekDays.map((day) => {
    const dayStart = startOfDay(day)
    const hasStreak = streakMap.has(dayStart.toISOString())
    const isCurrentDay = startOfDay(day).getTime() === startOfDay(profileLocalDate).getTime()

    if (hasStreak) return DayStatus.COMPLETED
    if (day > profileLocalDate) return DayStatus.UPCOMING
    if (day < profileLocalDate && !isCurrentDay) return DayStatus.MISSED

    // Current day is pending by default unless completed
    return DayStatus.PENDING
  })

  return {
    weekDays,
    daysLabels: weekDays.map((day) => day.toLocaleDateString("en-US", { weekday: "short" }).substring(0, 3)),
    weekProgress,
  }
}
