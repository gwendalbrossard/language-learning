import type { VariantProps } from "class-variance-authority"
import * as React from "react"
import * as Popover from "@radix-ui/react-popover"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "./lib/utils"

// #region CommandBar
type CommandBarRef = React.ComponentRef<typeof Popover.Anchor>

type CommandBarVariantProps = VariantProps<typeof commandBarVariants>
type CommandBarBaseProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
  disableAutoFocus?: boolean
} & CommandBarVariantProps
type CommandBarProps = CommandBarBaseProps & React.ComponentPropsWithoutRef<typeof Popover.Anchor>

const commandBarVariants = cva("fixed bottom-8 left-1/2 h-px w-px -translate-x-1/2")

const CommandBar = React.forwardRef<CommandBarRef, CommandBarProps>(
  ({ open = false, onOpenChange, defaultOpen = false, disableAutoFocus = true, className, children, ...props }, ref) => {
    return (
      <Popover.Root open={open} onOpenChange={onOpenChange} defaultOpen={defaultOpen}>
        <Popover.Anchor ref={ref} className={cn(commandBarVariants(), className)} {...props} />
        <Popover.Portal>
          <Popover.Content
            side="top"
            sideOffset={0}
            onOpenAutoFocus={(e) => {
              if (disableAutoFocus) {
                e.preventDefault()
              }
            }}
            className={cn(
              "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            )}
          >
            {children}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    )
  },
)

CommandBar.displayName = "CommandBar"
// #endregion CommandBar

// #region CommandBarValue
type CommandBarValueRef = HTMLDivElement

type CommandBarValueVariantProps = VariantProps<typeof commandBarValueVariants>
type CommandBarValueBaseProps = {} & CommandBarValueVariantProps
type CommandBarValueProps = CommandBarValueBaseProps & React.ComponentPropsWithoutRef<"div">

const commandBarValueVariants = cva("px-3 py-2.5 text-sm text-neutral-400")

const CommandBarValue = React.forwardRef<CommandBarValueRef, CommandBarValueProps>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn(commandBarValueVariants(), className)} {...props}>
      {children}
    </div>
  )
})
CommandBarValue.displayName = "CommandBar.Value"
// #endregion CommandBarValue

// #region CommandBarBar
type CommandBarBarRef = HTMLDivElement

type CommandBarBarVariantProps = VariantProps<typeof commandBarBarVariants>
type CommandBarBarBaseProps = {} & CommandBarBarVariantProps
type CommandBarBarProps = CommandBarBarBaseProps & React.ComponentPropsWithoutRef<"div">

const commandBarBarVariants = cva(
  cn(
    "relative flex items-center overflow-hidden rounded-lg bg-linear-to-b from-neutral-800 from-50% to-neutral-900",

    // Adds depth around the button
    "shadow-[0_2px_4px_--theme(--color-neutral-900/24%)]",
  ),
)

const CommandBarBar = React.forwardRef<CommandBarBarRef, CommandBarBarProps>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn(commandBarBarVariants(), className)} {...props}>
      {children}

      {/* We need to add the inline styling here */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 h-full w-full rounded-lg",
          // Serves as the inner border
          "before:pointer-events-none before:absolute before:inset-0 before:rounded-lg before:transition",
          "before:shadow-[inset_0_0_0_1px_--theme(--color-neutral-700/100%)]",

          // 1st shadow: Adds a small white line at the top for depth
          // 2rd shadow: Adds a small black line at the bottom for depth
          "shadow-[inset_0_1px_0.5px_0.5px_--theme(--color-white/44%),inset_0_-1px_2px_1px_--theme(--color-neutral-900/75%)]",
        )}
      />
    </div>
  )
})
CommandBarBar.displayName = "CommandBar.Bar"
// #endregion CommandBarBar

// #region CommandBarSeparator
type CommandBarSeparatorRef = HTMLDivElement

type CommandBarSeparatorVariantProps = VariantProps<typeof commandBarSeparatorVariants>
type CommandBarSeparatorBaseProps = {} & CommandBarSeparatorVariantProps
type CommandBarSeparatorProps = CommandBarSeparatorBaseProps & React.ComponentPropsWithoutRef<"div">

const commandBarSeparatorVariants = cva("h-10 w-px bg-neutral-600")

const CommandBarSeparator = React.forwardRef<CommandBarSeparatorRef, CommandBarSeparatorProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn(commandBarSeparatorVariants(), className)} {...props} />
})
CommandBarSeparator.displayName = "CommandBar.Separator"
// #endregion CommandBarSeparator

// #region CommandBarItem
type CommandBarItemRef = HTMLButtonElement

