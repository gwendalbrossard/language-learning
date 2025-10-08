import { z } from "zod/v4"

export const ZProfileUpdateStreakDayCreateSchema = z.object({
  organizationId: z.string().min(1),
})
export type TProfileUpdateStreakDayCreateSchema = z.infer<typeof ZProfileUpdateStreakDayCreateSchema>
