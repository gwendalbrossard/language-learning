import { Prisma } from "../../generated/client"

export const streakDaySelect = Prisma.validator<Prisma.StreakDaySelect>()({
  id: true,
  date: true,
})

export type StreakDaySelected = Prisma.StreakDayGetPayload<{ select: typeof streakDaySelect }>
