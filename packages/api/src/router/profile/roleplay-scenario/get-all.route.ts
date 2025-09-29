import { roleplayScenarioSelect } from "@acme/db"
import { ZProfileRoleplayScenarioGetAllSchema } from "@acme/validators"

import { organizationProcedure } from "../../../trpc"

export const getAll = organizationProcedure.input(ZProfileRoleplayScenarioGetAllSchema).query(async ({ ctx }) => {
  const roleplayScenarios = await ctx.db.roleplayScenario.findMany({
    where: { OR: [{ isPublic: true }, { AND: [{ isPublic: false }, { profileId: ctx.profile.id }, { organizationId: ctx.organization.id }] }] },
    select: roleplayScenarioSelect,
    orderBy: [{ createdAt: "desc" }],
  })

  return roleplayScenarios
})
