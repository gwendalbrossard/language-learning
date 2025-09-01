import { publicProcedure } from "../../trpc"

export const all = publicProcedure.query(async ({ ctx }) => {
  const posts = await ctx.db.post.findMany()
  return posts
})
