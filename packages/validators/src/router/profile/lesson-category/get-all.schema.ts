import { z } from "zod/v4"

export const ZProfileLessonCategoryGetAllSchema = z.object({
  organizationId: z.string().min(1),
})
export type TProfileLessonCategoryGetAllSchema = z.infer<typeof ZProfileLessonCategoryGetAllSchema>
