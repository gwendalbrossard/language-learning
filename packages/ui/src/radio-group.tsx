"use client"

import type { VariantProps } from "class-variance-authority"
import type { FC } from "react"
import * as React from "react"
import { useContext } from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { cva } from "class-variance-authority"

import { cn } from "@acme/ui/lib/utils"

// #region RadioContext
type RadioContextProps = { size: RadioGroupRootVariantProps["size"] }
const RadioContext = React.createContext<RadioContextProps>({ size: "md" })

type RadioProviderProps = { children: React.ReactNode; size: RadioGroupRootVariantProps["size"] }
const RadioProvider: FC<RadioProviderProps> = ({ children, size }) => <RadioContext.Provider value={{ size }}>{children}</RadioContext.Provider>
const useRadio = () => useContext(RadioContext)
// #endregion RadioContext

// #region RadioGroupRoot
type RadioGroupRootRef = React.ComponentRef<typeof RadioGroupPrimitive.Root>

type RadioGroupRootVariantProps = VariantProps<typeof radioGroupRootVariants>
type RadioGroupRootBaseProps = {} & RadioGroupRootVariantProps
type RadioGroupRootProps = RadioGroupRootBaseProps & React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>

const radioGroupRootVariants = cva(cn("grid"), {
  variants: {
    size: {
      sm: "gap-1.5",
      md: "gap-2",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

const RadioGroup = React.forwardRef<RadioGroupRootRef, RadioGroupRootProps>(({ size, className, ...props }, ref) => {
  return (
    <RadioProvider size={size}>
      <RadioGroupPrimitive.Root className={cn(radioGroupRootVariants({ size }), className)} {...props} ref={ref} />
    </RadioProvider>
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName
// #endregion RadioGroupRoot

// #region RadioGroupItem
type RadioGroupItemRef = React.ComponentRef<typeof RadioGroupPrimitive.Item>

type RadioGroupItemVariantProps = VariantProps<typeof radioGroupItemVariants>
type RadioGroupItemBaseProps = {} & RadioGroupItemVariantProps
type RadioGroupItemProps = RadioGroupItemBaseProps & React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>

const radioGroupItemVariants = cva(
  cn(
    "peer relative flex aspect-square shrink-0 cursor-pointer items-center justify-center rounded-full border-none transition",
    "disabled:pointer-events-none disabled:cursor-not-allowed",
    "focus-within:ring-primary-600/24 focus-within:ring-3 focus-visible:outline-hidden",
    "text-primary",

    // Checked + Unchecked - Inner border
    "before:absolute before:inset-0 before:rounded-full before:transition",

    // Checked State
    // Checked - Background
    "data-[state=checked]:bg-primary-600 data-[state=checked]:hover:bg-primary-700",

    // Checked - Radial gradient
    "data-[state=checked]:after:absolute data-[state=checked]:after:inset-px data-[state=checked]:after:rounded-[calc(theme(borderRadius.full)-1px)]",
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
    "data-[state=checked]:disabled:shadow-[inset_0_1px_2px_--theme(--color-neutral-900/6%)]",

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
        sm: "size-4",
        md: "size-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
)

const RadioGroupItem = React.forwardRef<RadioGroupItemRef, RadioGroupItemProps>(({ className, ...props }, ref) => {
  const { size } = useRadio()

  return (
    <RadioGroupPrimitive.Item ref={ref} className={cn(radioGroupItemVariants({ size }), className)} {...props}>
      <RadioGroupIndicator size={size} />
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName
// #endregion RadioGroupItem

// #region RadioGroupIndicator
type RadioGroupIndicatorRef = React.ComponentRef<typeof RadioGroupPrimitive.Indicator>

type RadioGroupIndicatorVariantProps = VariantProps<typeof radioGroupIndicatorVariants>
type RadioGroupIndicatorBaseProps = {} & RadioGroupIndicatorVariantProps
type RadioGroupIndicatorProps = RadioGroupIndicatorBaseProps & React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Indicator>

const radioGroupIndicatorVariants = cva(
  cn(
    "pointer-events-none flex aspect-square rounded-full bg-white",
    "shadow-[0_1px_2px_0_--theme(--color-neutral-900/12%),inset_0_-1px_0.5px_--theme(--color-neutral-900/12%)]",
    "data-disabled:shadow-[0_1px_2px_0_--theme(--color-neutral-900/12%),inset_0_-1px_0.5px_--theme(--color-neutral-900/5%)]",
  ),
  {
    variants: {
      size: {
        sm: "size-2",
        md: "size-2.5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
)

const RadioGroupIndicator = React.forwardRef<RadioGroupIndicatorRef, RadioGroupIndicatorProps>(({ className, ...props }, ref) => {
  const { size } = useRadio()

  return <RadioGroupPrimitive.Indicator ref={ref} className={cn(radioGroupIndicatorVariants({ size }), className)} {...props} />
})
RadioGroupIndicator.displayName = RadioGroupPrimitive.Indicator.displayName
// #endregion RadioGroupIndicator

const Root = RadioGroup
const Item = RadioGroupItem
const Indicator = RadioGroupIndicator

export { Root, Item, Indicator }
export { RadioGroup, RadioGroupItem, RadioGroupIndicator }
export type { RadioGroupRootProps, RadioGroupItemProps, RadioGroupIndicatorProps }
export { radioGroupRootVariants, radioGroupItemVariants, radioGroupIndicatorVariants }
