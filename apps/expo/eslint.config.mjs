import baseConfig, { restrictApiAccess, restrictDbAccess, restrictEnvAccess } from "@acme/eslint-config/base"
import reactConfig from "@acme/eslint-config/react"

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".expo/**", "expo-plugins/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...restrictApiAccess,
  ...restrictDbAccess,
  ...restrictEnvAccess,
]
