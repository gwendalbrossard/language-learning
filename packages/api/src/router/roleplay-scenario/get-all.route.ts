import { roleplayScenarioSelect } from "@acme/db"

import { profileProcedure } from "../../trpc"

export const getAll = profileProcedure.query(async ({ ctx }) => {
  const roleplayScenarios = await ctx.db.roleplayScenario.findMany({
    select: roleplayScenarioSelect,
    orderBy: [{ difficulty: "asc" }, { createdAt: "desc" }],
  })

  return roleplayScenarios
})
