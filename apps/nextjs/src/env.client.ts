import { createEnv } from "@t3-oss/env-nextjs"
import { vercel } from "@t3-oss/env-nextjs/presets-zod"
import { z } from "zod/v4"

export const env = createEnv({
  extends: [vercel()],
  shared: {
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  },
  // Add NEXT_PUBLIC_ vars as needed
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },
  // You only need to destructure client variables here + NODE_ENV from the shared variables
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  skipValidation: !!process.env.CI || process.env.npm_lifecycle_event === "lint",
})
