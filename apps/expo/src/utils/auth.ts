import * as SecureStore from "expo-secure-store"
import { expoClient } from "@better-auth/expo/client"
import { createAuthClient } from "better-auth/react"

import { getBaseUrl } from "./base-url"
import { setBearerToken } from "./bearer-store"

console.log("getBaseUrl", getBaseUrl())

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  plugins: [
    expoClient({
      scheme: "expo",
      storagePrefix: "expo",
      storage: SecureStore,
    }),
  ],
  fetchOptions: {
    onSuccess: (ctx) => {
      const authToken = ctx.response.headers.get("set-auth-token")
      if (authToken) {
        setBearerToken(authToken)
      }
    },
  },
})
