import type { BetterAuthOptions } from "better-auth"
import { expo } from "@better-auth/expo"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { oAuthProxy } from "better-auth/plugins"

import { prisma } from "@acme/db"
import { POSTHOG_EVENTS } from "@acme/shared/posthog"

import { posthogNodeCapture } from "./utils/posthog"

export function initAuth(options: {
  baseUrl: string
  productionUrl: string
  secret: string

  googleClientId: string
  googleClientSecret: string

  appleClientId: string
  appleClientSecret: string
  appleAppBundleIdentifier: string
}) {
  const config = {
    database: prismaAdapter(prisma, {
      provider: "postgresql",
    }),
    advanced: {
      database: {
        generateId: false,
      },
    },
    baseURL: options.baseUrl,
    secret: options.secret,
    plugins: [
      oAuthProxy({
        /**
         * Auto-inference blocked by https://github.com/better-auth/better-auth/pull/2891
         */
        currentURL: options.baseUrl,
        productionURL: options.productionUrl,
      }),
      expo(),
    ],
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      google: {
        clientId: options.googleClientId,
        clientSecret: options.googleClientSecret,
      },
      apple: {
        clientId: options.appleClientId,
        clientSecret: options.appleClientSecret,
        // For native iOS: https://github.com/better-auth/better-auth/issues/421#issuecomment-2466911181
        appBundleIdentifier: options.appleAppBundleIdentifier,
      },
    },
    trustedOrigins: ["expo://"],
    databaseHooks: {
      user: {
        create: {
          after: async (user, _context) => {
            await posthogNodeCapture({
              distinctId: user.id,
              event: POSTHOG_EVENTS["user signed up"],
              properties: user,
            })
          },
        },
      },
    },
  } satisfies BetterAuthOptions

  return betterAuth(config)
}

export type Auth = ReturnType<typeof initAuth>
export type Session = Auth["$Infer"]["Session"]
