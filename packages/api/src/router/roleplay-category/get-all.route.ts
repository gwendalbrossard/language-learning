import { roleplayCategorySelect } from "@acme/db"

import { profileProcedure } from "../../trpc"

export const getAll = profileProcedure.query(async ({ ctx }) => {
  const roleplayCategories = await ctx.db.roleplayCategory.findMany({
    select: roleplayCategorySelect,
    orderBy: [{ createdAt: "desc" }],
  })

  return roleplayCategories
})
