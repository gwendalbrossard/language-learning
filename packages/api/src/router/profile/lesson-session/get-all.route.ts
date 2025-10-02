import { lessonSessionSelect } from "@acme/db"
import { ZProfileLessonSessionGetAllSchema } from "@acme/validators"

import { organizationProcedure } from "../../../trpc"

export const getAll = organizationProcedure.input(ZProfileLessonSessionGetAllSchema).query(async ({ ctx }) => {
  const lessonSessions = await ctx.db.lessonSession.findMany({
    where: {
      AND: [{ profileId: ctx.profile.id }, { organizationId: ctx.organization.id }],
    },
    select: lessonSessionSelect,
  })

  return lessonSessions
})
