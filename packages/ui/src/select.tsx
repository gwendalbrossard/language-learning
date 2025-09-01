"use client"

import type { VariantProps } from "class-variance-authority"
import type { FC, ReactNode } from "react"
import * as React from "react"
import { createContext, useContext } from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@acme/ui/lib/utils"

const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

// #region SelectSizeContex
type SelectSize = "xs" | "sm" | "md" | "lg"

type SelectSizeContextProps = { size: SelectSize }
const SelectSizeContext = createContext<SelectSizeContextProps>({ size: "md" })

type SelectSizeProviderProps = { children: ReactNode; size: SelectSize }
const SelectSizeProvider: FC<SelectSizeProviderProps> = ({ children, size }) => (
  <SelectSizeContext.Provider value={{ size }}>{children}</SelectSizeContext.Provider>
)
const useSelectSize = () => useContext(SelectSizeContext)
// #endregion SelectSizeContex

// #region SelectRoot
type SelectProps = { size?: SelectSize } & SelectPrimitive.SelectProps
const Select: FC<SelectProps> = ({ size = "md", children, ...props }) => {
  return (
    <SelectSizeProvider size={size}>
      <SelectPrimitive.Root {...props}>{children}</SelectPrimitive.Root>
    </SelectSizeProvider>
  )
}
Select.displayName = SelectPrimitive.Root.displayName
// #endregion SelectRoot

/* TODO: Check the "invalid" state. Not sure where to place it */

// #region SelectTrigger */
type SelectTriggerRef = React.ComponentRef<typeof SelectPrimitive.Trigger>

type SelectTriggerVariantProps = Omit<VariantProps<typeof selectTriggerVariants>, "size">
type SelectTriggerBaseProps = {} & SelectTriggerVariantProps
type SelectTriggerProps = SelectTriggerBaseProps & React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>

const selectTriggerVariants = cva(
  cn(
    "peer appearance-none bg-white transition focus-visible:outline-hidden",
    "flex w-full items-center justify-between gap-2",
    "rounded-lg border",
    "focus-within:ring-3 data-[state=open]:ring-3",
    "shadow-[0_1px_2px_0_--theme(--color-neutral-900/6%)]",
    "disabled:pointer-events-none disabled:border-neutral-200 disabled:bg-neutral-50",
    "data-placeholder:text-neutral-400",
    "text-nowrap",
    "data-[state=open]:[&>#chevron]:rotate-180 data-[state=open]:[&>#chevron]:text-neutral-900",
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
        false: cn(
          "border-neutral-200",
          "focus-within:border-primary-500 focus-within:ring-primary-600/24",
          "data-[state=open]:border-primary-500 data-[state=open]:ring-primary-600/24",
          "hover:border-primary-500",
        ),
      },
    },
    defaultVariants: {
      size: "md",
      invalid: false,
    },
  },
)

