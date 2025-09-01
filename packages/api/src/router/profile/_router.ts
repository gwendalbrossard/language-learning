import type { TRPCRouterRecord } from "@trpc/server"

import { create } from "./create.route"
import { me } from "./me.route"

export const profileRouter = {
  create: create,
  me: me,
} satisfies TRPCRouterRecord
