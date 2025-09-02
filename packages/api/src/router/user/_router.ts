import type { TRPCRouterRecord } from "@trpc/server"

import { deleteUser } from "./delete.route"

export const userRouter = {
  delete: deleteUser,
} satisfies TRPCRouterRecord
