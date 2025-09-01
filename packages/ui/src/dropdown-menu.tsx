"use client"

import type { VariantProps } from "class-variance-authority"
import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { Check, ChevronRight } from "lucide-react"

import { checkboxIndicatorVariants, checkboxRootVariants } from "@acme/ui/checkbox"
import { cn } from "@acme/ui/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuPortal = DropdownMenuPrimitive.Portal
const DropdownMenuSub = DropdownMenuPrimitive.Sub

// #region DropdownMenuContent
type DropdownMenuContentRef = React.ComponentRef<typeof DropdownMenuPrimitive.Content>

type DropdownMenuContentVariantProps = VariantProps<typeof dropdownMenuContentVariants>
type DropdownMenuContentBaseProps = {} & DropdownMenuContentVariantProps
type DropdownMenuContentProps = DropdownMenuContentBaseProps & React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>

const dropdownMenuContentVariants = cva(
  cn(
    "border border-neutral-200",
    "relative z-50 overflow-hidden rounded-lg border bg-white text-neutral-900 shadow-md",
    "w-full min-w-(--radix-dropdown-menu-trigger-width)",
    "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  ),
)
const DropdownMenuContent = React.forwardRef<DropdownMenuContentRef, DropdownMenuContentProps>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content ref={ref} sideOffset={sideOffset} className={cn(dropdownMenuContentVariants({}), className)} {...props} />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName
// #endregion DropdownMenuContent

// #region DropdownMenuGroup
type DropdownMenuGroupRef = React.ComponentRef<typeof DropdownMenuPrimitive.Group>

type DropdownMenuGroupVariantProps = VariantProps<typeof dropdownMenuGroupVariants>
type DropdownMenuGroupBaseProps = {} & DropdownMenuGroupVariantProps
type DropdownMenuGroupProps = DropdownMenuGroupBaseProps & React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Group>

const dropdownMenuGroupVariants = cva("p-1")

const DropdownMenuGroup = React.forwardRef<DropdownMenuGroupRef, DropdownMenuGroupProps>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Group ref={ref} className={cn(dropdownMenuGroupVariants(), className)} {...props} />
))
DropdownMenuGroup.displayName = DropdownMenuPrimitive.Group.displayName
// #endregion DropdownMenuGroup

// #region DropdownItem
type DropdownMenuItemRef = React.ComponentRef<typeof DropdownMenuPrimitive.Item>

type DropdownMenuItemVariantProps = VariantProps<typeof dropdownMenuItemVariants>
type DropdownMenuItemBaseProps = DropdownMenuItemVariantProps
type DropdownMenuItemProps = DropdownMenuItemBaseProps & React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>

