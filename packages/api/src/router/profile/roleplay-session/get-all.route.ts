import { roleplaySessionSelect } from "@acme/db"
import { ZProfileRoleplaySessionGetAllSchema } from "@acme/validators"

import { organizationProcedure } from "../../../trpc"

export const getAll = organizationProcedure.input(ZProfileRoleplaySessionGetAllSchema).query(async ({ ctx }) => {
  const roleplaySessions = await ctx.db.roleplaySession.findMany({
    where: {
      AND: [{ profileId: ctx.profile.id }, { organizationId: ctx.organization.id }],
    },
    select: roleplaySessionSelect,
  })

  return roleplaySessions
})
