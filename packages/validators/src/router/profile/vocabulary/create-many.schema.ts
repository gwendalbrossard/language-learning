import { z } from "zod/v4"

import { VocabularyType } from "@acme/shared/db"

const ZVocabularySchema = z.object({
  type: z.enum(VocabularyType),
  text: z.string().min(1),
  romanization: z.string().min(1).nullable(),
  translation: z.string().min(1),
  learningLanguage: z.string().min(1),
})

export const ZProfileVocabularyCreateManySchema = z.object({
  vocabulary: z.array(ZVocabularySchema),
  organizationId: z.string().min(1),
})
export type TProfileVocabularyCreateManySchema = z.infer<typeof ZProfileVocabularyCreateManySchema>
