import { roleplayScenarioSelect } from "@acme/db"

import { profileProcedure } from "../../trpc"

export const getAll = profileProcedure.query(async ({ ctx }) => {
  const roleplayScenarios = await ctx.db.roleplayScenario.findMany({
    select: roleplayScenarioSelect,
    orderBy: { createdAt: "desc" },
  })

  return roleplayScenarios
})
