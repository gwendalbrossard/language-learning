import type { VariantProps } from "class-variance-authority"
import type { TextInputProps } from "react-native"
import * as React from "react"
import { cva } from "class-variance-authority"
import { TextInput } from "react-native"

import { cn } from "~/utils/utils"

type InputRef = React.ComponentRef<typeof TextInput>
export type InputVariantProps = VariantProps<typeof inputClasses>
type InputBaseProps = { invalid?: boolean } & InputVariantProps
export type InputProps = InputBaseProps & TextInputProps

export const inputClasses = cva(
  cn(
    "flex flex-row items-center bg-white text-base",
    "border",
    "shadow-xs",
    "disabled:border-neutral-200 disabled:bg-neutral-50",
    "placeholder:text-neutral-400",
    "web:focus-visible:outline-none",
  ),
  {
    variants: {
      size: {
        xxs: "h-8 rounded-md px-2.5 text-sm",
        xs: "h-9 rounded-lg px-3 text-sm",
        sm: "h-10 rounded-lg px-3.5 text-sm",
        md: "h-11 rounded-xl px-4 text-sm",
        lg: "h-12 rounded-xl px-5 text-base",
        xl: "h-14 rounded-xl px-6 text-lg",
      },
      invalid: {
        true: cn("border-red-600"),
        false: cn("border-neutral-200"),
      },
    },
    defaultVariants: {
      size: "lg",
      invalid: false,
    },
  },
)

const Input = React.forwardRef<InputRef, InputProps>(({ size, invalid, className, placeholderClassName, ...props }, ref) => {
  return (
    <TextInput
      ref={ref}
      className={cn(inputClasses({ size: size, invalid: invalid }), props.editable === false && "web:cursor-not-allowed opacity-50", className)}
      placeholderClassName={cn("text-neutral-400", placeholderClassName)}
      {...props}
    />
  )
})

Input.displayName = "Input"

export { Input }
