"use client"

import type { VariantProps } from "class-variance-authority"
import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cva } from "class-variance-authority"

import { cn } from "@acme/ui/lib/utils"

type SeparatorRef = React.ComponentRef<typeof SeparatorPrimitive.Root>

type SeparatorVariantProps = VariantProps<typeof separatorVariants>
type SeparatorBaseProps = {} & SeparatorVariantProps
type SeparatorProps = SeparatorBaseProps & React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>

const separatorVariants = cva("shrink-0 bg-neutral-200")

const Separator = React.forwardRef<SeparatorRef, SeparatorProps>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(separatorVariants({}), orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className)}
    {...props}
  />
))
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
