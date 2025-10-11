import type { TRPCRouterRecord } from "@trpc/server"

import { getPronunciation } from "./get-pronunciation.route"

export const utilsRouter = {
  getPronunciation: getPronunciation,
} satisfies TRPCRouterRecord
