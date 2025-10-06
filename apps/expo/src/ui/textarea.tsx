import type { VariantProps } from "class-variance-authority"
import type { TextInputProps } from "react-native"
import * as React from "react"
import { cva } from "class-variance-authority"
import { TextInput } from "react-native"

import { cn } from "~/utils/utils"

type TextareaRef = React.ComponentRef<typeof TextInput>
export type TextareaVariantProps = VariantProps<typeof textareaClasses>
type TextareaBaseProps = { invalid?: boolean } & TextareaVariantProps
export type TextareaProps = TextareaBaseProps & TextInputProps

export const textareaClasses = cva(
  cn(
    "flex flex-row items-center bg-white text-base",
    "border-2",
    "disabled:border-neutral-200 disabled:bg-neutral-50",
    "placeholder:text-neutral-400",
    "web:focus-visible:outline-none",
  ),
  {
    variants: {
      size: {
        xxs: "min-h-[32px] rounded-md px-2.5 py-1 text-sm",
        xs: "min-h-[36px] rounded-lg px-3 py-1.5 text-sm",
        sm: "min-h-[40px] rounded-lg px-3.5 py-2 text-sm",
        md: "min-h-[44px] rounded-xl px-4 py-2.5 text-sm",
        lg: "min-h-[48px] rounded-xl px-5 py-3 text-base",
        xl: "min-h-[56px] rounded-xl px-6 py-3.5 text-lg",
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

const Textarea = React.forwardRef<TextareaRef, TextareaProps>(
  ({ size, invalid, className, multiline = true, numberOfLines = 4, placeholderClassName, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(textareaClasses({ size, invalid }), props.editable === false && "web:cursor-not-allowed opacity-50", className)}
        placeholderClassName={cn("text-neutral-400", placeholderClassName)}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical="top"
        {...props}
      />
    )
  },
)

Textarea.displayName = "Textarea"

export { Textarea }
