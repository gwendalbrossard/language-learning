import { z } from "zod/v4"

export const ZProfileRoleplaySessionCreateSchema = z.object({
  scenarioId: z.string().min(1),
  organizationId: z.string().min(1),
})
export type TProfileRoleplaySessionCreateSchema = z.infer<typeof ZProfileRoleplaySessionCreateSchema>
