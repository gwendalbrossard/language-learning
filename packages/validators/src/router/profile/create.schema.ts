import { z } from "zod/v4"

export const ZProfileCreateSchema = z.object({
  name: z.string().min(1),
  avatar: z.string().nullable(),
  organizationName: z.string().min(1),
  timezone: z.string().min(1),
})
export type TProfileCreateSchema = z.infer<typeof ZProfileCreateSchema>
