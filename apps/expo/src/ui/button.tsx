import type { VariantProps } from "class-variance-authority"
import type { LucideIcon } from "lucide-react-native"
import type { ActivityIndicatorProps, PressableStateCallbackType } from "react-native"
import * as React from "react"
import { cva } from "class-variance-authority"
import { ActivityIndicator, Pressable, Text as RNText, View } from "react-native"

import { cn } from "~/utils/utils"

const buttonVariants = cva(cn("relative flex w-fit flex-row items-center justify-center border transition", "web:focus-visible:outline-none"), {
  variants: {
    variant: {
      primary: cn("shadow-custom-xs border-transparent bg-primary-600 active:bg-primary-700 disabled:bg-primary-100"),
      secondary: cn("shadow-custom-xs border-neutral-200 bg-white active:bg-neutral-50 disabled:text-neutral-300"),
      tertiary: "",
      destructive: cn("shadow-custom-xs border-transparent bg-error-600 active:bg-error-700 disabled:bg-error-100"),
      ghost: cn("border-transparent bg-white active:bg-neutral-100"),
      black: cn("shadow-custom-xs border-transparent bg-black active:opacity-90 disabled:opacity-50"),
    },
    size: {
      xxs: "h-8 gap-1.5 rounded-md px-2.5",
      xs: "h-9 gap-1.5 rounded-lg px-3",
      sm: "h-10 gap-1.5 rounded-lg px-3.5",
      md: "h-11 gap-1.5 rounded-xl px-4",
      lg: "h-12 gap-1.5 rounded-xl px-5",
      xl: "h-14 gap-2 rounded-xl px-6",
    },
    loading: {
      true: "",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "lg",
  },
})

type ButtonRef = React.ComponentRef<typeof Pressable>
type ButtonVariantProps = VariantProps<typeof buttonVariants>
type ButtonBaseProps = { loading?: boolean } & ButtonVariantProps
type ButtonProps = ButtonBaseProps & React.ComponentPropsWithoutRef<typeof Pressable>

const Button = React.forwardRef<ButtonRef, ButtonProps>(({ className, variant, size, loading, children, ...props }, ref) => {
  const disabled = props.disabled ?? loading

  const renderButtonChildren = (children: React.ReactNode | ((state: PressableStateCallbackType) => React.ReactNode)) => {
    if (typeof children === "function") {
      throw new Error("Button children cannot be a function")
    }

    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        switch (child.type) {
          case ButtonText:
            return React.cloneElement(child, { variant, size, loading, disabled } as ButtonTextProps)
          case ButtonIcon:
            return React.cloneElement(child, { variant, size, loading, disabled } as ButtonIconProps)
          default:
            return child
        }
      }
      return child
    })
  }

  return (
    <Pressable role="button" disabled={disabled} className={cn(buttonVariants({ variant, size, loading }), className)} ref={ref} {...props}>
      {loading && <ButtonSpinner variant={variant} />}
      {renderButtonChildren(children)}
    </Pressable>
  )
})
Button.displayName = "Button"

