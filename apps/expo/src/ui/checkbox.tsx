"use client"

import type { VariantProps } from "class-variance-authority"
import * as React from "react"
import * as CheckboxPrimitive from "@rn-primitives/checkbox"
import { cva } from "class-variance-authority"
import { CheckIcon } from "lucide-react-native"

import { cn } from "~/utils/utils"

// #region Checkbox
type CheckboxRootRef = React.ComponentRef<typeof CheckboxPrimitive.Root>

type CheckboxRootVariantProps = VariantProps<typeof checkboxRootVariants>
type CheckboxRootBaseProps = {} & CheckboxRootVariantProps
type CheckboxRootProps = CheckboxRootBaseProps & React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>

const checkboxRootVariants = cva(
  cn("peer relative flex shrink-0 items-center justify-center border border-none transition", "web:disabled:pointer-events-none", "shadow-xs"),
  {
    variants: {
      size: {
        sm: "size-4 rounded",
        md: "size-5 rounded-[5px]",
      },
      checked: {
        true: "border-primary-600 bg-primary-600",
        false: "border-neutral-200 bg-transparent",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
)

const Checkbox = React.forwardRef<CheckboxRootRef, CheckboxRootProps>(({ size, className, ...props }, ref) => (
  <CheckboxPrimitive.Root ref={ref} className={cn(checkboxRootVariants({ size, checked: props.checked }), className)} {...props}>
    <CheckboxIndicator size={size} />
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName
// #endregion Checkbox

// #region CheckboxIndicator
type CheckboxIndicatorRef = React.ComponentRef<typeof CheckboxPrimitive.Indicator>
type CheckboxIndicatorVariantProps = VariantProps<typeof checkboxIndicatorVariants>
type CheckboxIndicatorBaseProps = {} & CheckboxIndicatorVariantProps
type CheckboxIndicatorProps = CheckboxIndicatorBaseProps & React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Indicator>

const checkboxIndicatorVariants = cva(cn("flex items-center justify-center text-white data-[disabled]:text-neutral-300"), {
  variants: {
    size: {
      sm: "h-2.5 w-2.5",
      md: "h-3 w-3",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

const CheckboxIndicator = React.forwardRef<CheckboxIndicatorRef, CheckboxIndicatorProps>(({ size, className, ...props }, ref) => (
  <CheckboxPrimitive.Indicator asChild ref={ref} className={cn(checkboxIndicatorVariants({ size }), className)} {...props}>
    <CheckIcon size={12} strokeWidth={3} />
  </CheckboxPrimitive.Indicator>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName
// #endregion CheckboxIndicator

const Root = Checkbox
const Indicator = CheckboxIndicator

export { Root, Indicator }
export { Checkbox, CheckboxIndicator }
export type { CheckboxRootProps, CheckboxIndicatorProps }
export { checkboxRootVariants, checkboxIndicatorVariants }
