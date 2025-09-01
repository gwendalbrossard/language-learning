import { profileProcedure } from "../../trpc"

export const me = profileProcedure.query(({ ctx }) => {
  const { profile } = ctx

  return profile
})
