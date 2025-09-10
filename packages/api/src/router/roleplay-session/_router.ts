import type { TRPCRouterRecord } from "@trpc/server"

import { create } from "./create.route"

export const roleplaySessionRouter = {
  create: create,
} satisfies TRPCRouterRecord
