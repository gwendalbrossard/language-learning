import type { VariantProps } from "class-variance-authority"
import * as React from "react"
import * as LabelPrimitive from "@rn-primitives/label"
import { cva } from "class-variance-authority"

import { cn } from "~/utils/utils"

export type LabelRef = LabelPrimitive.TextRef

export type LabelVariantProps = VariantProps<typeof labelVariants>
export type LabelBaseProps = {} & LabelVariantProps
export type LabelProps = LabelBaseProps & LabelPrimitive.TextProps

export const labelVariants = cva("web:peer-disabled:pointer-events-none web:peer-disabled:text-neutral-400 font-semibold text-neutral-700", {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
    },
  },
  defaultVariants: { size: "md" },
})

const Label = React.forwardRef<LabelRef, LabelProps>(({ size, className, onPress, onLongPress, onPressIn, onPressOut, ...props }, ref) => (
  <LabelPrimitive.Root className="web:cursor-default" onPress={onPress} onLongPress={onLongPress} onPressIn={onPressIn} onPressOut={onPressOut}>
    <LabelPrimitive.Text ref={ref} className={cn(labelVariants({ size }), className)} {...props} />
  </LabelPrimitive.Root>
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
