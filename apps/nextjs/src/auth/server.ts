import "server-only"

import { cache } from "react"
import { headers } from "next/headers"

import { initAuth } from "@acme/auth"

import { env } from "~/env.server"

const baseUrl =
  env.VERCEL_ENV === "production"
    ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
    : env.VERCEL_ENV === "preview"
      ? `https://${env.VERCEL_URL}`
      : "http://localhost:3000"

export const auth = initAuth({
  baseUrl,
  productionUrl: `https://${env.VERCEL_PROJECT_PRODUCTION_URL ?? "turbo.t3.gg"}`,
  secret: env.AUTH_SECRET,
  googleClientId: env.GOOGLE_CLIENT_ID,
  googleClientSecret: env.GOOGLE_CLIENT_SECRET,
  appleClientId: env.APPLE_CLIENT_ID,
  appleClientSecret: env.APPLE_CLIENT_SECRET,
  appleAppBundleIdentifier: env.APPLE_APP_BUNDLE_IDENTIFIER,
})

export const getSession = cache(async () => auth.api.getSession({ headers: await headers() }))
