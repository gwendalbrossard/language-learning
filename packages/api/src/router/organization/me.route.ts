import { organizationSelect } from "@acme/db"

import { profileProcedure } from "../../trpc"

export const me = profileProcedure.query(async ({ ctx }) => {
  const organizations = await ctx.db.organization.findMany({
    where: { members: { some: { profileId: ctx.profile.id } } },
    select: organizationSelect,
    orderBy: { createdAt: "desc" },
  })

  return organizations
})
