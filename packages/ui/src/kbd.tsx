import type { VariantProps } from "class-variance-authority"
import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@acme/ui/lib/utils"

// #region Kbd
type KbdRef = HTMLElement

type KbdVariantProps = VariantProps<typeof kbdVariants>
type KbdBaseProps = {} & KbdVariantProps
type KbdProps = KbdBaseProps & React.ComponentPropsWithoutRef<"kbd">

const kbdVariants = cva(
  cn(
    "inline-flex w-fit shrink-0 items-center justify-center rounded-[5px] font-sans font-medium tracking-wider text-neutral-400",
    "ring-1 ring-neutral-200 ring-inset",
  ),
  {
    variants: {
      variant: {
        default: "bg-white",
        neutral: "bg-neutral-50",
      },
      size: {
        sm: "h-4 min-w-4 px-1 text-[0.625rem] leading-4 shadow-[inset_0_-2.5px_1px_--theme(--color-neutral-900/8%)]",
        md: "h-5 min-w-5 px-1.5 text-xs leading-5 shadow-[inset_0_-3px_1px_--theme(--color-neutral-900/8%)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
)

const Kbd = React.forwardRef<KbdRef, KbdProps>(({ variant, size, className, children, ...props }, ref) => {
  return (
    <kbd ref={ref} className={cn(kbdVariants({ variant, size }), className)} {...props}>
      {children}
    </kbd>
  )
})
Kbd.displayName = "Kbd"
// #endregion Kbd

export { Kbd }
export type { KbdProps }
export { kbdVariants }
