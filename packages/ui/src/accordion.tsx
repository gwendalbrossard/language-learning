"use client"

import type { VariantProps } from "class-variance-authority"
import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import { cva } from "class-variance-authority"

import { cn } from "@acme/ui/lib/utils"

// #region Accordion
const Accordion = AccordionPrimitive.Root

type AccordionVariantProps = VariantProps<typeof accordionVariants>
type AccordionBaseProps = {} & AccordionVariantProps
type AccordionProps = AccordionBaseProps & React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>

const accordionVariants = cva("")
// #endregion Root

// #region Item
type AccordionItemRef = React.ComponentRef<typeof AccordionPrimitive.Item>

type AccordionItemVariantProps = VariantProps<typeof accordionItemVariants>
type AccordionItemBaseProps = {} & AccordionItemVariantProps
type AccordionItemProps = AccordionItemBaseProps & React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>

const accordionItemVariants = cva("border-b border-neutral-200 py-8 last:border-none")

const AccordionItem = React.forwardRef<AccordionItemRef, AccordionItemProps>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn(accordionItemVariants(), className)} {...props} />
))
AccordionItem.displayName = "AccordionItem"
// #endregion AccordionItem

// #region AccordionTrigger
type AccordionTriggerRef = React.ComponentRef<typeof AccordionPrimitive.Trigger>

type AccordionTriggerVariantProps = VariantProps<typeof accordionTriggerVariants>
type AccordionTriggerBaseProps = {} & AccordionTriggerVariantProps
type AccordionTriggerProps = AccordionTriggerBaseProps & React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>

const accordionTriggerVariants = cva(
  "flex flex-1 items-center justify-between gap-6 text-lg font-medium transition-all [&[data-state=open]>svg]:rotate-180",
)

const AccordionTrigger = React.forwardRef<AccordionTriggerRef, AccordionTriggerProps>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger ref={ref} className={cn(accordionTriggerVariants(), className)} {...props}>
      {children}
      <ChevronDownIcon className="size-6 shrink-0 text-neutral-500 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName
// #endregion AccordionTrigger

// #region AccordionContent
type AccordionContentRef = React.ComponentRef<typeof AccordionPrimitive.Content>

type AccordionContentVariantProps = VariantProps<typeof accordionContentVariants>
type AccordionContentBaseProps = {} & AccordionContentVariantProps
type AccordionContentProps = AccordionContentBaseProps & React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>

const accordionContentVariants = cva(
  "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-neutral-500",
)

const AccordionContent = React.forwardRef<AccordionContentRef, AccordionContentProps>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content ref={ref} className={cn(accordionContentVariants(), className)} {...props}>
    <div className={cn("pt-2 pr-12", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName
// #endregion AccordionContent

const Root = Accordion
const Item = AccordionItem
const Trigger = AccordionTrigger
const Content = AccordionContent

export { Root, Item, Trigger, Content }
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
export type { AccordionProps, AccordionItemProps, AccordionTriggerProps, AccordionContentProps }
export { accordionVariants, accordionItemVariants, accordionTriggerVariants, accordionContentVariants }
