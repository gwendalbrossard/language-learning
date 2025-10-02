import type { TRPCRouterRecord } from "@trpc/server"

import { create } from "./create.route"
import { getAll } from "./get-all.route"

export const roleplayRouter = {
  create: create,
  getAll: getAll,
} satisfies TRPCRouterRecord
