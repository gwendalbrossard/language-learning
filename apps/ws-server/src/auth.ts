import { initAuth } from "@acme/auth"

import { env as envClient } from "~/env.client"
import { env as envServer } from "~/env.server"

export const auth = initAuth({
  baseUrl: envClient.NEXT_PUBLIC_URL_API,
  productionUrl: envClient.NEXT_PUBLIC_URL_API,
  secret: envServer.AUTH_SECRET,
  googleClientId: envServer.GOOGLE_CLIENT_ID,
  googleClientSecret: envServer.GOOGLE_CLIENT_SECRET,
  appleClientId: envServer.APPLE_CLIENT_ID,
  appleClientSecret: envServer.APPLE_CLIENT_SECRET,
  appleAppBundleIdentifier: envServer.APPLE_APP_BUNDLE_IDENTIFIER,
})
