import { z } from "zod/v4"

export const ZProfileRoleplayScenarioGetAllSchema = z.object({
  organizationId: z.string().min(1),
})
export type TProfileRoleplayScenarioGetAllSchema = z.infer<typeof ZProfileRoleplayScenarioGetAllSchema>
