import type { SlottableViewProps } from "@rn-primitives/types"
import type { VariantProps } from "class-variance-authority"
import type { LucideIcon } from "lucide-react-native"
import React from "react"
import { cva } from "class-variance-authority"
import { Text as RNText, View } from "react-native"

import { cn } from "~/utils/utils"

// #region Badge
type BadgeRef = View

type BadgeVariantProps = VariantProps<typeof badgeVariants>
type BadgeBaseProps = {} & BadgeVariantProps
type BadgeProps = BadgeBaseProps & SlottableViewProps

const badgeVariants = cva("flex w-fit flex-row items-center border", {
  variants: {
    variant: {
      white: "shadow-custom-xs border-neutral-300 bg-white",
      error: "border-error-200 bg-error-50",
      primary: "border-primary-200 bg-primary-50",
      success: "border-success-200 bg-success-50",
      warning: "border-warning-200 bg-warning-50",
      neutral: "border-neutral-200 bg-neutral-50",
      unset: "border-neutral-200 bg-neutral-50",
    },
    size: {
      sm: "h-[22px] gap-1 rounded-md px-1.5",
      md: "h-6 gap-1 rounded-md px-2",
      lg: "h-7 gap-1.5 rounded-lg px-2.5",
    },
  },
  defaultVariants: {
    variant: "white",
    size: "md",
  },
})

const Badge = React.forwardRef<BadgeRef, BadgeProps>(({ className, variant, size, children, ...props }, ref) => {
  const renderChildren = (children: React.ReactNode) => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        switch (child.type) {
          case BadgeText:
            return React.cloneElement(child, { size, variant } as BadgeTextProps)
          case BadgeIcon:
            return React.cloneElement(child, { size, variant } as BadgeIconProps)
          default:
            return child
        }
      }
      return child
    })
  }

  return (
    <View ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {renderChildren(children)}
    </View>
  )
})
Badge.displayName = "Badge"
// #endregion Badge

// #region BadgeText
type BadgeTextRef = React.ComponentRef<typeof RNText>
type BadgeTextProps = React.ComponentPropsWithoutRef<typeof RNText> & VariantProps<typeof badgeTextVariants>

const badgeTextVariants = cva("font-medium", {
  variants: {
    variant: {
      white: "text-neutral-700",
      error: "text-error-700",
      primary: "text-primary-700",
      success: "text-success-700",
      warning: "text-warning-700",
      neutral: "text-neutral-700",
      unset: "text-neutral-400",
    },
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-sm",
    },
  },
  defaultVariants: {
    variant: "white",
    size: "md",
  },
})

const BadgeText = React.forwardRef<BadgeTextRef, BadgeTextProps>(({ variant, size, className, ...props }, ref) => {
  return <RNText ref={ref} className={cn(badgeTextVariants({ variant, size }), className)} {...props} />
})
BadgeText.displayName = "BadgeText"
// #endregion BadgeText

// #region BadgeIcon
type BadgeIconVariantProps = VariantProps<typeof badgeIconVariants>
type BadgeIconBaseProps = { icon: LucideIcon } & BadgeIconVariantProps
type BadgeIconProps = BadgeIconBaseProps

const badgeIconVariants = cva("", {
  variants: {
    variant: {
      white: "",
      error: "",
      primary: "",
      success: "",
      warning: "",
      neutral: "",
      unset: "",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  defaultVariants: {
    variant: "white",
    size: "md",
  },
})

const BadgeIcon = ({ icon, variant, size, ...props }: BadgeIconProps) => {
  const color = {
    white: "#404040", // neutral-700
    error: "#B91C1C", // error-700
    primary: "#1D4ED8", // primary-700
    success: "#15803D", // success-700
    warning: "#B45309", // warning-700
    neutral: "#404040", // neutral-700
    unset: "#979FAD", // neutral-400
  }[variant ?? "white"]

  const iconSize = {
    sm: 12,
    md: 14,
    lg: 16,
  }[size ?? "md"]

  const Icon = icon
  return <Icon strokeWidth={1.7} size={iconSize} color={color} {...props} />
}
BadgeIcon.displayName = "BadgeIcon"
// #endregion BadgeIcon

const Root = Badge
const Text = BadgeText
const Icon = BadgeIcon

export { Root, Text, Icon }
export { Badge, BadgeText, BadgeIcon }
export { badgeTextVariants, badgeVariants, badgeIconVariants }
export type { BadgeProps, BadgeTextProps, BadgeIconProps }
