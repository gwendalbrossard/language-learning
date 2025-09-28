import { roleplayCategorySelect } from "@acme/db"
import { ZProfileRoleplayCategoryGetAllSchema } from "@acme/validators"

import { organizationProcedure } from "../../../trpc"

export const getAll = organizationProcedure.input(ZProfileRoleplayCategoryGetAllSchema).query(async ({ ctx }) => {
  const roleplayCategories = await ctx.db.roleplayCategory.findMany({
    where: { OR: [{ isPublic: true }, { AND: [{ isPublic: false }, { profileId: ctx.profile.id }, { organizationId: ctx.organization.id }] }] },
    select: roleplayCategorySelect,
    orderBy: [{ createdAt: "desc" }],
  })

  return roleplayCategories
})
