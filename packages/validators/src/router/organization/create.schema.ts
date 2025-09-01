import { z } from "zod/v4"

export const ZOrganizationCreateSchema = z.object({
  name: z.string().min(1),
})
export type TOrganizationCreateSchema = z.infer<typeof ZOrganizationCreateSchema>
