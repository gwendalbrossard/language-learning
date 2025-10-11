import { z } from "zod/v4"

export const ZProfileUtilsGetPronunciationSchema = z.object({
  phrase: z.string().min(1),
  language: z.string().min(1), // BCP 47 language tag (ISO 639 + ISO 3166), e.g. "en-US", "es-MX", "ja-JP"
  organizationId: z.string().min(1),
})
export type TProfileUtilsGetPronunciationSchema = z.infer<typeof ZProfileUtilsGetPronunciationSchema>
