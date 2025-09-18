import { z } from "zod/v4"

export const ZRoleplaySessionGetAllSchema = z.object({})
export type TRoleplaySessionGetAllSchema = z.infer<typeof ZRoleplaySessionGetAllSchema>
