import { createEnv } from "@t3-oss/env-core"
import { z } from "zod/v4"

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    NODE_ENV: z.enum(["development", "production", "test"]).optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
