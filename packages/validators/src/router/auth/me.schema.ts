import { z } from "zod"

export const ZAuthMeSchema = z
  .object({
    name: z.string().optional(),
    timezone: z.string().optional(),
  })
  .optional()

export type TAuthMeSchema = z.infer<typeof ZAuthMeSchema>
