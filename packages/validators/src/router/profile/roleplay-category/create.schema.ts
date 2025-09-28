import { z } from "zod/v4"

export const ZProfileRoleplayCategoryCreateSchema = z.object({
  emoji: z.string().min(1),
  name: z.string().min(1),
  organizationId: z.string().min(1),
})
export type TProfileRoleplayCategoryCreateSchema = z.infer<typeof ZProfileRoleplayCategoryCreateSchema>
