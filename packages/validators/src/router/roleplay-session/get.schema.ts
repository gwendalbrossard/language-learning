import { z } from "zod/v4"

export const ZRoleplaySessionGetSchema = z.object({
  roleplaySessionId: z.string().min(1),
})
export type TRoleplaySessionGetSchema = z.infer<typeof ZRoleplaySessionGetSchema>
