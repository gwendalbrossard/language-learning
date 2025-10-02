import { TRPCError } from "@trpc/server"

import { lessonSessionSelect } from "@acme/db"
import { ZProfileLessonSessionGetSchema } from "@acme/validators"

import { organizationProcedure } from "../../../trpc"

export const get = organizationProcedure.input(ZProfileLessonSessionGetSchema).query(async ({ ctx, input }) => {
  const lessonSession = await ctx.db.lessonSession.findFirst({
    where: { AND: [{ id: input.lessonSessionId }, { profileId: ctx.profile.id }, { organizationId: ctx.organization.id }] },
    select: lessonSessionSelect,
  })

  if (!lessonSession) throw new TRPCError({ code: "NOT_FOUND", message: "Lesson session not found" })

  return lessonSession
})
