import { z } from "zod/v4"

export const ZProfileLessonSessionCreateSchema = z.object({
  lessonId: z.string().min(1),
  organizationId: z.string().min(1),
})
export type TProfileLessonSessionCreateSchema = z.infer<typeof ZProfileLessonSessionCreateSchema>
