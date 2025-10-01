import { z } from "zod/v4"

export const ZProfileLessonCategoryCreateSchema = z.object({
  emoji: z.string().min(1),
  name: z.string().min(1),
  organizationId: z.string().min(1),
})
export type TProfileLessonCategoryCreateSchema = z.infer<typeof ZProfileLessonCategoryCreateSchema>
