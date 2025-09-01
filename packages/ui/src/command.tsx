"use client"

import type { VariantProps } from "class-variance-authority"
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { Command as CommandPrimitive } from "cmdk"

import type { DialogContent } from "@acme/ui/dialog"
import { dialogContentVariants, DialogOverlay, DialogPortal } from "@acme/ui/dialog"
import { Kbd } from "@acme/ui/kbd"
import { cn } from "@acme/ui/lib/utils"

const CommandDialog = DialogPrimitive.Root

// #region CommandCommand
type CommandCommandRef = React.ComponentRef<typeof CommandPrimitive>

type CommandCommandVariantProps = VariantProps<typeof commandCommandVariants>
type CommandCommandBaseProps = {} & CommandCommandVariantProps
type CommandCommandProps = CommandCommandBaseProps & React.ComponentPropsWithoutRef<typeof CommandPrimitive>

const commandCommandVariants = cva(
  cn(
    "flex h-full w-full flex-col overflow-hidden rounded-xl bg-white",
    "[&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]_>[cmdk-group-heading]]:pt-1",
  ),
)

const CommandCommand = React.forwardRef<CommandCommandRef, CommandCommandProps>(({ className, ...props }, ref) => (
  <CommandPrimitive ref={ref} className={cn(commandCommandVariants(), className)} {...props} />
))
CommandCommand.displayName = CommandPrimitive.displayName
// #region CommandCommand

// #region CommandDialogContent
type CommandDialogContentRef = React.ComponentRef<typeof DialogContent>

type CommandDialogContentVariantProps = VariantProps<typeof commandDialogContentVariants>
type CommandDialogContentBaseProps = {} & CommandDialogContentVariantProps
type CommandDialogContentProps = CommandDialogContentBaseProps & React.ComponentPropsWithoutRef<typeof DialogContent>

const commandDialogContentVariants = cva("sm:max-w-xl")

const CommandDialogContent = React.forwardRef<CommandDialogContentRef, CommandDialogContentProps>(({ children, className, ...props }, ref) => {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content ref={ref} className={cn(dialogContentVariants(), commandDialogContentVariants(), className)} {...props}>
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
})
CommandDialogContent.displayName = DialogPrimitive.Content.displayName
// #endregion CommandDialogContent

// #region CommandInput
type CommandInputRef = React.ComponentRef<typeof CommandPrimitive.Input>

type CommandInputVariantProps = VariantProps<typeof commandInputVariants>
type CommandInputBaseProps = {} & CommandInputVariantProps
type CommandInputProps = CommandInputBaseProps & React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>

const commandInputVariants = cva(
  cn(
    "flex h-full w-full rounded-md bg-transparent px-11 text-sm outline-hidden placeholder:text-neutral-400 disabled:cursor-not-allowed disabled:opacity-50",
  ),
)
const CommandInput = React.forwardRef<CommandInputRef, CommandInputProps>(({ className, ...props }, ref) => (
  <div className="relative flex h-12 items-center border-b border-neutral-200" cmdk-input-wrapper="">
    <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 flex size-5 h-full items-center text-neutral-400" />
    <CommandPrimitive.Input ref={ref} className={cn(commandInputVariants(), className)} {...props} />
  </div>
))
CommandInput.displayName = CommandPrimitive.Input.displayName
// #endregion CommandInput

// #region CommandList
type CommandListRef = React.ComponentRef<typeof CommandPrimitive.List>

type CommandListVariantProps = VariantProps<typeof commandListVariants>
type CommandListBaseProps = {} & CommandListVariantProps
type CommandListProps = CommandListBaseProps & React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>

const commandListVariants = cva("max-h-[409px] overflow-x-hidden overflow-y-auto")

const CommandList = React.forwardRef<CommandListRef, CommandListProps>(({ className, ...props }, ref) => (
  <CommandPrimitive.List ref={ref} className={cn(commandListVariants(), className)} {...props} />
))
CommandList.displayName = CommandPrimitive.List.displayName
// #endregion CommandList

// #region CommandEmpty
type CommandEmptyRef = React.ComponentRef<typeof CommandPrimitive.Empty>

type CommandEmptyVariantProps = VariantProps<typeof commandEmptyVariants>
type CommandEmptyBaseProps = {} & CommandEmptyVariantProps
type CommandEmptyProps = CommandEmptyBaseProps & React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>

const commandEmptyVariants = cva("py-6 text-center text-sm text-neutral-500")

const CommandEmpty = React.forwardRef<CommandEmptyRef, CommandEmptyProps>(({ className, ...props }, ref) => (
  <CommandPrimitive.Empty ref={ref} className={cn(commandEmptyVariants(), className)} {...props} />
))
CommandEmpty.displayName = CommandPrimitive.Empty.displayName
// #endregion CommandEmpty

// #region CommandGroup
type CommandGroupRef = React.ComponentRef<typeof CommandPrimitive.Group>

type CommandGroupVariantProps = VariantProps<typeof commandGroupVariants>
type CommandGroupBaseProps = {} & CommandGroupVariantProps
type CommandGroupProps = CommandGroupBaseProps & React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>

