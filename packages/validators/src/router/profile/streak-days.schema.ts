import { z } from "zod"

export const ZProfileStreakDaysSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
})

export type TProfileStreakDaysSchema = z.infer<typeof ZProfileStreakDaysSchema>
