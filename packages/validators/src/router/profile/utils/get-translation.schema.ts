import { z } from "zod/v4"

export const ZProfileUtilsGetTranslationSchema = z.object({
  phrase: z.string().min(1),
  sourceLanguage: z.string().min(1), // BCP 47 language tag (ISO 639 + ISO 3166), e.g. "en-US", "es-MX", "ja-JP"
  targetLanguage: z.string().min(1), // BCP 47 language tag (ISO 639 + ISO 3166), e.g. "en-US", "es-MX", "ja-JP"
  organizationId: z.string().min(1),
})
export type TProfileUtilsGetTranslationSchema = z.infer<typeof ZProfileUtilsGetTranslationSchema>

export const ZProfileUtilsGetTranslationResponseSchema = z.object({
  translation: z.string().min(1),
  translationRomanized: z.string().nullable(),
})
export type TProfileUtilsGetTranslationResponseSchema = z.infer<typeof ZProfileUtilsGetTranslationResponseSchema>
