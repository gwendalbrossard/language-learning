import { z } from "zod/v4"

export const ZProfileRoleplayCategoryGetAllSchema = z.object({
  organizationId: z.string().min(1),
})
export type TProfileRoleplayCategoryGetAllSchema = z.infer<typeof ZProfileRoleplayCategoryGetAllSchema>
