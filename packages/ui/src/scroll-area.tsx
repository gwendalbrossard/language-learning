"use client"

import type { VariantProps } from "class-variance-authority"
import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { cva } from "class-variance-authority"

import { cn } from "@acme/ui/lib/utils"

// #region ScrollArea
type ScrollAreaRef = React.ComponentRef<typeof ScrollAreaPrimitive.Root>

type ScrollAreaVariantProps = VariantProps<typeof scrollAreaVariants>
type ScrollAreaBaseProps = {} & ScrollAreaVariantProps
type ScrollAreaProps = ScrollAreaBaseProps & React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>

const scrollAreaVariants = cva("relative overflow-hidden")

const ScrollArea = React.forwardRef<ScrollAreaRef, ScrollAreaProps>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root ref={ref} className={cn(scrollAreaVariants(), className)} {...props}>
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">{children}</ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName
// #endregion ScrollArea

// #region ScrollBar
type ScrollBarRef = React.ComponentRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>

type ScrollBarVariantProps = VariantProps<typeof scrollBarVariants>
type ScrollBarBaseProps = {} & ScrollBarVariantProps
type ScrollBarProps = ScrollBarBaseProps & React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>

const scrollBarVariants = cva("flex touch-none transition-colors select-none", {
  variants: {
    orientation: {
      vertical: "mr-0.5 h-full w-2.5 border-l border-l-transparent px-px py-1",
      horizontal: "mb-0.5 h-2.5 flex-col border-t border-t-transparent px-1 py-px",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
})
const ScrollBar = React.forwardRef<ScrollBarRef, ScrollBarProps>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(scrollBarVariants({ orientation }), className)}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-neutral-200 transition-colors hover:bg-neutral-300" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName
// #endregion ScrollBar

export { ScrollArea, ScrollBar }
export type { ScrollAreaProps, ScrollBarProps }
export { scrollAreaVariants, scrollBarVariants }
