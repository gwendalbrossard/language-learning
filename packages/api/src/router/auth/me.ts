import type { ProfileSelected } from "@acme/db"
import type { TProfileCreateSchema } from "@acme/validators"
import { ZAuthMeSchema } from "@acme/validators"

import { publicProcedure } from "../../trpc"
import { createProfile } from "../profile/create.route"

export const me = publicProcedure.input(ZAuthMeSchema).query(async ({ ctx, input }) => {
  const { user, profile } = ctx

  if (!user) {
    return { user: null, profile: null }
  }

  let realProfile: ProfileSelected | null = profile

  // If the user does not exist in the database, and we are given a name and timezone in the inputs
  // we can create a new user directly to avoid the welcome step
  if (!realProfile && input && input.name && input.timezone) {
    const profileCreateInput: TProfileCreateSchema = {
      name: input.name,
      avatar: null,
      timezone: input.timezone,
      organizationName: `${input.name}'s Organization`,
    }
    const createdProfile = await createProfile({ user: user, profileCreateInput: profileCreateInput, db: ctx.db })

    realProfile = createdProfile.createdProfile
  }
  return { user: user, profile: realProfile }
})
