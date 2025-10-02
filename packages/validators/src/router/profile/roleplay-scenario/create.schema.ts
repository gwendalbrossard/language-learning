import { z } from "zod/v4"

export const ZProfileRoleplayCreateSchema = z.object({
  assistantRole: z.string().min(1),
  userRole: z.string().min(1),
  description: z.string().min(1),
  difficulty: z.number().min(1).max(3),
  organizationId: z.string().min(1),
})
export type TProfileRoleplayCreateSchema = z.infer<typeof ZProfileRoleplayCreateSchema>
