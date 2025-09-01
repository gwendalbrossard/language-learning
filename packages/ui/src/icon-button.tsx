import type { VariantProps } from "class-variance-authority"
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@acme/ui/lib/utils"

// #region IconButton
type IconButtonRef = HTMLButtonElement

type IconButtonVariantProps = VariantProps<typeof iconButtonVariants>
type IconButtonBaseProps = { loading?: boolean; asChild?: boolean } & IconButtonVariantProps
type IconButtonProps = IconButtonBaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>

const iconButtonVariants = cva(
  cn(
    "relative flex cursor-pointer items-center justify-center transition",
    "rounded-lg",
    "disabled:pointer-events-none",
    "focus-visible:outline-hidden",
  ),
  {
    variants: {
      variant: {
        primary: cn(
          "border-none text-white",
          "bg-primary-600 hover:bg-primary-700",

          // Radial gradient
          "after:absolute after:inset-px after:rounded-[calc(var(--radius-lg)-1px)]",
          "after:bg-[radial-gradient(100%_100%_at_50%_0%,--theme(--color-white/16%)_0%,--theme(--color-white/0%)_100%)]",

          // Serves as the inner border
          "before:absolute before:inset-0 before:rounded-lg before:transition",
          "before:shadow-[inset_0_0_0_1px_--theme(--color-primary-600/100%)]",
          "hover:before:shadow-[inset_0_0_0_1px_--theme(--color-primary-700/100%)]",

          // 1st shadow: Adds depth around the button
          // 2nd shadow: Adds a small white line at the top for depth
          // 3rd shadow: Adds a small black line at the bottom for depth
          "shadow-[--theme(--shadow-xs),inset_0_1px_0.5px_0.5px_--theme(--color-white/44%),inset_0_-1px_2px_--theme(--color-primary-800/50%)]",

          // Disabled state
          "disabled:bg-primary-100",
          "disabled:shadow-[var(--shadow-xs),inset_0_1px_0.5px_0.5px_--theme(--color-primary-50/55%)]",
          "disabled:before:shadow-[inset_0_0_0_1px_--theme(--color-primary-200/100%)]",

          // Focused state
          "focus-within:ring-primary-600/24 focus-within:ring-3",
        ),
        secondary: cn(
          "border-none text-neutral-900",
          "bg-white hover:bg-neutral-50",

          // 1st shadow: Adds depth around the button
          // 2nd shadow: Inner border
          // 3rd shadow: Adds a small black line at the bottom for depth
          "shadow-[--theme(--shadow-xs),inset_0_0_0_1px_--theme(--color-neutral-200/100%),inset_0_-1px_2px_--theme(--color-neutral-900/12%)]",

          // Disabled state
          "disabled:text-neutral-300",

          // Focused state
          "focus-within:ring-3 focus-within:ring-neutral-900/4",
        ),
        tertiary: cn(
          "text-primary-600 border-none",
          "bg-primary-50 hover:bg-primary-100",

          // Radial gradient
          "after:absolute after:inset-px after:rounded-[calc(var(--radius-lg)-1px)]",
          "after:bg-[radial-gradient(100%_100%_at_50%_0%,--theme(--color-white/16%)_0%,--theme(--color-white/0%)_100%)]",

          // Serves as the inner border
          "before:absolute before:inset-0 before:rounded-lg before:transition",
          "before:shadow-[inset_0_0_0_1px_--theme(--color-primary-100/100%)]",
          "hover:before:shadow-[inset_0_0_0_1px_--theme(--color-primary-200/100%)]",

          // 1st shadow: Adds depth around the button
          // 2nd shadow: Adds a small white line at the top for depth
          // 3rd shadow: Adds a small black line at the bottom for depth
          "shadow-[--theme(--shadow-xs),inset_0_1px_0.5px_0.5px_--theme(--color-white/44%),inset_0_-1px_2px_--theme(--color-primary-200/24%)]",

          // Disabled state
          "disabled:bg-primary-50",
          "disabled:text-primary-200",
          "disabled:shadow-[var(--shadow-xs),inset_0_1px_0.5px_0.5px_--theme(--color-white/50%)]",
          "disabled:before:shadow-[inset_0_0_0_1px_--theme(--color-primary-100/100%)]",

          // Focused state
          "focus-within:ring-primary-100/50 focus-within:ring-3",
        ),
        destructive: cn(
          "border-none text-white",
          "bg-error-600 hover:bg-error-700",

          // Radial gradient
          "after:absolute after:inset-px after:rounded-[calc(var(--radius-lg)-1px)]",
          "after:bg-[radial-gradient(100%_100%_at_50%_0%,--theme(--color-white/16%)_0%,--theme(--color-white/0%)_100%)]",

          // Serves as the inner border
          "before:absolute before:inset-0 before:rounded-lg before:transition",
          "before:shadow-[inset_0_0_0_1px_--theme(--color-error-600/100%)]",
          "hover:before:shadow-[inset_0_0_0_1px_--theme(--color-error-700/100%)]",

          // 1st shadow: Adds depth around the button
          // 2nd shadow: Adds a small white line at the top for depth
          // 3rd shadow: Adds a small black line at the bottom for depth
          "shadow-[--theme(--shadow-xs),inset_0_1px_0.5px_0.5px_--theme(--color-white/44%),inset_0_-1px_2px_--theme(--color-error-800/24%)]",

          // Disabled state
          "disabled:bg-error-100",
          "disabled:shadow-[var(--shadow-xs),inset_0_1px_0.5px_0.5px_--theme(--color-error-50/55%)]",
          "disabled:before:shadow-[inset_0_0_0_1px_--theme(--color-error-200/100%)]",

          // Focused state
          "focus-within:ring-error-600/24 focus-within:ring-3",
        ),
        ghost: cn("border-none text-neutral-600", "hover:bg-neutral-100", "disabled:text-neutral-400"),
      },
      size: {
        xxs: "size-8",
        xs: "size-9",
        sm: "size-10",
        md: "size-11",
        lg: "size-12",
      },
      loading: {
        true: "text-transparent disabled:text-transparent",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "sm",
    },
  },
)

const IconButton = React.forwardRef<IconButtonRef, IconButtonProps>(
  ({ className, variant, size, loading, asChild = false, children, ...props }, ref) => {
    const disabled = props.disabled ?? loading

    const renderIconButtonChildren = (children: React.ReactNode) => {
      return React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          switch (child.type) {
            case IconButtonIcon:
              return React.cloneElement(child, { size, loading } as IconButtonIconProps)
            default:
              return child
          }
        }
        return child
      })
    }

    const renderSlotChildren = (children: React.ReactNode) => {
      if (!React.isValidElement(children)) return children

      return React.cloneElement(
        children,
        undefined,
        <>
          {loading && <IconButtonSpinner size={size} variant={variant} />}
          {renderIconButtonChildren((children as { props: { children: React.ReactNode } }).props.children)}
        </>,
      )
    }

    if (asChild) {
      return (
        <Slot disabled={disabled} className={cn(iconButtonVariants({ variant, size, loading }), className)} ref={ref} {...props}>
          {renderSlotChildren(children)}
        </Slot>
      )
    }

    return (
      <button disabled={disabled} className={cn(iconButtonVariants({ variant, size, loading }), className)} ref={ref} {...props}>
        {loading && <IconButtonSpinner size={size} variant={variant} />}
        {renderIconButtonChildren(children)}
      </button>
    )
  },
)
IconButton.displayName = "IconButton"
// #endregion IconButton