const buttonTextVariants = cva("web:pointer-events-none web:whitespace-nowrap font-medium transition-all", {
  variants: {
    variant: {
      primary: "text-white",
      secondary: "text-neutral-900 disabled:text-neutral-300",
      tertiary: "",
      destructive: "text-white",
      ghost: "text-neutral-600 disabled:text-neutral-400",
      black: "text-white",
    },
    size: {
      xxs: "text-sm",
      xs: "text-sm",
      sm: "text-sm",
      md: "text-sm",
      lg: "text-base",
      xl: "text-lg",
    },
    loading: {
      true: "text-transparent",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "lg",
  },
})

type ButtonTextRef = React.ComponentRef<typeof RNText>
type ButtonTextProps = React.ComponentPropsWithoutRef<typeof RNText> & VariantProps<typeof buttonTextVariants>

const ButtonText = React.forwardRef<ButtonTextRef, ButtonTextProps>(({ variant, size, className, disabled, loading, ...props }, ref) => {
  return <RNText disabled={disabled} ref={ref} className={cn(buttonTextVariants({ variant, size, loading }), className)} {...props} />
})
ButtonText.displayName = "ButtonText"

// #region ButtonSpinner
type ButtonSpinnerRef = React.ComponentRef<typeof ActivityIndicator>

type ButtonSpinnerVariantProps = VariantProps<typeof buttonSpinnerVariants>
type ButtonSpinnerBaseProps = {} & ButtonSpinnerVariantProps
type ButtonSpinnerProps = ButtonSpinnerBaseProps & ActivityIndicatorProps

const buttonSpinnerVariants = cva("", {
  variants: {
    variant: {
      primary: "",
      secondary: "",
      tertiary: "",
      destructive: "",
      ghost: "",
      black: "",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
})

const ButtonSpinner = React.forwardRef<ButtonSpinnerRef, ButtonSpinnerProps>(({ variant, ...props }, ref) => {
  const color = {
    primary: "#FFFFFF",
    secondary: "#171717", // neutral-900
    tertiary: "#E2E8F0", // primary-200
    destructive: "#FFFFFF",
    ghost: "#A3A3A3", // neutral-400
    black: "#FFFFFF",
  }[variant ?? "primary"]

  return (
    <View className="absolute bottom-0 left-0 right-0 top-0 items-center justify-center">
      <ActivityIndicator color={color} size="small" ref={ref} {...props} />
    </View>
  )
})
ButtonSpinner.displayName = "ButtonSpinner"
// #endregion ButtonSpinner

// #region ButtonIcon
type ButtonIconVariantProps = VariantProps<typeof buttonIconVariants>
type ButtonIconBaseProps = { icon: LucideIcon; disabled?: boolean } & ButtonIconVariantProps
type ButtonIconProps = ButtonIconBaseProps

const buttonIconVariants = cva("", {
  variants: {
    variant: {
      primary: "",
      secondary: "",
      tertiary: "",
      destructive: "",
      ghost: "",
      black: "",
    },
    size: {
      xxs: "",
      xs: "",
      sm: "",
      md: "",
      lg: "",
      xl: "",
    },
    loading: {
      true: "",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
})

const ButtonIcon = ({ icon, variant, size, loading, disabled, ...props }: ButtonIconProps) => {
  const color = {
    primary: disabled ? "#FFFFFF" : "#FFFFFF", // white : white
    secondary: disabled ? "#C9D0DB" : "#171717", // neutral-300 : neutral-900
    tertiary: disabled ? "#E2E8F0" : "#E2E8F0", // primary-200 : primary-200
    destructive: disabled ? "#FFFFFF" : "#FFFFFF", // white : white
    ghost: disabled ? "#979FAD" : "#A3A3A3", // neutral-400 : neutral-600
    black: disabled ? "#FFFFFF" : "#FFFFFF", // white : white
  }[variant ?? "primary"]

  const iconSize = {
    xxs: 16,
    xs: 16,
    sm: 16,
    md: 16,
    lg: 20,
    xl: 24,
  }[size ?? "md"]

  const Icon = icon
  return <Icon strokeWidth={1.7} size={iconSize} color={loading ? "transparent" : color} {...props} />
}
ButtonIcon.displayName = "ButtonIcon"
// #endregion ButtonIcon

const Root = Button
const Text = ButtonText
const Spinner = ButtonSpinner
const Icon = ButtonIcon

export { Root, Text, Spinner, Icon }
export { Button, ButtonText, ButtonSpinner, ButtonIcon }
export type { ButtonProps, ButtonTextProps, ButtonSpinnerProps, ButtonIconProps }
export { buttonVariants, buttonTextVariants, buttonSpinnerVariants, buttonIconVariants }
