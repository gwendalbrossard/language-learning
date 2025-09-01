import { Prisma } from "../../generated/client"
import { memberSelect } from "./member"

export const organizationSelect = Prisma.validator<Prisma.OrganizationSelect>()({
  id: true,
  name: true,
  slug: true,
  logo: true,
  metadata: true,
  members: { select: memberSelect },
})

export type OrganizationSelected = Prisma.OrganizationGetPayload<{ select: typeof organizationSelect }>
