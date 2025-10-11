import type { TRPCRouterRecord } from "@trpc/server"

import { getPronunciation } from "./get-pronunciation.route"
import { getTranslation } from "./get-translation.route"

export const utilsRouter = {
  getPronunciation: getPronunciation,
  getTranslation: getTranslation,
} satisfies TRPCRouterRecord
