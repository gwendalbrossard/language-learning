import { z } from "zod/v4"

export const ZProfileRoleplaySessionGetResponseSuggestionsSchema = z.object({
  roleplaySessionId: z.string().min(1),
  organizationId: z.string().min(1),
})
export type TProfileRoleplaySessionGetResponseSuggestionsSchema = z.infer<typeof ZProfileRoleplaySessionGetResponseSuggestionsSchema>
