import { z } from "zod"

export const ZProfileStreakDaysSchema = z.object({
  organizationId: z.string().min(1),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
})

export type TProfileStreakDaysSchema = z.infer<typeof ZProfileStreakDaysSchema>
