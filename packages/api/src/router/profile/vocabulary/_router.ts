import type { TRPCRouterRecord } from "@trpc/server"

import { createMany } from "./create-many.route"
import { getAll } from "./get-all.route"

export const vocabularyRouter = {
  createMany: createMany,
  getAll: getAll,
} satisfies TRPCRouterRecord
