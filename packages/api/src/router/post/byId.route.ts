import { ZPostByIdSchema } from "@acme/validators"

import { publicProcedure } from "../../trpc"

export const byId = publicProcedure.input(ZPostByIdSchema).query(async ({ ctx, input }) => {
  const post = await ctx.db.post.findUnique({
    where: { id: input.postId },
  })
  return post
})
