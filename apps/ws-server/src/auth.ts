import { initAuth } from "@acme/auth"

import { env } from "~/env.server"

export const auth = initAuth({
  baseUrl: env.URL_API,
  productionUrl: env.URL_API,
  secret: env.AUTH_SECRET,
  googleClientId: env.GOOGLE_CLIENT_ID,
  googleClientSecret: env.GOOGLE_CLIENT_SECRET,
  appleClientId: env.APPLE_CLIENT_ID,
  appleClientSecret: env.APPLE_CLIENT_SECRET,
  appleAppBundleIdentifier: env.APPLE_APP_BUNDLE_IDENTIFIER,
})
