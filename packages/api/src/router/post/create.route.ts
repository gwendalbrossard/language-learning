import { ZPostCreateSchema } from "@acme/validators"

import { userProcedure } from "../../trpc"

export const create = userProcedure.input(ZPostCreateSchema).mutation(async ({ ctx, input }) => {
  const post = await ctx.db.post.create({ data: input })
  return post
})
