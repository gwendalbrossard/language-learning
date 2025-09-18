import baseConfig, { restrictApiAccess, restrictDbAccess, restrictEnvAccess } from "@acme/eslint-config/base"

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  ...restrictApiAccess,
  ...restrictDbAccess,
  ...restrictEnvAccess,
]
