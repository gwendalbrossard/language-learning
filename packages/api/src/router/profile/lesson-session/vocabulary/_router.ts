import type { TRPCRouterRecord } from "@trpc/server"

import { createMany } from "./create-many.route"

export const vocabularyRouter = {
  createMany: createMany,
} satisfies TRPCRouterRecord
