import { TRPCError } from "@trpc/server"

import { roleplaySessionSelect } from "@acme/db"
import { ZProfileRoleplaySessionGetSchema } from "@acme/validators"

import { organizationProcedure } from "../../../trpc"

export const get = organizationProcedure.input(ZProfileRoleplaySessionGetSchema).query(async ({ ctx, input }) => {
  const roleplaySession = await ctx.db.roleplaySession.findFirst({
    where: { AND: [{ id: input.roleplaySessionId }, { profileId: ctx.profile.id }, { organizationId: ctx.organization.id }] },
    select: roleplaySessionSelect,
  })

  if (!roleplaySession) throw new TRPCError({ code: "NOT_FOUND", message: "Roleplay session not found" })

  return roleplaySession
})
