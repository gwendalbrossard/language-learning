import { z } from "zod/v4"

export const ZRoleplaySessionGetFeedbackSchema = z.object({
  fillerWords: z.object({
    score: z.number().int().min(1).max(100).describe("Score from 1-100 for filler word usage (100 = minimal/appropriate filler words)"),
    feedback: z.string().max(150).describe("High-level feedback on speech flow patterns (max 2 short sentences, no specific quotes)"),
  }),
  vocabulary: z.object({
    score: z.number().int().min(1).max(100).describe("Score from 1-100 for vocabulary usage (100 = excellent vocabulary range and accuracy)"),
    feedback: z.string().max(150).describe("High-level feedback on vocabulary strengths and areas to expand (max 2 short sentences, no specific quotes)"),
  }),
  grammar: z.object({
    score: z.number().int().min(1).max(100).describe("Score from 1-100 for grammar accuracy (100 = perfect grammar)"),
    feedback: z.string().max(150).describe("High-level feedback on grammar patterns observed (max 2 short sentences, no specific quotes)"),
  }),
  fluency: z.object({
    score: z.number().int().min(1).max(100).describe("Score from 1-100 for fluency (100 = very fluent speech)"),
    feedback: z.string().max(150).describe("High-level feedback on overall speaking rhythm (max 2 short sentences, no specific quotes)"),
  }),
  interaction: z.object({
    score: z.number().int().min(1).max(100).describe("Score from 1-100 for interaction quality (100 = natural, engaging conversation)"),
    feedback: z.string().max(150).describe("High-level feedback on conversation dynamics (max 2 short sentences, no specific quotes)"),
  }),
  overallScore: z.number().int().min(1).max(100).describe("Overall performance score from 1-100"),
  summary: z.string().max(200).describe("Concise overview of performance highlighting main strength and growth area (max 2 short sentences, no specific examples)"),
})

export type TRoleplaySessionGetFeedbackSchema = z.infer<typeof ZRoleplaySessionGetFeedbackSchema>
