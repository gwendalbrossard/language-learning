import { z } from "zod/v4"

import { LessonSessionVocabularyType } from "@acme/shared/db"

export const ZActionSchema = z.object({
  actionType: z
    .enum(["REPEAT", "ANSWER"])
    .describe("The primary action the AI is requesting from the user"),
  targetContent: z
    .string()
    .describe("The specific content the user should focus on (words/phrases to repeat, questions to answer, etc.)"),
  targetContentTranslated: z
    .string()
    .describe("The target content translated into the user's native language for better understanding"),
  targetContentRomanized: z
    .string()
    .nullable()
    .describe("The target content romanized for non-Roman scripts (e.g., Japanese, Russian, Korean, etc.)"),
  vocabularyType: z
    .enum(LessonSessionVocabularyType)
    .optional()
    .describe("For REPEAT actions only: the type of vocabulary content being taught (WORD, PHRASE, or EXPRESSION)"),
})

export type TActionSchema = z.infer<typeof ZActionSchema>
