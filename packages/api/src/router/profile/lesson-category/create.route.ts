import { lessonCategorySelect } from "@acme/db"
import { ZProfileLessonCategoryCreateSchema } from "@acme/validators"

import { organizationProcedure } from "../../../trpc"

export const create = organizationProcedure.input(ZProfileLessonCategoryCreateSchema).mutation(async ({ ctx, input }) => {
  const createdLessonCategory = await ctx.db.lessonCategory.create({
    data: {
      emoji: input.emoji,
      name: input.name,
      isPublic: false,
      organizationId: ctx.organization.id,
      profileId: ctx.profile.id,
    },
    select: lessonCategorySelect,
  })

  return createdLessonCategory
})
