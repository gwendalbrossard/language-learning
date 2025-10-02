import { z } from "zod/v4"

export const ZFeedbackSchema = z.object({
  isCorrect: z.boolean().describe("Whether the message is correct and needs no corrections"),
  feedback: z
    .string()
    .describe("Concise, friendly feedback (maximum 2-3 sentences) combining main message and key insights in the user's native language")
    .nullable(),
  correctedPhrase: z.string().describe("The fully corrected version of the user's message").nullable(),
})

export type TFeedbackSchema = z.infer<typeof ZFeedbackSchema>
