import { z } from "zod/v4"

export const ZLanguageAnalysisSchema = z.object({
  quality: z.number().min(1).max(100).describe("Overall correctness score from 1-100"),
  feedback: z
    .string()
    .describe("Concise, friendly feedback (maximum 2-3 sentences) combining main message and key insights in the user's native language"),
  correctedPhrase: z.string().describe("The fully corrected version of the user's message"),
  corrections: z
    .array(
      z.object({
        wrong: z.string().describe("The incorrect part from the original message"),
        correct: z.string().describe("The corrected version of that part, extracted from the correctedPhrase"),
        explanation: z.string().describe("Short explanation for the correction"),
      }),
    )
    .describe("Array of wrong/correct pairs for highlighting corrections on the frontend"),

  accuracy: z.object({
    score: z.number().min(1).max(100),
    message: z.string().describe("Helpful, supportive feedback about grammar and accuracy issues in the user's native language"),
  }),
  fluency: z.object({
    score: z.number().min(1).max(100),
    message: z.string().describe("Friendly feedback about naturalness and fluency in the user's native language"),
  }),
  vocabulary: z.object({
    score: z.number().min(1).max(100),
    message: z.string().describe("Supportive feedback about vocabulary choices and usage in the user's native language"),
  }),
})

export type TLanguageAnalysisSchema = z.infer<typeof ZLanguageAnalysisSchema>
