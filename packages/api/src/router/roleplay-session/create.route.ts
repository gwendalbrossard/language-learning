import { TRPCError } from "@trpc/server"

import { roleplayScenarioSelect, roleplaySessionSelect } from "@acme/db"
import { ZRoleplaySessionCreateSchema } from "@acme/validators"

import { profileProcedure } from "../../trpc"

export const create = profileProcedure.input(ZRoleplaySessionCreateSchema).mutation(async ({ ctx, input }) => {
  const roleplayScenario = await ctx.db.roleplayScenario.findUnique({
    where: { id: input.scenarioId },
    select: roleplayScenarioSelect,
  })

  if (!roleplayScenario) throw new TRPCError({ code: "NOT_FOUND", message: "Roleplay scenario not found" })

  const createdRoleplaySession = await ctx.db.roleplaySession.create({
    data: { profileId: ctx.profile.id, scenarioId: input.scenarioId },
    select: roleplaySessionSelect,
  })

  return createdRoleplaySession
})
