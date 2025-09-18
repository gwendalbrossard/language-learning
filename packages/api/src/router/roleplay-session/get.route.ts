import { TRPCError } from "@trpc/server"

import { roleplaySessionSelect } from "@acme/db"
import { ZRoleplaySessionGetSchema } from "@acme/validators"

import { profileProcedure } from "../../trpc"

export const get = profileProcedure.input(ZRoleplaySessionGetSchema).query(async ({ ctx, input }) => {
  const roleplaySession = await ctx.db.roleplaySession.findUnique({
    where: { id: input.roleplaySessionId },
    select: roleplaySessionSelect,
  })

  if (!roleplaySession) throw new TRPCError({ code: "NOT_FOUND", message: "Roleplay session not found" })

  return roleplaySession
})
