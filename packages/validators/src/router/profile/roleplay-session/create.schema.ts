import { z } from "zod/v4"

export const ZProfileRoleplaySessionCreateSchema = z.object({
  roleplayId: z.string().min(1),
  organizationId: z.string().min(1),
})
export type TProfileRoleplaySessionCreateSchema = z.infer<typeof ZProfileRoleplaySessionCreateSchema>
