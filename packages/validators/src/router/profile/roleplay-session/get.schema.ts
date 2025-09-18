import { z } from "zod/v4"

export const ZProfileRoleplaySessionGetSchema = z.object({
  roleplaySessionId: z.string().min(1),
})
export type TProfileRoleplaySessionGetSchema = z.infer<typeof ZProfileRoleplaySessionGetSchema>
