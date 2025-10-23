import { z } from "zod/v4"

export const ZProfileLessonSessionVocabularyCreateManySchema = z.object({
  vocabulary: z.array(z.string().min(1)),
  lessonSessionId: z.string().min(1),
  organizationId: z.string().min(1),
})
export type TProfileLessonSessionVocabularyCreateManySchema = z.infer<typeof ZProfileLessonSessionVocabularyCreateManySchema>
