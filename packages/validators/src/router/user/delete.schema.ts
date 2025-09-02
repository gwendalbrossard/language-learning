import { z } from "zod/v4"

export const ZUserDeleteSchema = z.object({})
export type TUserDeleteSchema = z.infer<typeof ZUserDeleteSchema>
