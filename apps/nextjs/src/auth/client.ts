import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  fetchOptions: {
    onSuccess: (ctx) => {
      const authToken = ctx.response.headers.get("set-auth-token")
      if (authToken) {
        localStorage.setItem("bearer_token", authToken)
      }
    },
  },
})
