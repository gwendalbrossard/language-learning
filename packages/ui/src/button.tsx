import type { VariantProps } from "class-variance-authority"
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@acme/ui/lib/utils"

// #region Button
type ButtonRef = HTMLButtonElement

type ButtonVariantProps = VariantProps<typeof buttonVariants>
type ButtonBaseProps = { loading?: boolean; asChild?: boolean } & ButtonVariantProps
type ButtonProps = ButtonBaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>

const buttonVariants = cva(
  cn(
    "relative flex w-fit cursor-pointer items-center justify-center whitespace-nowrap transition",
    "rounded-lg",
    "font-medium",
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
        xxs: "h-8 px-2.5 text-sm",
        xs: "h-9 px-3 text-sm",
        sm: "h-10 px-3.5 text-sm",
        md: "h-11 px-4 text-sm",
        lg: "h-12 px-5 text-base",
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

const Button = React.forwardRef<ButtonRef, ButtonProps>(({ className, variant, size, loading, asChild = false, children, ...props }, ref) => {
  const disabled = props.disabled ?? loading

  const renderButtonChildren = (children: React.ReactNode) => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        switch (child.type) {
          case ButtonIcon:
            return React.cloneElement(child, { size, loading } as ButtonIconProps)
          case ButtonLabel:
            return React.cloneElement(child, undefined)
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
        {loading && <ButtonSpinner size={size} variant={variant} />}
        {renderButtonChildren((children as { props: { children: React.ReactNode } }).props.children)}
      </>,
    )
  }

  if (asChild) {
    return (
      <Slot disabled={disabled} className={cn(buttonVariants({ variant, size, loading }), className)} ref={ref} {...props}>
        {renderSlotChildren(children)}
      </Slot>
    )
  }

  return (
    <button disabled={disabled} className={cn(buttonVariants({ variant, size, loading }), className)} ref={ref} {...props}>
      {loading && <ButtonSpinner size={size} variant={variant} />}
      {renderButtonChildren(children)}
    </button>
  )
})
Button.displayName = "Button"
// #endregion Button

// #region ButtonLabel
type ButtonLabelRef = HTMLSpanElement

type ButtonLabelVariantProps = VariantProps<typeof buttonLabelVariants>
type ButtonLabelBaseProps = {} & ButtonLabelVariantProps
type ButtonLabelProps = ButtonLabelBaseProps & React.ComponentPropsWithoutRef<"span">

const buttonLabelVariants = cva()

const ButtonLabel = React.forwardRef<ButtonLabelRef, ButtonLabelProps>(({ className, children, ...props }, forwardedRef) => {
  return (
    <span className={cn(buttonLabelVariants(), className)} {...props} ref={forwardedRef}>
      {children}
    </span>
  )
})
ButtonLabel.displayName = "ButtonLabel"
// #endregion ButtonLabel

// #region ButtonIcon
type ButtonIconRef = React.ComponentRef<typeof Slot>

type ButtonIconVariantProps = VariantProps<typeof buttonIconVariants>
type ButtonIconBaseProps = {} & ButtonIconVariantProps
type ButtonIconProps = ButtonIconBaseProps & React.ComponentPropsWithoutRef<typeof Slot>

const buttonIconVariants = cva("shrink-0 stroke-[1.5px] transition", {
  variants: {
    size: {
      xxs: "size-4",
      xs: "size-4",
      sm: "size-4",
      md: "size-4",
      lg: "size-5",
    },
    position: {
      start: "",
      end: "",
    },
    loading: {
      true: "text-transparent",
    },
  },
  defaultVariants: {
    size: "md",
    position: "start",
  },
  compoundVariants: [
    {
      size: "xxs",
      position: "start",
      className: "mr-1.5",
    },
    {
      size: "xs",
      position: "start",
      className: "mr-1.5",
    },
    {
      size: "sm",
      position: "start",
      className: "mr-1.5",
    },
    {
      size: "md",
      position: "start",
      className: "mr-1.5",
    },
    {
      size: "lg",
      position: "start",
      className: "mr-2",
    },
    {
      size: "xxs",
      position: "end",
      className: "ml-1.5",
    },
    {
      size: "xs",
      position: "end",
      className: "ml-1.5",
    },
    {
      size: "sm",
      position: "end",
      className: "ml-1.5",
    },
    {
      size: "md",
      position: "end",
      className: "ml-1.5",
    },
    {
      size: "lg",
      position: "end",
      className: "ml-2",
    },
  ],
})

const ButtonIcon = React.forwardRef<ButtonIconRef, ButtonIconProps>(({ size, position, loading, className, children, ...props }, ref) => {
  return (
    <Slot ref={ref} aria-hidden className={cn(buttonIconVariants({ size, position, loading }), className)} {...props}>
      {children}
    </Slot>
  )
})
ButtonIcon.displayName = "ButtonIcon"
// #endregion ButtonIcon

// #region ButtonSpinner
type ButtonSpinnerRef = SVGSVGElement

type ButtonSpinnerVariantProps = VariantProps<typeof buttonSpinnerVariants>
type ButtonSpinnerBaseProps = {} & ButtonSpinnerVariantProps
type ButtonSpinnerProps = ButtonSpinnerBaseProps & React.HTMLAttributes<SVGSVGElement>

const buttonSpinnerVariants = cva("animate-spin", {
  variants: {
    variant: {
      primary: "text-white",
      secondary: "text-neutral-300",
      tertiary: "text-primary-200",
      destructive: "text-white",
      ghost: "text-neutral-400",
    },
    size: {
      xxs: "size-5",
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

const ButtonSpinner = React.forwardRef<ButtonSpinnerRef, ButtonSpinnerProps>(({ variant, size, className, ...props }, ref) => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
      <Loader2 strokeWidth={1.5} className={cn(buttonSpinnerVariants({ variant, size }), className)} ref={ref} {...props} />
    </div>
  )
})
ButtonSpinner.displayName = "ButtonSpinner"
// #endregion ButtonSpinner

const Root = Button
const Label = ButtonLabel
const Icon = ButtonIcon
const Spinner = ButtonSpinner

export { Root, Label, Icon, Spinner }
export { Button, ButtonLabel, ButtonIcon, ButtonSpinner }
export type { ButtonProps, ButtonLabelProps, ButtonIconProps, ButtonSpinnerProps }
export { buttonVariants, buttonLabelVariants, buttonIconVariants, buttonSpinnerVariants }
