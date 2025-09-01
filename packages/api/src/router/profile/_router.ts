import type { TRPCRouterRecord } from "@trpc/server"

import { create } from "./create.route"
import { me } from "./me.route"
import { onboard } from "./onboard.route"

export const profileRouter = {
  create: create,
  me: me,
  onboard: onboard,
} satisfies TRPCRouterRecord
