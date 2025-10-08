import { z } from "zod/v4"

export const ZProfileUpdateStreakDaySchema = z.object({
  organizationId: z.string().min(1),
})
export type TProfileUpdateStreakDaySchema = z.infer<typeof ZProfileUpdateStreakDaySchema>
