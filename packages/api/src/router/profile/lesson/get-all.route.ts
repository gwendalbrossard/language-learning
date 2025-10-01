import { lessonSelect } from "@acme/db"
import { ZProfileLessonGetAllSchema } from "@acme/validators"

import { organizationProcedure } from "../../../trpc"

export const getAll = organizationProcedure.input(ZProfileLessonGetAllSchema).query(async ({ ctx }) => {
  const lessons = await ctx.db.lesson.findMany({
    where: { OR: [{ isPublic: true }, { AND: [{ isPublic: false }, { profileId: ctx.profile.id }, { organizationId: ctx.organization.id }] }] },
    orderBy: [{ createdAt: "desc" }],
    select: lessonSelect,
  })

  return lessons
})
