import type { TRPCRouterRecord } from "@trpc/server"

import { all } from "./all.route"
import { byId } from "./byId.route"
import { create } from "./create.route"
import { deletePost } from "./delete.route"

export const postRouter = {
  all: all,
  byId: byId,
  create: create,
  delete: deletePost,
} satisfies TRPCRouterRecord
