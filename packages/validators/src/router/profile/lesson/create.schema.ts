import { z } from "zod/v4"

export const ZProfileLessonCreateSchema = z.object({
  description: z.string().min(1),
  difficulty: z.number().min(1).max(3),
  organizationId: z.string().min(1),
})
export type TProfileLessonCreateSchema = z.infer<typeof ZProfileLessonCreateSchema>
