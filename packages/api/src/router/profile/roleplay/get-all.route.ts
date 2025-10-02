import { roleplaySelect } from "@acme/db"
import { ZProfileRoleplayGetAllSchema } from "@acme/validators"

import { organizationProcedure } from "../../../trpc"

export const getAll = organizationProcedure.input(ZProfileRoleplayGetAllSchema).query(async ({ ctx }) => {
  const roleplays = await ctx.db.roleplay.findMany({
    where: { OR: [{ isPublic: true }, { AND: [{ isPublic: false }, { profileId: ctx.profile.id }, { organizationId: ctx.organization.id }] }] },
    select: roleplaySelect,
    orderBy: [{ createdAt: "desc" }],
  })

  return roleplays
})