const commandGroupVariants = cva(
  cn(
    "overflow-hidden pb-2 text-xs text-neutral-500 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-neutral-500",
  ),
)
const CommandGroup = React.forwardRef<CommandGroupRef, CommandGroupProps>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group ref={ref} className={cn(commandGroupVariants(), className)} {...props} />
))
CommandGroup.displayName = CommandPrimitive.Group.displayName
// #endregion CommandGroup

// #region CommandSeparator
type CommandSeparatorRef = React.ComponentRef<typeof CommandPrimitive.Separator>

type CommandSeparatorVariantProps = VariantProps<typeof commandSeparatorVariants>
type CommandSeparatorBaseProps = {} & CommandSeparatorVariantProps
type CommandSeparatorProps = CommandSeparatorBaseProps & React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>

const commandSeparatorVariants = cva("mb-2 h-px bg-neutral-200")

const CommandSeparator = React.forwardRef<CommandSeparatorRef, CommandSeparatorProps>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator ref={ref} className={cn(commandSeparatorVariants(), className)} {...props} />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName
// #endregion CommandSeparator

// #region CommandItem
type CommandItemRef = React.ComponentRef<typeof CommandPrimitive.Item>

type CommandItemVariantProps = VariantProps<typeof commandItemVariants>
type CommandItemBaseProps = {} & CommandItemVariantProps
type CommandItemProps = CommandItemBaseProps & React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>

const commandItemVariants = cva(
  cn(
    "relative flex w-full cursor-default items-center gap-2 outline-hidden transition select-none",
    "rounded-md",
    "data-[disabled=true]:pointer-events-none",
    "h-9 px-2 text-sm",
    "text-neutral-800 hover:text-neutral-900",
    "data-[disabled=true]:text-neutral-400 data-[disabled=true]:[&_#icon]:text-neutral-400",
    "aria-selected:bg-neutral-50 aria-selected:[&_#icon]:text-neutral-700",
    "[&_#icon]:text-neutral-600",
  ),
)

const CommandItem = React.forwardRef<CommandItemRef, CommandItemProps>(({ className, children, ...props }, ref) => (
  <CommandPrimitive.Item ref={ref} className={cn(commandItemVariants({}), className)} {...props}>
    {children}
  </CommandPrimitive.Item>
))
CommandItem.displayName = CommandPrimitive.Item.displayName
// #endregion CommandItem

// #region CommandItemLabel
type CommandItemLabelRef = HTMLSpanElement

type CommandItemLabelVariantProps = VariantProps<typeof commandItemLabelVariants>
type CommandItemLabelBaseProps = {} & CommandItemLabelVariantProps
type CommandItemLabelProps = CommandItemLabelBaseProps & React.ComponentPropsWithoutRef<"span">

const commandItemLabelVariants = cva()

const CommandItemLabel = React.forwardRef<CommandItemLabelRef, CommandItemLabelProps>(({ className, children, ...props }, forwardedRef) => {
  return (
    <span className={cn(commandItemLabelVariants(), className)} {...props} ref={forwardedRef}>
      {children}
    </span>
  )
})
CommandItemLabel.displayName = "CommandItemLabel"
// #endregion CommandItemLabel

// #region CommandItemIcon
type CommandItemIconRef = React.ComponentRef<typeof Slot>

type CommandItemIconVariantProps = VariantProps<typeof commandItemIconVariants>
type CommandItemIconBaseProps = {} & CommandItemIconVariantProps
type CommandItemIconProps = CommandItemIconBaseProps & React.ComponentPropsWithoutRef<typeof Slot>

const commandItemIconVariants = cva("size-4 shrink-0 stroke-[1.5px] transition-colors")

const CommandItemIcon = React.forwardRef<CommandItemIconRef, CommandItemIconProps>(({ className, children, ...props }, ref) => (
  <Slot ref={ref} id="icon" aria-hidden className={cn(commandItemIconVariants(), className)} {...props}>
    {children}
  </Slot>
))
CommandItemIcon.displayName = "CommandItemIcon"
// #endregion CommandItemIcon

// #region CommandItemCategory
type CommandItemCategoryRef = HTMLElement

type CommandItemCategoryVariantProps = VariantProps<typeof commandItemCategoryVariants>
type CommandItemCategoryBaseProps = {} & CommandItemCategoryVariantProps
type CommandItemCategoryProps = CommandItemCategoryBaseProps & React.HTMLAttributes<HTMLSpanElement>

const commandItemCategoryVariants = cva("ml-auto truncate text-xs text-neutral-400")

const CommandItemCategory = React.forwardRef<CommandItemCategoryRef, CommandItemCategoryProps>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn(commandItemCategoryVariants(), className)} {...props} />
))
CommandItemCategory.displayName = "CommandItemCategory"
// #endregion CommandCategory

// #region CommandItemShortcut
type CommandItemShortcutRef = React.ComponentRef<typeof Kbd>

