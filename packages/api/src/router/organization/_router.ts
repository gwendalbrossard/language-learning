import type { TRPCRouterRecord } from "@trpc/server"

import { create } from "./create.route"
import { me } from "./me.route"
import { update } from "./update.route"
import { uploadLogo } from "./upload-logo.route"

export const organizationRouter = {
  create: create,
  me: me,
  update: update,
  uploadLogo: uploadLogo,
} satisfies TRPCRouterRecord
