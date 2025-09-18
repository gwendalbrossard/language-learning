import { z } from "zod/v4"

export const ZOrganizationUploadLogoSchema = z.object({
  name: z.string().min(1),
  contentType: z.string().min(1),
  organizationId: z.string().min(1),
})
export type TOrganizationUploadLogoSchema = z.infer<typeof ZOrganizationUploadLogoSchema>
