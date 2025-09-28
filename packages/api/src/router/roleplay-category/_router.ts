import type { TRPCRouterRecord } from "@trpc/server"

import { getAll } from "./get-all.route"

export const roleplayCategoryRouter = {
  getAll: getAll,
} satisfies TRPCRouterRecord
