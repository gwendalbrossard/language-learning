import { z } from "zod/v4"

export const ZProfileLessonGetAllSchema = z.object({
  organizationId: z.string().min(1),
})
export type TProfileLessonGetAllSchema = z.infer<typeof ZProfileLessonGetAllSchema>
