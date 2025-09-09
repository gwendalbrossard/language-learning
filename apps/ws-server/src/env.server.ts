import { createEnv } from "@t3-oss/env-core"
import { z } from "zod/v4"

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]).optional(),
    APPLE_CLIENT_ID: z.string().min(1),
    APPLE_CLIENT_SECRET: z.string().min(1),
    APPLE_APP_BUNDLE_IDENTIFIER: z.string().min(1),
    AUTH_SECRET: z.string().min(1),
    AZURE_API_KEY: z.string().min(1),
    AZURE_RESOURCE_NAME: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    OPENAI_API_KEY: z.string().min(1),
    URL_API: z.string().min(1),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