const SelectTrigger = React.forwardRef<SelectTriggerRef, SelectTriggerProps>(({ className, children, ...props }, ref) => {
  const { size } = useSelectSize()

  return (
    <SelectPrimitive.Trigger ref={ref} className={cn(selectTriggerVariants({ size }), className)} {...props}>
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown id="chevron" className="h-4 w-4 shrink-0 text-neutral-500 transition" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
})
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName
// #endregion SelectTrigger */

// #region TODO - SelectScrollUpButton
type SelectScrollUpButtonRef = React.ComponentRef<typeof SelectPrimitive.ScrollUpButton>

type SelectScrollUpButtonVariantProps = VariantProps<typeof selectScrollUpButtonVariants>
type SelectScrollUpButtonBaseProps = {} & SelectScrollUpButtonVariantProps
type SelectScrollUpButtonProps = SelectScrollUpButtonBaseProps & React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>

const selectScrollUpButtonVariants = cva(cn("flex cursor-default items-center justify-center py-1"))

const SelectScrollUpButton = React.forwardRef<SelectScrollUpButtonRef, SelectScrollUpButtonProps>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton ref={ref} className={cn(selectScrollUpButtonVariants(), className)} {...props}>
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName
// #endregion TODO - SelectScrollUpButton

// #region TODO - SelectScrollDownButton
type SelectScrollDownButtonRef = React.ComponentRef<typeof SelectPrimitive.ScrollDownButton>

type SelectScrollDownButtonVariantProps = VariantProps<typeof selectScrollDownButtonVariants>
type SelectScrollDownButtonBaseProps = {} & SelectScrollDownButtonVariantProps
type SelectScrollDownButtonProps = SelectScrollDownButtonBaseProps & React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>

const selectScrollDownButtonVariants = cva(cn("flex cursor-default items-center justify-center py-1"))

const SelectScrollDownButton = React.forwardRef<SelectScrollDownButtonRef, SelectScrollDownButtonProps>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton ref={ref} className={cn(selectScrollDownButtonVariants(), className)} {...props}>
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName
// #endregion TODO - SelectScrollDownButton

// #region SelectContent
type SelectContentRef = React.ComponentRef<typeof SelectPrimitive.Content>

type SelectContentVariantProps = VariantProps<typeof selectContentVariants>
type SelectContentBaseProps = {} & SelectContentVariantProps
type SelectContentProps = SelectContentBaseProps & React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>

export const selectContentVariants = cva(
  cn(
    "border border-neutral-200",
    "relative z-50 overflow-hidden rounded-lg border bg-white text-neutral-900 shadow-md",
    "w-full min-w-(--radix-select-trigger-width)",
    "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  ),
)

const SelectContent = React.forwardRef<SelectContentRef, SelectContentProps>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        selectContentVariants({}),
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "px-[calc(--spacing(1.5)-1px)] py-[calc(--spacing(1.5)-1px)]",
          "space-y-0.5",
          position === "popper" && "h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)",
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName
// #endregion SelectContent

// #region SelectLabel
type SelectLabelRef = React.ComponentRef<typeof SelectPrimitive.Label>

type SelectLabelVariantProps = Omit<VariantProps<typeof selectLabelVariants>, "size">
type SelectLabelBaseProps = {} & SelectLabelVariantProps
type SelectLabelProps = SelectLabelBaseProps & React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>

const selectLabelVariants = cva("px-3 pt-2 pb-1 text-xs font-medium text-neutral-500")

const SelectLabel = React.forwardRef<SelectLabelRef, SelectLabelProps>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label ref={ref} className={cn(selectLabelVariants(), className)} {...props} />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName
// #endregion SelectLabel

// #region SelectItem
type SelectItemRef = React.ComponentRef<typeof SelectPrimitive.Item>

type SelectItemVariantProps = Omit<VariantProps<typeof selectItemVariants>, "size">
type SelectItemBaseProps = {} & SelectItemVariantProps
type SelectItemProps = SelectItemBaseProps & React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>

const selectItemVariants = cva(
  cn(
    "relative flex w-full cursor-default items-center outline-hidden transition select-none",
    "rounded-md",
    "focus:bg-neutral-50",
    "data-[state=checked]:bg-primary-50 data-[state=checked]:text-primary-500",
    "data-disabled:pointer-events-none data-disabled:text-neutral-400",
  ),
  {
    variants: {
      size: {
        xs: "h-9 px-2 pr-8 text-sm",
        sm: "h-10 px-2 pr-8 text-sm",
        md: "h-11 px-2.5 pr-[34px] text-sm",
        lg: "h-11 px-3 pr-10 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
)
const SelectItem = React.forwardRef<SelectItemRef, SelectItemProps>(({ className, children, ...props }, ref) => {
  const { size } = useSelectSize()

  return (
    <SelectPrimitive.Item ref={ref} className={cn(selectItemVariants({ size }), className)} {...props}>
      <SelectItemText>{children}</SelectItemText>
      <SelectItemIndicator />
    </SelectPrimitive.Item>
  )
})
SelectItem.displayName = SelectPrimitive.Item.displayName
// #endregion SelectItem

// #region SelectItemText
type SelectItemTextRef = React.ComponentRef<typeof SelectPrimitive.ItemText>

type SelectItemTextVariantProps = Omit<VariantProps<typeof selectItemTextVariants>, "size">
type SelectItemTextBaseProps = {} & SelectItemTextVariantProps
type SelectItemTextProps = SelectItemTextBaseProps & React.ComponentPropsWithoutRef<typeof SelectPrimitive.ItemText>

const selectItemTextVariants = cva("flex items-center", {
  variants: {
    size: {
      xs: "",
      sm: "",
      md: "",
      lg: "",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

const SelectItemText = React.forwardRef<SelectItemTextRef, SelectItemTextProps>(({ className, children, ...props }, ref) => {
  const { size } = useSelectSize()
  return (
    <SelectPrimitive.ItemText asChild ref={ref} {...props}>
      <span className={cn(selectItemTextVariants({ size }), className)}>{children}</span>
    </SelectPrimitive.ItemText>
  )
})
SelectItemText.displayName = SelectPrimitive.ItemText.displayName
// #endregion SelectItemText

// #region SelectItemLabel
type SelectItemLabelRef = HTMLSpanElement
type SelectItemLabelVariantProps = VariantProps<typeof selectItemLabelVariants>
type SelectItemLabelBaseProps = {} & SelectItemLabelVariantProps
type SelectItemLabelProps = SelectItemLabelBaseProps & React.ComponentPropsWithoutRef<"span">

const selectItemLabelVariants = cva("")

const SelectItemLabel = React.forwardRef<SelectItemLabelRef, SelectItemLabelProps>(({ className, children, ...props }, forwardedRef) => {
  return (
    <span className={cn(selectItemLabelVariants(), className)} {...props} ref={forwardedRef}>
      {children}
    </span>
  )
})
SelectItemLabel.displayName = "SelectItemLabel"
// #endregion SelectItemLabel

// #region SelectItemIcon
type SelectItemIconRef = React.ComponentRef<typeof Slot>

type SelectItemIconVariantProps = Omit<VariantProps<typeof selectItemIconVariants>, "size">
type SelectItemIconBaseProps = {} & SelectItemIconVariantProps
type SelectItemIconProps = SelectItemIconBaseProps & React.ComponentPropsWithoutRef<typeof Slot>

const selectItemIconVariants = cva("shrink-0 stroke-[1.5px]", {
  variants: {
    size: {
      xs: "mr-2 size-4",
      sm: "mr-2 size-4",
      md: "mr-2 size-4",
      lg: "mr-2 size-5",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

const SelectItemIcon = React.forwardRef<SelectItemIconRef, SelectItemIconProps>(({ className, children, ...props }, ref) => {
  const { size } = useSelectSize()
  return (
    <Slot ref={ref} id="icon" aria-hidden className={cn(selectItemIconVariants({ size }), className)} {...props}>
      {children}
    </Slot>
  )
})
SelectItemIcon.displayName = "SelectItemIcon"
// #endregion SelectItemIcon

// #region SelectItemIndicator
type SelectItemIndicatorRef = React.ComponentRef<typeof SelectPrimitive.ItemIndicator>

type SelectItemIndicatorVariantProps = Omit<VariantProps<typeof selectItemIndicatorVariants>, "size">
type SelectItemIndicatorBaseProps = {} & SelectItemIndicatorVariantProps
type SelectItemIndicatorProps = SelectItemIndicatorBaseProps & React.ComponentPropsWithoutRef<typeof SelectPrimitive.ItemIndicator>

const selectItemIndicatorVariants = cva(cn("absolute"), {
  variants: {
    size: {
      xs: "top-2.5 right-2 [&>svg]:size-4",
      sm: "top-3 right-2 [&>svg]:size-4",
      md: "top-3.5 right-2.5 [&>svg]:size-4",
      lg: "top-3 right-3 [&>svg]:size-5",
    },
  },
  defaultVariants: {
    size: "md",
  },
})
const SelectItemIndicator = React.forwardRef<SelectItemIndicatorRef, SelectItemIndicatorProps>(({ className, ...props }, ref) => {
  const { size } = useSelectSize()

  return (
    <SelectPrimitive.ItemIndicator ref={ref} className={cn(selectItemIndicatorVariants({ size }), className)} {...props}>
      <Check />
    </SelectPrimitive.ItemIndicator>
  )
})
SelectItemIndicator.displayName = SelectPrimitive.ItemIndicator.displayName
// #endregion SelectItemIndicator

// #region SelectSeparator
type SelectSeparatorRef = React.ComponentRef<typeof SelectPrimitive.Separator>

type SelectSeparatorVariantProps = VariantProps<typeof selectSeparatorVariants>
type SelectSeparatorBaseProps = {} & SelectSeparatorVariantProps
type SelectSeparatorProps = SelectSeparatorBaseProps & React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>

const selectSeparatorVariants = cva("h-px bg-neutral-200")

const SelectSeparator = React.forwardRef<SelectSeparatorRef, SelectSeparatorProps>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator ref={ref} className={cn(selectSeparatorVariants(), className)} {...props} />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName
// #endregion SelectSeparator

const Root = Select
const Trigger = SelectTrigger
const Value = SelectValue
const Content = SelectContent
const Label = SelectLabel
const Item = SelectItem
const ItemLabel = SelectItemLabel
const ItemIcon = SelectItemIcon
const ItemIndicator = SelectItemIndicator
const Separator = SelectSeparator

export { Root, Trigger, Value, Content, Label, Item, ItemLabel, ItemIcon, ItemIndicator, Separator }

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectItemLabel,
  SelectItemText,
  SelectItemIcon,
  SelectItemIndicator,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}

export type {
  SelectProps,
  SelectTriggerProps,
  SelectContentProps,
  SelectLabelProps,
  SelectItemProps,
  SelectItemLabelProps,
  SelectItemTextProps,
  SelectItemIconProps,
  SelectItemIndicatorProps,
  SelectSeparatorProps,
  SelectScrollUpButtonProps,
  SelectScrollDownButtonProps,
}

export type { SelectSize }
