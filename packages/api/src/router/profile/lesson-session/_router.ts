import type { TRPCRouterRecord } from "@trpc/server"

import { create } from "./create.route"
import { getAll } from "./get-all.route"
import { getResponseSuggestions } from "./get-response-suggestions.route"
import { getVocabularySuggestions } from "./get-vocabulary-suggestions.route"
import { get } from "./get.route"
import { vocabularyRouter } from "./vocabulary/_router"

export const lessonSessionRouter = {
  create: create,
  get: get,
  getAll: getAll,
  getResponseSuggestions: getResponseSuggestions,
  getVocabularySuggestions: getVocabularySuggestions,
  vocabulary: vocabularyRouter,
} satisfies TRPCRouterRecord
