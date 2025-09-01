import { ZPostDeleteSchema } from "@acme/validators"

import { userProcedure } from "../../trpc"

export const deletePost = userProcedure.input(ZPostDeleteSchema).mutation(async ({ ctx, input }) => {
  const post = await ctx.db.post.delete({ where: { id: input.postId } })
  return post
})
