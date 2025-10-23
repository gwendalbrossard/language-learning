import { TRPCError } from "@trpc/server"

import { lessonSelect, lessonSessionSelect } from "@acme/db"
import { ZProfileLessonSessionCreateSchema } from "@acme/validators"

import { organizationUnlimitedProcedure } from "../../../trpc"
import { incrementProfileStats } from "../../../utils/profile"

export const create = organizationUnlimitedProcedure.input(ZProfileLessonSessionCreateSchema).mutation(async ({ ctx, input }) => {
  const lesson = await ctx.db.lesson.findFirst({
    where: { OR: [{ isPublic: true }, { AND: [{ isPublic: false }, { profileId: ctx.profile.id }, { organizationId: ctx.organization.id }] }] },
    select: lessonSelect,
  })

  if (!lesson) throw new TRPCError({ code: "NOT_FOUND", message: "Lesson not found" })

  const createdLessonSession = await ctx.db.lessonSession.create({
    data: { lessonId: input.lessonId, profileId: ctx.profile.id, organizationId: ctx.organization.id },
    select: lessonSessionSelect,
  })

  await incrementProfileStats({ lessonsDone: 1, profileId: ctx.profile.id })

  return createdLessonSession
})
