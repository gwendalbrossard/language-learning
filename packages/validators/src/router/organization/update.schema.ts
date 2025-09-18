import { z } from "zod/v4"

export const ZOrganizationUpdateSchema = z.object({
  name: z.string().min(1),
  logoR2Key: z.string().optional(),
  organizationId: z.string().min(1),
})
export type TOrganizationUpdateSchema = z.infer<typeof ZOrganizationUpdateSchema>
