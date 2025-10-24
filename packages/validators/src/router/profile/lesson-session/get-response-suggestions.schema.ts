import { z } from "zod/v4"

export const ZProfileLessonSessionGetResponseSuggestionsSchema = z.object({
  lessonSessionId: z.string().min(1),
  organizationId: z.string().min(1),
})
export type TProfileLessonSessionGetResponseSuggestionsSchema = z.infer<typeof ZProfileLessonSessionGetResponseSuggestionsSchema>
