"use client"

import type { VariantProps } from "class-variance-authority"
import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { cva } from "class-variance-authority"
import { Check } from "lucide-react"

import { cn } from "@acme/ui/lib/utils"

// #region Checkbox
type CheckboxRootRef = React.ComponentRef<typeof CheckboxPrimitive.Root>

type CheckboxRootVariantProps = VariantProps<typeof checkboxRootVariants>
type CheckboxRootBaseProps = {} & CheckboxRootVariantProps
type CheckboxRootProps = CheckboxRootBaseProps & React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>

const checkboxRootVariants = cva(
  cn(
    "peer relative flex shrink-0 cursor-pointer items-center justify-center border-none transition",
    "disabled:pointer-events-none",
    "focus-within:ring-primary-600/24 focus-within:ring-3 focus-visible:outline-hidden",

    // Checked + Unchecked - Inner border
    "before:absolute before:inset-0 before:transition",

    // Checked State
    // Checked - Background
    "data-[state=checked]:bg-primary-600 data-[state=checked]:hover:bg-primary-700",

    // Checked - Radial gradient
    "data-[state=checked]:after:absolute data-[state=checked]:after:inset-px",
    "data-[state=checked]:after:bg-[radial-gradient(100%_100%_at_50%_0%,--theme(--color-white/16%)_0%,--theme(--color-white/0%)_100%)]",

    // Checked - Serves as the inner border
    "data-[state=checked]:before:shadow-[inset_0_0_0_1px_--theme(--color-primary-600/100%)]",
    "data-[state=checked]:hover:before:shadow-[inset_0_0_0_1px_--theme(--color-primary-700/100%)]",

    // Checked - Shadows
    // 1st shadow: Adds depth around the button
    // 2nd shadow: Adds a small white line at the top for depth
    // 3rd shadow: Adds a small black line at the bottom for depth
    "data-[state=checked]:shadow-[--theme(--shadow-xs),inset_0_1px_0.5px_0.5px_--theme(--color-white/44%),inset_0_-1px_2px_--theme(--color-primary-800/50%)]",

    // Checked - Disabled
    "data-[state=checked]:disabled:bg-neutral-50",
    "data-[state=checked]:disabled:before:content-none!",
    "data-[state=checked]:disabled:after:content-none!",
    "data-[state=checked]:disabled:shadow-[inset_0_1px_2px_--theme(--color-neutral-900/12%)]",

    // Unchecked State
    // Unchecked - Background
    "data-[state=unchecked]:bg-transparent",

    // Unchecked - Serves as the inner border
    "data-[state=unchecked]:before:shadow-[inset_0_0_0_1px_--theme(--color-neutral-200/100%)]",
    "data-[state=unchecked]:hover:before:shadow-[inset_0_0_0_1px_--theme(--color-primary-500/100%)]",

    // Unchecked - Shadows
    "data-[state=unchecked]:shadow-[var(--shadow-xs),inset_0_-1px_2px_--theme(--color-neutral-900/12%)]",

    // Unchecked - Disabled
    "data-[state=unchecked]:disabled:bg-neutral-50",
    "data-[state=unchecked]:disabled:before:content-none!",
    "data-[state=unchecked]:disabled:shadow-[inset_0_1px_2px_--theme(--color-neutral-900/12%)]",
  ),
  {
    variants: {
      size: {
        sm: "size-4 rounded-sm before:rounded-sm after:rounded-[calc(4px-1px)]",
        md: "size-5 rounded-[5px] before:rounded-[5px] after:rounded-[calc(5px-1px)]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
)

const Checkbox = React.forwardRef<CheckboxRootRef, CheckboxRootProps>(({ size, className, ...props }, ref) => (
  <CheckboxPrimitive.Root ref={ref} className={cn(checkboxRootVariants({ size }), className)} {...props}>
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

const checkboxIndicatorVariants = cva(cn("flex items-center justify-center text-white data-disabled:text-neutral-300"), {
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
    <Check strokeWidth={3} />
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
