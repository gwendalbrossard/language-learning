import type { TRPCRouterRecord } from "@trpc/server"

import { create } from "./create.route"
import { getAll } from "./get-all.route"
import { getResponseSuggestions } from "./get-response-suggestions.route"
import { get } from "./get.route"

export const roleplaySessionRouter = {
  create: create,
  get: get,
  getAll: getAll,
  getResponseSuggestions: getResponseSuggestions,
} satisfies TRPCRouterRecord
