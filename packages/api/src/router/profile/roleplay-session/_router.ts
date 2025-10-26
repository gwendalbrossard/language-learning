import type { TRPCRouterRecord } from "@trpc/server"

import { create } from "./create.route"
import { generateFeedback } from "./generate-feedback.route"
import { getAll } from "./get-all.route"
import { getResponseSuggestions } from "./get-response-suggestions.route"
import { getVocabularySuggestions } from "./get-vocabulary-suggestions.route"
import { get } from "./get.route"

export const roleplaySessionRouter = {
  create: create,
  generateFeedback: generateFeedback,
  get: get,
  getAll: getAll,
  getResponseSuggestions: getResponseSuggestions,
  getVocabularySuggestions: getVocabularySuggestions,
} satisfies TRPCRouterRecord
