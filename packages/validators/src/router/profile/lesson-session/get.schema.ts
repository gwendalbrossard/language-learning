import { z } from "zod/v4"

export const ZProfileLessonSessionGetSchema = z.object({
  lessonSessionId: z.string().min(1),
  organizationId: z.string().min(1),
})
export type TProfileLessonSessionGetSchema = z.infer<typeof ZProfileLessonSessionGetSchema>
