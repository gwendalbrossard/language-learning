import { z } from "zod/v4"

export const ZRoleplaySessionCreateSchema = z.object({
  scenarioId: z.string().min(1),
})
export type TRoleplaySessionCreateSchema = z.infer<typeof ZRoleplaySessionCreateSchema>
