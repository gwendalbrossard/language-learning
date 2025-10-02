import { z } from "zod/v4"

export const ZPracticeSchema = z.union([
  z.object({
    roleplaySessionId: z.string().min(1),
  }),
  z.object({
    lessonSessionId: z.string().min(1),
  }),
])

export type TPracticeSchema = z.infer<typeof ZPracticeSchema>
