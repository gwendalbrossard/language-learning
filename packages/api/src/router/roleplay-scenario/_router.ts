import type { TRPCRouterRecord } from "@trpc/server"

import { getAll } from "./get-all.route"

export const roleplayScenarioRouter = {
  getAll: getAll,
} satisfies TRPCRouterRecord
