import type { TRPCRouterRecord } from "@trpc/server"

import { create } from "./create.route"
import { get } from "./get.route"
import { getAll } from "./getAll.route"

export const roleplaySessionRouter = {
  create: create,
  get: get,
  getAll: getAll,
} satisfies TRPCRouterRecord
