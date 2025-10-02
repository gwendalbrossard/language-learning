import { z } from "zod/v4"

export const ZProfileRoleplayGetAllSchema = z.object({
  organizationId: z.string().min(1),
})
export type TProfileRoleplayGetAllSchema = z.infer<typeof ZProfileRoleplayGetAllSchema>
