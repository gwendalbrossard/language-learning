import { lessonCategorySelect } from "@acme/db"
import { ZProfileLessonCategoryGetAllSchema } from "@acme/validators"

import { organizationProcedure } from "../../../trpc"

export const getAll = organizationProcedure.input(ZProfileLessonCategoryGetAllSchema).query(async ({ ctx }) => {
  const lessonCategories = await ctx.db.lessonCategory.findMany({
    where: { OR: [{ isPublic: true }, { AND: [{ isPublic: false }, { profileId: ctx.profile.id }, { organizationId: ctx.organization.id }] }] },
    orderBy: [{ createdAt: "desc" }],
    select: lessonCategorySelect,
  })

  return lessonCategories
})
