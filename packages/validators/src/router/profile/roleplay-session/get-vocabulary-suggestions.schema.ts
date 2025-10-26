import { z } from "zod/v4"

export const ZProfileRoleplaySessionGetVocabularySuggestionsSchema = z.object({
  roleplaySessionId: z.string().min(1),
  organizationId: z.string().min(1),
})
export type TProfileRoleplaySessionGetVocabularySuggestionsSchema = z.infer<typeof ZProfileRoleplaySessionGetVocabularySuggestionsSchema>
