import type { VariantProps } from "class-variance-authority"
import type { JSX } from "react"
import { forwardRef } from "react"
import { cva } from "class-variance-authority"

import { cn } from "@acme/ui/lib/utils"

type InputRef = HTMLInputElement

type InputVariantProps = VariantProps<typeof inputVariants>
type InputBaseProps = {} & InputVariantProps
type InputProps = InputBaseProps & Omit<JSX.IntrinsicElements["input"], "size">

const inputVariants = cva(
  cn(
    "peer flex w-full appearance-none rounded-lg bg-white transition focus-visible:outline-hidden",
    "border focus-within:ring-3",
    "shadow-[0_1px_2px_0_--theme(--color-neutral-900/6%)]",
    "disabled:pointer-events-none disabled:border-neutral-200 disabled:bg-neutral-50",
    "placeholder:text-neutral-400",
  ),
  {
    variants: {
      size: {
        xs: "px-[calc(--spacing(3)-1px)] py-[calc(--spacing(2)-1px)] text-sm",
        sm: "px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] text-sm",
        md: "px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(3)-1px)] text-sm",
        lg: "px-[calc(--spacing(4)-1px)] py-[calc(--spacing(3)-1px)] text-base",
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

const Input = forwardRef<InputRef, InputProps>(({ size, className, type, ...props }, ref) => {
  const invalid = props["aria-invalid"] === true

  return <input type={type} className={cn(inputVariants({ size, invalid }), className)} ref={ref} {...props} />
})
Input.displayName = "Input"

export { Input }
export type { InputProps }
export { inputVariants }
