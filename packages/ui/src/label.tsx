"use client"

import type { VariantProps } from "class-variance-authority"
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva } from "class-variance-authority"

import { cn } from "@acme/ui/lib/utils"

type LabelRef = React.ComponentRef<typeof LabelPrimitive.Root>

type LabelVariantProps = VariantProps<typeof labelVariants>
type LabelBaseProps = {} & LabelVariantProps
type LabelProps = LabelBaseProps & React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>

const labelVariants = cva("font-medium text-neutral-700 peer-disabled:pointer-events-none peer-disabled:text-neutral-400", {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
    },
  },
  defaultVariants: { size: "sm" },
})

const Label = React.forwardRef<LabelRef, LabelProps>(({ size, className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants({ size }), className)} {...props} />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
export type { LabelProps }
export { labelVariants }
