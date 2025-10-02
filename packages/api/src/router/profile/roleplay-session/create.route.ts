import { TRPCError } from "@trpc/server"

import { roleplaySelect, roleplaySessionSelect } from "@acme/db"
import { ZProfileRoleplaySessionCreateSchema } from "@acme/validators"

import { organizationProcedure } from "../../../trpc"

export const create = organizationProcedure.input(ZProfileRoleplaySessionCreateSchema).mutation(async ({ ctx, input }) => {
  const roleplay = await ctx.db.roleplay.findFirst({
    where: { OR: [{ isPublic: true }, { AND: [{ isPublic: false }, { profileId: ctx.profile.id }, { organizationId: ctx.organization.id }] }] },
    select: roleplaySelect,
  })

  if (!roleplay) throw new TRPCError({ code: "NOT_FOUND", message: "Roleplay not found" })

  const createdRoleplaySession = await ctx.db.roleplaySession.create({
    data: { roleplayId: input.roleplayId, profileId: ctx.profile.id, organizationId: ctx.organization.id },
    select: roleplaySessionSelect,
  })

  return createdRoleplaySession
})