type CommandBarItemVariantProps = VariantProps<typeof commandBarItemVariants>
type CommandBarItemBaseProps = {} & CommandBarItemVariantProps
type CommandBarItemProps = CommandBarItemBaseProps & React.ComponentPropsWithoutRef<"button">

const commandBarItemVariants = cva(
  cn(
    "flex cursor-pointer items-center gap-2 px-3 py-2.5 text-sm text-white transition-all focus-visible:outline-hidden",
    "hover:bg-neutral-700",
    "disabled:pointer-events-none disabled:text-neutral-500",
    "[&_#shortcut]:border-neutral-600 [&_#shortcut]:bg-neutral-700 [&_#shortcut]:text-neutral-400",
    "disabled:[&_#shortcut]:bg-transparent disabled:[&_#shortcut]:text-neutral-500",
  ),
)

const CommandBarItem = React.forwardRef<CommandBarItemRef, CommandBarItemProps>(({ className, type = "button", children, ...props }, ref) => {
  return (
    <button ref={ref} className={cn(commandBarItemVariants(), className)} type={type} {...props}>
      {children}
    </button>
  )
})
CommandBarItem.displayName = "CommandBar.Item"
// #endregion CommandBarItem

// #region CommandBarItemLabel
type CommandBarItemLabelVariantProps = VariantProps<typeof commandBarItemLabelVariants>
type CommandBarItemLabelBaseProps = {} & CommandBarItemLabelVariantProps
type CommandBarItemLabelProps = CommandBarItemLabelBaseProps & React.ComponentPropsWithoutRef<"span">

const commandBarItemLabelVariants = cva()

const CommandBarItemLabel = React.forwardRef<HTMLElement, CommandBarItemLabelProps>(({ className, children, ...props }, forwardedRef) => {
  return (
    <span className={cn(commandBarItemLabelVariants(), className)} {...props} ref={forwardedRef}>
      {children}
    </span>
  )
})
CommandBarItemLabel.displayName = "CommandBar.ItemLabel"
// #endregion CommandBarItemLabel

// #region CommandBarItemShortcut
type CommandBarItemShortcutRef = HTMLElement

type CommandBarItemShortcutVariantProps = VariantProps<typeof commandBarItemShortcutVariants>
type CommandBarItemShortcutBaseProps = {} & CommandBarItemShortcutVariantProps
type CommandBarItemShortcutProps = CommandBarItemShortcutBaseProps & React.ComponentPropsWithoutRef<"kbd">

const commandBarItemShortcutVariants = cva("flex size-4 items-center justify-center rounded-sm border font-sans text-xs font-medium tracking-wider")

const CommandBarItemShortcut = React.forwardRef<CommandBarItemShortcutRef, CommandBarItemShortcutProps>(({ className, children, ...props }, ref) => {
  return (
    <kbd id="shortcut" ref={ref} className={cn(commandBarItemShortcutVariants(), className)} {...props}>
      {children}
    </kbd>
  )
})
CommandBarItemShortcut.displayName = "CommandBar.ItemShortcut"
// #endregion CommandBarItemShortcut

// #region CommandBarIcon
type CommandBarIconRef = React.ComponentRef<typeof Slot>

type CommandBarIconVariantProps = VariantProps<typeof commandBarIconVariants>
type CommandBarIconBaseProps = {} & CommandBarIconVariantProps
type CommandBarIconProps = CommandBarIconBaseProps & React.ComponentPropsWithoutRef<typeof Slot>

const commandBarIconVariants = cva("size-4 shrink-0 stroke-[1.5px]")

const CommandBarItemIcon = React.forwardRef<CommandBarIconRef, CommandBarIconProps>(({ className, children, ...props }, ref) => {
  return (
    <Slot ref={ref} id="icon" aria-hidden className={cn(commandBarIconVariants(), className)} {...props}>
      {children}
    </Slot>
  )
})
CommandBarItemIcon.displayName = "CommandBar.ItemIcon"
// #endregion CommandBarIcon

const Root = CommandBar
const Value = CommandBarValue
const Bar = CommandBarBar
const Separator = CommandBarSeparator
const Item = Object.assign(CommandBarItem, { Label: CommandBarItemLabel, Shortcut: CommandBarItemShortcut, Icon: CommandBarItemIcon })

export { Root, Value, Bar, Separator, Item }
export {
  CommandBar,
  CommandBarValue,
  CommandBarBar,
  CommandBarSeparator,
  CommandBarItem,
  CommandBarItemLabel,
  CommandBarItemShortcut,
  CommandBarItemIcon,
}
