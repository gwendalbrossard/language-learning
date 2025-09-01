import type { VariantProps } from "class-variance-authority"
import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@acme/ui/lib/utils"

type TextAreaRef = HTMLTextAreaElement

type TextAreaVariantProps = VariantProps<typeof textAreaVariants>
type TextAreaBaseProps = {} & TextAreaVariantProps
type TextAreaProps = TextAreaBaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>

const textAreaVariants = cva(
  cn(
    "peer w-full appearance-none rounded-lg bg-white transition focus-visible:outline-hidden",
    "border focus-within:ring-3",
    "shadow-[0_1px_2px_0_--theme(--color-neutral-900/6%)]",
    "disabled:pointer-events-none disabled:border-neutral-200 disabled:bg-neutral-50",
    "placeholder:text-neutral-400",
  ),
  {
    variants: {
      size: {
        xs: "min-h-[36px] px-[calc(--spacing(3)-1px)] py-[calc(--spacing(2)-1px)] text-sm",
        sm: "min-h-[80px] px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] text-sm",
        md: "min-h-[44px] px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(3)-1px)] text-sm",
        lg: "min-h-[48px] px-[calc(--spacing(4)-1px)] py-[calc(--spacing(3)-1px)] text-base",
      },
      invalid: {
        true: cn(
          "border-error-600",
          "focus-within:border-error-600 focus-within:ring-error-600/24",
          "hover:border-error-600 hover:ring-error-600/24",
        ),
        false: cn("border-neutral-200", "focus-within:border-primary-500 focus-within:ring-primary-600/24", "hover:border-primary-500"),
      },
    },
    defaultVariants: {
      size: "md",
      invalid: false,
    },
  },
)
const TextArea = React.forwardRef<TextAreaRef, TextAreaProps>(({ size, className, ...props }, ref) => {
  const invalid = props["aria-invalid"] === true
  return <textarea className={cn(textAreaVariants({ size, invalid }), className)} ref={ref} {...props} />
})
TextArea.displayName = "TextArea"

export { TextArea }
export type { TextAreaProps }
export { textAreaVariants }
