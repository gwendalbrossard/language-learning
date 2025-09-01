import type { Config } from "tailwindcss"
// @ts-expect-error - no types
import nativewind from "nativewind/preset"

import base from "./tailwind.base.config"

export default {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [base, nativewind],
} satisfies Config
