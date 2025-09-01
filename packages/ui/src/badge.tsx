import type { VariantProps } from "class-variance-authority"
import type { LucideProps } from "lucide-react"
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { Circle } from "lucide-react"

import { cn } from "@acme/ui/lib/utils"

// #region Badge
type BadgeRef = HTMLDivElement

type BadgeVariantProps = VariantProps<typeof badgeVariants>
type BadgeBaseProps = {} & BadgeVariantProps
type BadgeProps = BadgeBaseProps & React.HTMLAttributes<HTMLDivElement>

const badgeVariants = cva("flex w-fit items-center rounded-[5px] border font-medium", {
  variants: {
    variant: {
      transparent: "border-neutral-100 bg-transparent text-neutral-600",
      error: "border-error-100 bg-error-50 text-error-600",
      primary: "border-primary-100 bg-primary-50 text-primary-600",
      success: "border-success-100 bg-success-50 text-success-600",
      warning: "border-warning-100 bg-warning-50 text-warning-600",
    },
    size: {
      sm: "h-5 px-1.5 text-xs",
      md: "h-6 px-1.5 text-sm",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
})

const Badge = React.forwardRef<BadgeRef, BadgeProps>(({ size, variant, className, ...props }, ref) => {
  const renderChildren = (children: React.ReactNode) => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        switch (child.type) {
          case BadgeIcon:
            return React.cloneElement(child, { size } as BadgeIconProps)
          case BadgeDot:
            return React.cloneElement(child, { size } as BadgeDotProps)
          case BadgeLabel:
            return React.cloneElement(child, undefined)

          default:
            return child
        }
      }
      return child
    })
  }

  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} ref={ref}>
      {renderChildren(props.children)}
    </div>
  )
})
Badge.displayName = "Badge"
// #endregion Badge

// #region BadgeLabel
type BadgeLabelRef = HTMLSpanElement

type BadgeLabelVariantProps = VariantProps<typeof badgeLabelVariants>
type BadgeLabelBaseProps = {} & BadgeLabelVariantProps
type BadgeLabelProps = BadgeLabelBaseProps & React.HTMLAttributes<HTMLSpanElement>

const badgeLabelVariants = cva()

const BadgeLabel = React.forwardRef<BadgeLabelRef, BadgeLabelProps>(({ className, children, ...props }, forwardedRef) => {
  return (
    <span className={className} {...props} ref={forwardedRef}>
      {children}
    </span>
  )
})
BadgeLabel.displayName = "BadgeLabel"
// #endregion BadgeLabel

// #region BadgeIcon
type BadgeIconRef = React.ComponentRef<typeof Slot>

type BadgeIconVariantProps = VariantProps<typeof badgeIconVariants>
type BadgeIconBaseProps = {} & BadgeIconVariantProps
type BadgeIconProps = BadgeIconBaseProps & React.ComponentPropsWithoutRef<typeof Slot>

const badgeIconVariants = cva("shrink-0 stroke-[1.5px]", {
  variants: {
    size: {
      sm: "size-3.5",
      md: "size-4",
    },
    position: {
      start: "mr-1",
      end: "ml-1",
    },
  },
  defaultVariants: {
    size: "md",
    position: "start",
  },
})

const BadgeIcon = React.forwardRef<BadgeIconRef, BadgeIconProps>(({ size, position, className, children, ...props }, ref) => (
  <Slot ref={ref} id="badge-icon" aria-hidden className={cn(badgeIconVariants({ size, position }), className)} {...props}>
    {children}
  </Slot>
))
BadgeIcon.displayName = "BadgeIcon"
// #endregion BadgeIcon

// #region BadgeDot
type BadgeDotRef = SVGSVGElement

type BadgeDotVariantProps = VariantProps<typeof badgeDotVariants>
type BadgeDotBaseProps = {} & BadgeDotVariantProps
type BadgeDotProps = BadgeDotBaseProps & LucideProps

const badgeDotVariants = cva("shrink-0 fill-current stroke-none", {
  variants: {
    size: {
      sm: "mr-1 size-1",
      md: "mr-1.5 size-2",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

const BadgeDot = React.forwardRef<BadgeDotRef, BadgeDotProps>(({ size, ...props }, ref) => {
  return <Circle aria-hidden className={cn(badgeDotVariants({ size }), "")} {...props} ref={ref} />
})
BadgeDot.displayName = "BadgeDot"
// #endregion BadgeDot

const Root = Badge
const Icon = BadgeIcon
const Dot = BadgeDot
const Label = BadgeLabel

export { Root, Icon, Dot, Label }
export { Badge, BadgeIcon, BadgeDot, BadgeLabel }
export type { BadgeProps, BadgeIconProps, BadgeDotProps, BadgeLabelProps }
export { badgeVariants, badgeLabelVariants, badgeIconVariants, badgeDotVariants }
