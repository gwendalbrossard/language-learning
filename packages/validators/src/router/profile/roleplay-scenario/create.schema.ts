import { z } from "zod/v4"

export const ZProfileRoleplayScenarioCreateSchema = z.object({
  assistantRole: z.string().min(1),
  userRole: z.string().min(1),
  description: z.string().min(1),
  organizationId: z.string().min(1),
})
export type TProfileRoleplayScenarioCreateSchema = z.infer<typeof ZProfileRoleplayScenarioCreateSchema>