type CommandItemShortcutVariantProps = VariantProps<typeof commandItemShortcutVariants>
type CommandItemShortcutBaseProps = {} & CommandItemShortcutVariantProps
type CommandItemShortcutProps = CommandItemShortcutBaseProps & React.ComponentPropsWithoutRef<typeof Kbd>

const commandItemShortcutVariants = cva("ml-auto")

const CommandItemShortcut = React.forwardRef<CommandItemShortcutRef, CommandItemShortcutProps>(({ className, children, ...props }, ref) => (
  <Kbd ref={ref} id="shortcut" className={cn(commandItemShortcutVariants(), className)} {...props}>
    {children}
  </Kbd>
))
CommandItemShortcut.displayName = "CommandItemShortcut"
// #endregion CommandItemShortcut

// #region CommandFooter
type CommandFooterRef = HTMLDivElement

type CommandFooterVariantProps = VariantProps<typeof commandFooterVariants>
type CommandFooterBaseProps = {} & CommandFooterVariantProps
type CommandFooterProps = CommandFooterBaseProps & React.HTMLAttributes<HTMLDivElement>

const commandFooterVariants = cva("flex h-10 items-center gap-4 border-t border-neutral-200 bg-neutral-50 px-4.5")

const CommandFooter = React.forwardRef<CommandFooterRef, CommandFooterProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(commandFooterVariants(), className)} {...props} />
))
CommandFooter.displayName = "CommandFooter"
// #endregion CommandFooter

// #region CommandFooterItem
type CommandFooterItemRef = HTMLDivElement

type CommandFooterItemVariantProps = VariantProps<typeof commandFooterItemVariants>
type CommandFooterItemBaseProps = {} & CommandFooterItemVariantProps
type CommandFooterItemProps = CommandFooterItemBaseProps & React.HTMLAttributes<HTMLDivElement>

const commandFooterItemVariants = cva("flex items-center gap-1 text-xs text-neutral-500")

const CommandFooterItem = React.forwardRef<CommandFooterItemRef, CommandFooterItemProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(commandFooterItemVariants(), className)} {...props} />
))
CommandFooterItem.displayName = "CommandFooterItem"
// #endregion CommandFooterItem

// #region CommandFooterItemLabel
type CommandFooterItemLabelRef = HTMLSpanElement

type CommandFooterItemLabelVariantProps = VariantProps<typeof commandFooterItemLabelVariants>
type CommandFooterItemLabelBaseProps = {} & CommandFooterItemLabelVariantProps
type CommandFooterItemLabelProps = CommandFooterItemLabelBaseProps & React.ComponentPropsWithoutRef<"span">

const commandFooterItemLabelVariants = cva()

const CommandFooterItemLabel = React.forwardRef<CommandFooterItemLabelRef, CommandFooterItemLabelProps>(
  ({ className, children, ...props }, forwardedRef) => {
    return (
      <span className={cn(commandFooterItemLabelVariants(), className)} {...props} ref={forwardedRef}>
        {children}
      </span>
    )
  },
)
CommandFooterItemLabel.displayName = "CommandFooterItemLabel"
// #endregion CommandFooterLabel

const Root = CommandDialog
const Command = CommandCommand
const Content = CommandDialogContent
const Input = CommandInput
const List = CommandList
const Empty = CommandEmpty
const Group = CommandGroup
const Item = CommandItem
const ItemLabel = CommandItemLabel
const ItemIcon = CommandItemIcon
const ItemShortcut = CommandItemShortcut
const Separator = CommandSeparator
const Footer = CommandFooter
const ItemCategory = CommandItemCategory
const FooterItem = CommandFooterItem
const FooterItemLabel = CommandFooterItemLabel

export {
  Root,
  Command,
  Content,
  Input,
  List,
  Empty,
  Group,
  Item,
  ItemLabel,
  ItemIcon,
  ItemShortcut,
  ItemCategory,
  Separator,
  Footer,
  FooterItem,
  FooterItemLabel,
}

export {
  CommandCommand,
  CommandDialog,
  CommandDialogContent,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandItemLabel,
  CommandItemCategory,
  CommandItemShortcut,
  CommandSeparator,
  CommandFooter,
  CommandItemIcon,
  CommandFooterItem,
  CommandFooterItemLabel,
}

export type {
  CommandCommandProps,
  CommandDialogContentProps,
  CommandInputProps,
  CommandListProps,
  CommandEmptyProps,
  CommandGroupProps,
  CommandItemProps,
  CommandItemIconProps,
  CommandItemLabelProps,
  CommandItemCategoryProps,
  CommandItemShortcutProps,
  CommandSeparatorProps,
  CommandFooterProps,
  CommandFooterItemProps,
  CommandFooterItemLabelProps,
}

export {
  commandCommandVariants,
  commandDialogContentVariants,
  commandInputVariants,
  commandListVariants,
  commandEmptyVariants,
  commandGroupVariants,
  commandItemVariants,
  commandItemIconVariants,
  commandItemCategoryVariants,
  commandItemShortcutVariants,
  commandSeparatorVariants,
  commandFooterVariants,
  commandFooterItemVariants,
  commandItemLabelVariants,
  commandFooterItemLabelVariants,
}
