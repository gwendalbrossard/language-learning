import { z } from "zod/v4"

export const ZProfileRoleplaySessionGetAllSchema = z.object({ organizationId: z.string().min(1) })
export type TProfileRoleplaySessionGetAllSchema = z.infer<typeof ZProfileRoleplaySessionGetAllSchema>
