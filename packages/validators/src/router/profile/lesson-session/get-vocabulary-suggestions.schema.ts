import { z } from "zod/v4"

export const ZProfileLessonSessionGetVocabularySuggestionsSchema = z.object({
  lessonSessionId: z.string().min(1),
  organizationId: z.string().min(1),
})
export type TProfileLessonSessionGetVocabularySuggestionsSchema = z.infer<typeof ZProfileLessonSessionGetVocabularySuggestionsSchema>