export const dropdownMenuItemVariants = cva(
  cn(
    "relative flex w-full cursor-default items-center gap-2 outline-hidden transition select-none",
    "rounded-md",
    "data-disabled:pointer-events-none",
    "h-9 px-3 text-sm",
  ),
  {
    variants: {
      variant: {
        neutral: cn(
          "text-neutral-800 hover:text-neutral-900",
          "data-disabled:text-neutral-400 data-disabled:[&_#icon]:text-neutral-400",
          "focus:bg-neutral-50 focus:[&_#icon]:text-neutral-700",
          "[&_#icon]:text-neutral-600",
        ),
        primary: cn(
          "text-primary-600 hover:text-primary-700",
          "data-disabled:text-primary-300 data-disabled:[&_#icon]:text-primary-300",
          "focus:bg-primary-50 focus:[&_#icon]:text-primary-600",
          "[&_#icon]:text-primary-500",
        ),
        destructive: cn(
          "text-error-600 hover:text-error-700",
          "data-disabled:text-error-300 data-disabled:[&_#icon]:text-error-300",
          "focus:bg-error-50 focus:[&_#icon]:text-error-600",
          "[&_#icon]:text-error-500",
        ),
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
)

const DropdownMenuItem = React.forwardRef<DropdownMenuItemRef, DropdownMenuItemProps>(({ variant, className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.Item ref={ref} className={cn(dropdownMenuItemVariants({ variant }), className)} {...props}>
    {children}
  </DropdownMenuPrimitive.Item>
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName
// #endregion DropdownItem

// #region DropdownMenuItemLabel
type DropdownMenuItemLabelRef = HTMLSpanElement

type DropdownMenuItemLabelVariantProps = VariantProps<typeof dropdownMenuItemLabelVariants>
type DropdownMenuItemLabelBaseProps = {} & DropdownMenuItemLabelVariantProps
type DropdownMenuItemLabelProps = DropdownMenuItemLabelBaseProps & React.ComponentPropsWithoutRef<"span">

const dropdownMenuItemLabelVariants = cva()

const DropdownMenuItemLabel = React.forwardRef<DropdownMenuItemLabelRef, DropdownMenuItemLabelProps>(
  ({ className, children, ...props }, forwardedRef) => {
    return (
      <span className={cn(dropdownMenuItemLabelVariants(), className)} {...props} ref={forwardedRef}>
        {children}
      </span>
    )
  },
)
DropdownMenuItemLabel.displayName = "DropdownMenuItemLabel"
// #endregion DropdownMenuItemLabel

// #region DropdownMenuItemIcon
type DropdownMenuItemIconRef = React.ComponentRef<typeof Slot>

type DropdownMenuItemIconVariantProps = VariantProps<typeof dropdownMenuItemIconVariants>
type DropdownMenuItemIconBaseProps = {} & DropdownMenuItemIconVariantProps
type DropdownMenuItemIconProps = DropdownMenuItemIconBaseProps & React.ComponentPropsWithoutRef<typeof Slot>

const dropdownMenuItemIconVariants = cva("size-4 shrink-0 stroke-[1.5px]")

const DropdownMenuItemIcon = React.forwardRef<DropdownMenuItemIconRef, DropdownMenuItemIconProps>(({ className, children, ...props }, ref) => (
  <Slot ref={ref} id="icon" aria-hidden className={cn(dropdownMenuItemIconVariants(), className)} {...props}>
    {children}
  </Slot>
))
DropdownMenuItemIcon.displayName = "DropdownMenuItemIcon"
// #endregion DropdownMenuItemIcon

// #region DropdownMenuCheckboxItem
type DropdownMenuCheckboxItemRef = React.ComponentRef<typeof DropdownMenuPrimitive.CheckboxItem>

type DropdownMenuCheckboxItemVariantProps = VariantProps<typeof dropdownMenuCheckboxItemVariants>
type DropdownMenuCheckboxItemBaseProps = {} & DropdownMenuCheckboxItemVariantProps
type DropdownMenuCheckboxItemProps = DropdownMenuCheckboxItemBaseProps & React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>

const dropdownMenuCheckboxItemVariants = dropdownMenuItemVariants

const DropdownMenuCheckboxItem = React.forwardRef<DropdownMenuCheckboxItemRef, DropdownMenuCheckboxItemProps>(
  ({ className, children, checked, ...props }, ref) => {
    return (
      <DropdownMenuPrimitive.CheckboxItem
        ref={ref}
        className={cn(dropdownMenuCheckboxItemVariants(), className)}
        onSelect={(e) => e.preventDefault()}
        checked={checked}
        {...props}
      >
        {children}
        <DropdownMenuCheckboxItemIndicator disabled={props.disabled} />
      </DropdownMenuPrimitive.CheckboxItem>
    )
  },
)
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName
// #endregion DropdownMenuCheckboxItem

// #region DropdownMenuCheckboxItemIndicator
type DropdownMenuCheckboxItemIndicatorRef = React.ComponentRef<typeof DropdownMenuPrimitive.ItemIndicator>

type DropdownMenuCheckboxItemIndicatorVariantProps = VariantProps<typeof dropdownMenuCheckboxItemIndicatorVariants>
type DropdownMenuCheckboxItemIndicatorBaseProps = { disabled: boolean | undefined } & DropdownMenuCheckboxItemIndicatorVariantProps
type DropdownMenuCheckboxItemIndicatorProps = DropdownMenuCheckboxItemIndicatorBaseProps &
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.ItemIndicator>

const dropdownMenuCheckboxItemIndicatorVariants = checkboxIndicatorVariants

const DropdownMenuCheckboxItemIndicator = React.forwardRef<DropdownMenuCheckboxItemIndicatorRef, DropdownMenuCheckboxItemIndicatorProps>(
  ({ disabled, className, ...props }, ref) => (
    <DropdownMenuPrimitive.ItemIndicator ref={ref} forceMount asChild>
      <button disabled={disabled} className={cn(checkboxRootVariants({ size: "sm" }), "pointer-events-none ml-auto", className)} {...props}>
        <DropdownMenuPrimitive.ItemIndicator className={cn(dropdownMenuCheckboxItemIndicatorVariants({ size: "sm" }))} asChild>
          <Check strokeWidth={3} />
        </DropdownMenuPrimitive.ItemIndicator>
      </button>
    </DropdownMenuPrimitive.ItemIndicator>
  ),
)
DropdownMenuCheckboxItemIndicator.displayName = DropdownMenuPrimitive.ItemIndicator.displayName
// #endregion DropdownMenuCheckboxItemIndicator

// #region DropdownMenuRadioItem
type DropdownMenuRadioItemRef = React.ComponentRef<typeof DropdownMenuPrimitive.RadioItem>

type DropdownMenuRadioItemVariantProps = VariantProps<typeof dropdownMenuRadioItemVariants>
type DropdownMenuRadioItemBaseProps = {} & DropdownMenuRadioItemVariantProps
type DropdownMenuRadioItemProps = DropdownMenuRadioItemBaseProps & React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>

const dropdownMenuRadioItemVariants = dropdownMenuItemVariants

const DropdownMenuRadioItem = React.forwardRef<DropdownMenuRadioItemRef, DropdownMenuRadioItemProps>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem ref={ref} className={cn(dropdownMenuRadioItemVariants(), className)} {...props}>
    {children}
    <DropdownMenuRadioItemIndicator />
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName
// #endregion DropdownMenuRadioItem

// #region DropdownMenuRadioGroup
type DropdownMenuRadioGroupRef = React.ComponentRef<typeof DropdownMenuPrimitive.RadioGroup>

type DropdownMenuRadioGroupVariantProps = VariantProps<typeof dropdownMenuRadioGroupVariants>
type DropdownMenuRadioGroupBaseProps = {} & DropdownMenuRadioGroupVariantProps
type DropdownMenuRadioGroupProps = DropdownMenuRadioGroupBaseProps & React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioGroup>

const dropdownMenuRadioGroupVariants = cva("p-1")

const DropdownMenuRadioGroup = React.forwardRef<DropdownMenuRadioGroupRef, DropdownMenuRadioGroupProps>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioGroup ref={ref} className={cn(dropdownMenuRadioGroupVariants(), className)} {...props} />
))
DropdownMenuRadioGroup.displayName = DropdownMenuPrimitive.RadioGroup.displayName
// #endregion DropdownMenuGroup

// #region DropdownMenuRadioItemIndicator
type DropdownMenuRadioItemIndicatorRef = React.ComponentRef<typeof DropdownMenuPrimitive.ItemIndicator>

type DropdownMenuRadioItemIndicatorVariantProps = VariantProps<typeof dropdownMenuRadioItemIndicatorVariants>
type DropdownMenuRadioItemIndicatorBaseProps = DropdownMenuRadioItemIndicatorVariantProps
type DropdownMenuRadioItemIndicatorProps = DropdownMenuRadioItemIndicatorBaseProps &
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.ItemIndicator>

const dropdownMenuRadioItemIndicatorVariants = cva("text-primary-500 ml-auto shrink-0")

const DropdownMenuRadioItemIndicator = React.forwardRef<DropdownMenuRadioItemIndicatorRef, DropdownMenuRadioItemIndicatorProps>(
  ({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.ItemIndicator ref={ref} className={cn(dropdownMenuRadioItemIndicatorVariants(), className)} {...props}>
      <Check aria-hidden className="size-4" />
    </DropdownMenuPrimitive.ItemIndicator>
  ),
)

DropdownMenuRadioItemIndicator.displayName = DropdownMenuPrimitive.ItemIndicator.displayName
// #endregion DropdownMenuRadioItemIndicator

// #region DropdownMenuLabel
type DropdownMenuLabelRef = React.ComponentRef<typeof DropdownMenuPrimitive.Label>

type DropdownMenuLabelVariantProps = VariantProps<typeof dropdownMenuLabelVariants>
type DropdownMenuLabelBaseProps = {} & DropdownMenuLabelVariantProps
type DropdownMenuLabelProps = DropdownMenuLabelBaseProps & React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>

const dropdownMenuLabelVariants = cva("px-3 pt-2 pb-1 text-xs font-medium text-neutral-500")

const DropdownMenuLabel = React.forwardRef<DropdownMenuLabelRef, DropdownMenuLabelProps>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label ref={ref} className={cn(dropdownMenuLabelVariants(), className)} {...props} />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName
// #endregion DropdownMenuLabel

// #region DropdownMenuSeparator
type DropdownMenuSeparatorRef = React.ComponentRef<typeof DropdownMenuPrimitive.Separator>

type DropdownMenuSeparatorVariantProps = VariantProps<typeof dropdownMenuSeparatorVariants>
type DropdownMenuSeparatorBaseProps = {} & DropdownMenuSeparatorVariantProps
type DropdownMenuSeparatorProps = DropdownMenuSeparatorBaseProps & React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>

const dropdownMenuSeparatorVariants = cva("h-px bg-neutral-200")

const DropdownMenuSeparator = React.forwardRef<DropdownMenuSeparatorRef, DropdownMenuSeparatorProps>(({ className, ...props }, ref) => {
  return <DropdownMenuPrimitive.Separator ref={ref} className={cn(dropdownMenuSeparatorVariants(), className)} {...props} />
})
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName
// #endregion DropdownMenuSeparator

// #region DropdownMenuItemShortcut
type DropdownMenuItemShortcutRef = HTMLSpanElement

type DropdownMenuItemShortcutVariantProps = VariantProps<typeof dropdownMenuItemShortcutVariants>
type DropdownMenuItemShortcutBaseProps = {} & DropdownMenuItemShortcutVariantProps
type DropdownMenuItemShortcutProps = DropdownMenuItemShortcutBaseProps & React.ComponentPropsWithoutRef<"span">

const dropdownMenuItemShortcutVariants = cva("ml-auto font-sans text-xs font-medium tracking-wider text-neutral-400")

const DropdownMenuItemShortcut = React.forwardRef<DropdownMenuItemShortcutRef, DropdownMenuItemShortcutProps>(({ className, ...props }, ref) => {
  return <span className={cn(dropdownMenuItemShortcutVariants(), className)} {...props} ref={ref} />
})
DropdownMenuItemShortcut.displayName = "DropdownMenuItemShortcut"
// #endregion DropdownMenuItemShortcut

// #region DropdownMenuSubTrigger
type DropdownMenuSubTriggerRef = React.ComponentRef<typeof DropdownMenuPrimitive.SubTrigger>

type DropdownMenuSubTriggerVariantProps = VariantProps<typeof dropdownMenuSubTriggerVariants>
type DropdownMenuSubTriggerBaseProps = {} & DropdownMenuSubTriggerVariantProps
type DropdownMenuSubTriggerProps = DropdownMenuSubTriggerBaseProps & React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger>

const dropdownMenuSubTriggerVariants = dropdownMenuItemVariants

const DropdownMenuSubTrigger = React.forwardRef<DropdownMenuSubTriggerRef, DropdownMenuSubTriggerProps>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(dropdownMenuSubTriggerVariants(), "focus:[&>#chevron]:text-neutral-700", "[&>#chevron]:text-neutral-600", className)}
    {...props}
  >
    {children}
    <ChevronRight id="chevron" className="ml-auto size-4 shrink-0" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName
// #endregion DropdownMenuSubTrigger

// #region DropdownMenuSubContent
type DropdownMenuSubContentRef = React.ComponentRef<typeof DropdownMenuPrimitive.SubContent>

type DropdownMenuSubContentVariantProps = VariantProps<typeof dropdownMenuSubContentVariants>
type DropdownMenuSubContentBaseProps = {} & DropdownMenuSubContentVariantProps
type DropdownMenuSubContentProps = DropdownMenuSubContentBaseProps & React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>

const dropdownMenuSubContentVariants = dropdownMenuContentVariants

const DropdownMenuSubContent = React.forwardRef<DropdownMenuSubContentRef, DropdownMenuSubContentProps>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent ref={ref} className={cn(dropdownMenuSubContentVariants(), "min-w-32", className)} {...props} />
))
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName
// #endregion DropdownMenuSubContent

const Root = DropdownMenu
const Trigger = DropdownMenuTrigger
const Content = DropdownMenuContent
const Item = DropdownMenuItem
const ItemLabel = DropdownMenuItemLabel
const ItemIcon = DropdownMenuItemIcon
const ItemShortcut = DropdownMenuItemShortcut
const CheckboxItem = DropdownMenuCheckboxItem
const RadioGroup = DropdownMenuRadioGroup
const RadioItem = DropdownMenuRadioItem
const Label = DropdownMenuLabel
const Separator = DropdownMenuSeparator
const Group = DropdownMenuGroup
const Portal = DropdownMenuPortal
const Sub = DropdownMenuSub
const SubContent = DropdownMenuSubContent
const SubTrigger = DropdownMenuSubTrigger

export {
  Root,
  Trigger,
  Content,
  Item,
  ItemLabel,
  ItemIcon,
  ItemShortcut,
  CheckboxItem,
  RadioItem,
  Label,
  Separator,
  Group,
  Portal,
  Sub,
  SubContent,
  SubTrigger,
  RadioGroup,
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemLabel,
  DropdownMenuItemIcon,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuItemShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}

export type {
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioItemProps,
  DropdownMenuLabelProps,
  DropdownMenuSeparatorProps,
  DropdownMenuGroupProps,
  DropdownMenuItemShortcutProps,
  DropdownMenuSubContentProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuRadioGroupProps,
}
