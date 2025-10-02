import { TRPCError } from "@trpc/server"

import { roleplayScenarioSelect, roleplaySessionSelect } from "@acme/db"
import { ZProfileRoleplaySessionCreateSchema } from "@acme/validators"

import { organizationProcedure } from "../../../trpc"

export const create = organizationProcedure.input(ZProfileRoleplaySessionCreateSchema).mutation(async ({ ctx, input }) => {
  const roleplayScenario = await ctx.db.roleplayScenario.findFirst({
    where: { OR: [{ isPublic: true }, { AND: [{ isPublic: false }, { profileId: ctx.profile.id }, { organizationId: ctx.organization.id }] }] },
    select: roleplayScenarioSelect,
  })

  if (!roleplayScenario) throw new TRPCError({ code: "NOT_FOUND", message: "Roleplay scenario not found" })

  const createdRoleplaySession = await ctx.db.roleplaySession.create({
    data: { scenarioId: input.scenarioId, profileId: ctx.profile.id, organizationId: ctx.organization.id },
    select: roleplaySessionSelect,
  })

  return createdRoleplaySession
})
