"use client"

import type { VariantProps } from "class-variance-authority"
import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cva } from "class-variance-authority"

import { cn } from "@acme/ui/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

// #region TooltipContent
type TooltipContentRef = React.ComponentRef<typeof TooltipPrimitive.Content>

type TooltipContentVariantProps = VariantProps<typeof tooltipContentVariants>
type TooltipContentBaseProps = {} & TooltipContentVariantProps
type TooltipContentProps = TooltipContentBaseProps & React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>

const tooltipContentVariants = cva(
  cn(
    "relative z-50 flex w-fit max-w-sm flex-col gap-1 rounded-lg bg-linear-to-b from-neutral-800 from-50% to-neutral-900 px-3 py-2",

    // Animations
    "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",

    // Serves as the inner border
    "before:absolute before:inset-0 before:rounded-lg before:transition",
    "before:shadow-[inset_0_0_0_1px_--theme(--color-neutral-700/100%)]",

    // 1st shadow: Adds depth around the button
    // 2nd shadow: Adds a small white line at the top for depth
    // 3rd shadow: Adds a small black line at the bottom for depth
    "shadow-[0_8px_16px_--theme(--color-neutral-900/24%),inset_0_1px_0.5px_0.5px_--theme(--color-white/44%),inset_0_-1px_2px_1px_--theme(--color-neutral-900/75%)]",
  ),
)

const TooltipContent = React.forwardRef<TooltipContentRef, TooltipContentProps>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content ref={ref} sideOffset={sideOffset} className={cn(tooltipContentVariants({}), className)} {...props}>
    {props.children}
  </TooltipPrimitive.Content>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName
// #endregion TooltipContent

// #region TooltipTitle
type TooltipTitleRef = HTMLParagraphElement

type TooltipTitleVariantProps = VariantProps<typeof tooltipTitleVariants>
type TooltipTitleBaseProps = {} & TooltipTitleVariantProps
type TooltipTitleProps = TooltipTitleBaseProps & React.HTMLAttributes<HTMLParagraphElement>

const tooltipTitleVariants = cva("text-xs font-medium text-white")

const TooltipTitle = React.forwardRef<TooltipTitleRef, TooltipTitleProps>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn(tooltipTitleVariants({}), className)} {...props}>
    {props.children}
  </p>
))
TooltipTitle.displayName = "TooltipTitle"
// #endregion TooltipTitle

// #region TooltipDescription
type TooltipDescriptionRef = HTMLParagraphElement

type TooltipDescriptionVariantProps = VariantProps<typeof tooltipDescriptionVariants>
type TooltipDescriptionBaseProps = {} & TooltipDescriptionVariantProps
type TooltipDescriptionProps = TooltipDescriptionBaseProps & React.HTMLAttributes<HTMLParagraphElement>

const tooltipDescriptionVariants = cva("text-xs text-neutral-300")

const TooltipDescription = React.forwardRef<TooltipDescriptionRef, TooltipDescriptionProps>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn(tooltipDescriptionVariants({}), className)} {...props}>
    {props.children}
  </p>
))
TooltipDescription.displayName = "TooltipDescription"
// #endregion TooltipDescription

// #region TooltipArrow
type TooltipArrowRef = React.ComponentRef<typeof TooltipPrimitive.Arrow>

type TooltipArrowVariantProps = VariantProps<typeof tooltipArrowVariants>
type TooltipArrowBaseProps = {} & TooltipArrowVariantProps
type TooltipArrowProps = TooltipArrowBaseProps & React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>

const tooltipArrowVariants = cva(cn("-mt-px"))

const TooltipArrow = React.forwardRef<TooltipArrowRef, TooltipArrowProps>(({ className, ...props }, ref) => (
  <TooltipPrimitive.Arrow ref={ref} className={cn(tooltipArrowVariants({}), className)} asChild {...props}>
    <svg width="14" height="5" viewBox="0 0 14 5" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.6704 0L7.5999 4.55C7.24434 4.81667 6.75545 4.81667 6.3999 4.55L0.330078 0H13.6704Z" fill="#1D2736" />
      <path d="M13.6704 0L7.5999 4.55C7.24434 4.81667 6.75545 4.81667 6.3999 4.55L0.330078 0H13.6704Z" fill="#0E1524" fillOpacity="0.75" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.6704 0H0.330078L6.3999 4.55C6.75545 4.81667 7.24434 4.81667 7.5999 4.55L13.6704 0ZM11.9997 0H1.99971L6.99971 3.75L11.9997 0Z"
        fill="#1D2736"
      />
    </svg>
  </TooltipPrimitive.Arrow>
))
TooltipArrow.displayName = TooltipPrimitive.Arrow.displayName
// #endregion TooltipArrow

const Root = Tooltip
const Trigger = TooltipTrigger
const Content = TooltipContent
const Title = TooltipTitle
const Description = TooltipDescription
const Arrow = TooltipArrow

export { Root, Trigger, Content, Title, Description, Arrow }

export { Tooltip, TooltipArrow, TooltipTitle, TooltipDescription, TooltipTrigger, TooltipContent, TooltipProvider }
export type { TooltipArrowProps, TooltipTitleProps, TooltipDescriptionProps, TooltipContentProps }
export type { TooltipProps, TooltipTriggerProps } from "@radix-ui/react-tooltip"
export { tooltipContentVariants, tooltipTitleVariants, tooltipDescriptionVariants, tooltipArrowVariants }
