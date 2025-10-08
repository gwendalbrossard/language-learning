import { profileProcedure } from "../../trpc"

export const me = profileProcedure.query(({ ctx }) => {
  return ctx.profile
})
