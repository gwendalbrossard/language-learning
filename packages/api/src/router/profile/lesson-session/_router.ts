import type { TRPCRouterRecord } from "@trpc/server"

import { create } from "./create.route"
import { getAll } from "./get-all.route"
import { get } from "./get.route"

export const lessonSessionRouter = {
  create: create,
  get: get,
  getAll: getAll,
} satisfies TRPCRouterRecord
