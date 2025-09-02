import { POSTHOG_EVENTS } from "@acme/shared/posthog"
import { ZUserDeleteSchema } from "@acme/validators"

import { userProcedure } from "../../trpc"
import { posthogNodeCapture } from "../../utils/posthog"

export const deleteUser = userProcedure.input(ZUserDeleteSchema).mutation(async ({ ctx }) => {
  await ctx.db.user.delete({ where: { id: ctx.user.id } })

  await posthogNodeCapture({
    distinctId: ctx.user.id,
    event: POSTHOG_EVENTS["user delete"],
    properties: {
      user: {
        id: ctx.user.id,
        email: ctx.user.email,
      },
    },
  })

  return { success: true }
})