// #region IconButtonSpinner
type IconButtonSpinnerRef = SVGSVGElement

type IconButtonSpinnerVariantProps = VariantProps<typeof iconButtonSpinnerVariants>
type IconButtonSpinnerBaseProps = {} & IconButtonSpinnerVariantProps
type IconButtonSpinnerProps = IconButtonSpinnerBaseProps & React.HTMLAttributes<SVGSVGElement>

const iconButtonSpinnerVariants = cva("animate-spin stroke-[1.5px]", {
  variants: {
    variant: {
      primary: "text-white",
      secondary: "text-neutral-300",
      tertiary: "text-primary-200",
      destructive: "text-white",
      ghost: "text-neutral-600",
    },
    size: {
      xxs: "size-4",
      xs: "size-5",
      sm: "size-5",
      md: "size-5",
      lg: "size-6",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "sm",
  },
})

const IconButtonSpinner = React.forwardRef<IconButtonSpinnerRef, IconButtonSpinnerProps>(({ variant, size, className, ...props }, ref) => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
      <Loader2 className={cn(iconButtonSpinnerVariants({ variant, size }), className)} ref={ref} {...props} />
    </div>
  )
})
IconButtonSpinner.displayName = "IconButtonSpinner"
// #endregion IconButtonSpinner

// #region IconButtonIcon
type IconButtonIconRef = React.ComponentRef<typeof Slot>

type IconButtonIconVariantProps = VariantProps<typeof iconButtonIconVariants>
type IconButtonIconBaseProps = {} & IconButtonIconVariantProps
type IconButtonIconProps = IconButtonIconBaseProps & React.ComponentPropsWithoutRef<typeof Slot>

const iconButtonIconVariants = cva("shrink-0 stroke-[1.5px]", {
  variants: {
    size: {
      xxs: "size-4",
      xs: "size-5",
      sm: "size-5",
      md: "size-5",
      lg: "size-6",
    },
    loading: {
      true: "text-transparent",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

const IconButtonIcon = React.forwardRef<IconButtonIconRef, IconButtonIconProps>(({ size, loading, className, children, ...props }, ref) => {
  return (
    <Slot ref={ref} aria-hidden className={cn(iconButtonIconVariants({ size, loading }), className)} {...props}>
      {children}
    </Slot>
  )
})
IconButtonIcon.displayName = "IconButtonIcon"
// #endregion IconButtonIcon

const Root = IconButton
const Icon = IconButtonIcon
const Spinner = IconButtonSpinner

export { Root, Icon, Spinner }

export { IconButton, IconButtonIcon, IconButtonSpinner }
export type { IconButtonProps, IconButtonIconProps, IconButtonSpinnerProps }
export { iconButtonVariants, iconButtonIconVariants, iconButtonSpinnerVariants }
