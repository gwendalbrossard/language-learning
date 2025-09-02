import { createEnv } from "@t3-oss/env-nextjs"
import { vercel } from "@t3-oss/env-nextjs/presets-zod"
import { z } from "zod/v4"

export const env = createEnv({
  extends: [vercel()],
  server: {
    APPLE_CLIENT_ID: z.string().min(1),
    APPLE_CLIENT_SECRET: z.string().min(1),
    APPLE_APP_BUNDLE_IDENTIFIER: z.string().min(1),
    AUTH_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    OPENAI_API_KEY: z.string().min(1),
    REVENUECAT_API_KEY: z.string().min(1),
    REVENUECAT_PROJECT_ID: z.string().min(1),
    REVENUECAT_WEBHOOK_SECRET: z.string().min(1),
  },
  experimental__runtimeEnv: {},
  skipValidation: !!process.env.CI || process.env.npm_lifecycle_event === "lint",
})
