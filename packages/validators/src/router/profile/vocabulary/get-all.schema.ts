import { z } from "zod/v4"

export const ZProfileVocabularyGetAllSchema = z.object({ organizationId: z.string().min(1) })
export type TProfileVocabularyGetAllSchema = z.infer<typeof ZProfileVocabularyGetAllSchema>
