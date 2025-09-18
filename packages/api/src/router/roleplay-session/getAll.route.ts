import { roleplaySessionSelect } from "@acme/db"
import { ZRoleplaySessionGetAllSchema } from "@acme/validators"

import { profileProcedure } from "../../trpc"

export const getAll = profileProcedure.input(ZRoleplaySessionGetAllSchema).query(async ({ ctx }) => {
  const roleplaySessions = await ctx.db.roleplaySession.findMany({
    where: { profileId: ctx.profile.id },
    select: roleplaySessionSelect,
  })

  return roleplaySessions
})
