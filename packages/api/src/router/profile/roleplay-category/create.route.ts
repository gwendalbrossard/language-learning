import { roleplayCategorySelect } from "@acme/db"
import { ZProfileRoleplayCategoryCreateSchema } from "@acme/validators"

import { organizationProcedure } from "../../../trpc"

export const create = organizationProcedure.input(ZProfileRoleplayCategoryCreateSchema).mutation(async ({ ctx, input }) => {
  const createdRoleplayCategory = await ctx.db.roleplayCategory.create({
    data: {
      emoji: input.emoji,
      name: input.name,
      isPublic: false,
      organizationId: ctx.organization.id,
      profileId: ctx.profile.id,
    },
    select: roleplayCategorySelect,
  })

  return createdRoleplayCategory
})
