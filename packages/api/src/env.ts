import { createEnv } from "@t3-oss/env-core"
import { z } from "zod/v4"

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]).optional(),
    ASSETS_DOMAIN: z.string().min(1),
    R2_ACCESS_KEY_ID: z.string().min(1),
    R2_BUCKET_PRIVATE: z.string().min(1),
    R2_BUCKET_PUBLIC: z.string().min(1),
    R2_ENDPOINT_ID: z.string().min(1),
    R2_SECRET_ACCESS_KEY: z.string().min(1),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
