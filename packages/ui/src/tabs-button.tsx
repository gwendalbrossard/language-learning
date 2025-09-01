"use client"

import type { VariantProps } from "class-variance-authority"
import type { FC } from "react"
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva } from "class-variance-authority"

import { cn } from "@acme/ui/lib/utils"

// #region TabsButtonContext
export type TabsButtonSize = "xs" | "sm" | "md"
export type TabsButtonVariant = "plain" | "border"
export type TabsButtonOrientation = "vertical" | "horizontal"

type TabsButtonContextProps = { size: TabsButtonSize; variant: TabsButtonVariant; orientation: TabsButtonOrientation }
const TabsButtonContext = React.createContext<TabsButtonContextProps>({ size: "md", variant: "plain", orientation: "horizontal" })

type TabsButtonContextProviderProps = {
  children: React.ReactNode
  size: TabsButtonSize
  variant: TabsButtonVariant
  orientation: TabsButtonOrientation
}
const TabsButtonContextProvider: React.FC<TabsButtonContextProviderProps> = ({ children, size, variant, orientation }) => (
  <TabsButtonContext.Provider value={{ size, variant, orientation }}>{children}</TabsButtonContext.Provider>
)
const useTabsButtonContext = () => React.useContext(TabsButtonContext)
// #endregion TabsButtonContextContex

// #region TabsButton
type TabsButtonProps = { size?: TabsButtonSize; variant?: TabsButtonVariant; orientation?: TabsButtonOrientation } & TabsPrimitive.TabsProps
const TabsButton: FC<TabsButtonProps> = ({ size = "md", variant = "plain", orientation = "horizontal", children, ...props }) => {
  return (
    <TabsButtonContextProvider size={size} variant={variant} orientation={orientation}>
      <TabsPrimitive.Root {...props} orientation={orientation}>
        {children}
      </TabsPrimitive.Root>
    </TabsButtonContextProvider>
  )
}
TabsButton.displayName = TabsPrimitive.Root.displayName
// #endregion TabsButton

// #region TabsButtonList
type TabsButtonListRootRef = React.ComponentRef<typeof TabsPrimitive.List>

type TabsButtonListVariantProps = Omit<VariantProps<typeof tabsButtonListVariants>, "size" | "variant">
type TabsButtonListBaseProps = {} & TabsButtonListVariantProps
type TabsButtonListProps = TabsButtonListBaseProps & React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>

const tabsButtonListVariants = cva(cn("inline-flex items-center justify-center gap-1 bg-neutral-50"), {
  variants: {
    variant: {
      plain: "",
      border: "ring-1 ring-neutral-200 ring-inset",
    },
    size: {
      xs: "rounded-[10px] px-1 py-1",
      sm: "rounded-[10px] px-1 py-1",
      md: "rounded-xl px-1.5 py-1.5",
    },
    orientation: {
      horizontal: "",
      vertical: "flex-col",
    },
  },
  defaultVariants: {
    variant: "plain",
    size: "sm",
    orientation: "horizontal",
  },
})

const TabsButtonList = React.forwardRef<TabsButtonListRootRef, TabsButtonListProps>(({ className, ...props }, ref) => {
  const { size, variant, orientation } = useTabsButtonContext()
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(tabsButtonListVariants({ size: size, variant: variant, orientation: orientation }), className)}
      {...props}
    />
  )
})
TabsButtonList.displayName = TabsPrimitive.List.displayName
// #endregion TabsButtonList

// #region TabsButtonTrigger
type TabsButtonTriggerRootRef = React.ComponentRef<typeof TabsPrimitive.Trigger>

type TabsButtonTriggerVariantProps = Omit<VariantProps<typeof tabsButtonTriggerVariants>, "size">
type TabsButtonTriggerBaseProps = {} & TabsButtonTriggerVariantProps
type TabsButtonTriggerProps = TabsButtonTriggerBaseProps & React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>

const tabsButtonTriggerVariants = cva(
  cn(
    "relative flex w-full cursor-pointer items-center gap-2 whitespace-nowrap transition",
    "rounded-md",
    "font-medium",
    "disabled:pointer-events-none",
    "focus-visible:outline-hidden",

    "border-none text-neutral-900",
    "data-[state=active]:text-neutral-900 data-[state=inactive]:text-neutral-500",
    "hover:bg-white data-[state=active]:bg-white",

    // 1st shadow: Adds depth around the button
    // 2nd shadow: Inner border
    // 3rd shadow: Adds a small black line at the bottom for depth
    "data-[state=active]:shadow-[--theme(--shadow-xs),inset_0_0_0_1px_--theme(--color-neutral-200/100%),inset_0_-1px_2px_--theme(--color-neutral-900/12%)]",
    "hover:shadow-[--theme(--shadow-xs),inset_0_0_0_1px_--theme(--color-neutral-200/100%),inset_0_-1px_2px_--theme(--color-neutral-900/12%)]",

    // Disabled state
    "disabled:text-neutral-300",
  ),
  {
    variants: {
      variant: {
        plain: "",
        border: "",
      },
      size: {
        xs: "h-9 px-3 text-sm",
        sm: "h-10 px-3.5 text-sm",
        md: "h-11 px-4 text-base",
      },
      orientation: {
        horizontal: "",
        vertical: "",
      },
    },
    defaultVariants: {
      variant: "plain",
      size: "sm",
      orientation: "horizontal",
    },
    compoundVariants: [
      {
        orientation: "horizontal",
        className: "justify-center",
      },
      {
        orientation: "vertical",
        className: "justify-start",
      },
    ],
  },
)

const TabsButtonTrigger = React.forwardRef<TabsButtonTriggerRootRef, TabsButtonTriggerProps>(({ className, ...props }, ref) => {
  const { size, variant, orientation } = useTabsButtonContext()
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(tabsButtonTriggerVariants({ size: size, variant: variant, orientation: orientation }), className)}
      {...props}
    />
  )
})
TabsButtonTrigger.displayName = TabsPrimitive.Trigger.displayName
// #endregion TabsButtonTrigger

// #region TabsButtonTriggerLabel
type TabsButtonTriggerLabelRef = HTMLSpanElement

type TabsButtonTriggerLabelVariantProps = VariantProps<typeof tabsButtonTriggerLabelVariants>
type TabsButtonTriggerLabelBaseProps = {} & TabsButtonTriggerLabelVariantProps
type TabsButtonTriggerLabelProps = TabsButtonTriggerLabelBaseProps & React.HTMLAttributes<HTMLSpanElement>

const tabsButtonTriggerLabelVariants = cva()

const TabsButtonTriggerLabel = React.forwardRef<TabsButtonTriggerLabelRef, TabsButtonTriggerLabelProps>(({ className, children, ...props }, ref) => {
  return (
    <span className={className} {...props} ref={ref}>
      {children}
    </span>
  )
})
TabsButtonTriggerLabel.displayName = "TabsButtonTriggerLabel"
// #endregion TabsButtonTriggerLabel

// #region TabsButtonTriggerIcon
type TabsButtonTriggerIconRef = React.ComponentRef<typeof Slot>

type TabsButtonTriggerIconVariantProps = Omit<VariantProps<typeof tabsButtonTriggerIconVariants>, "size">
type TabsButtonTriggerIconBaseProps = {} & TabsButtonTriggerIconVariantProps
type TabsButtonTriggerIconProps = TabsButtonTriggerIconBaseProps & React.ComponentPropsWithoutRef<typeof Slot>

const tabsButtonTriggerIconVariants = cva("shrink-0 stroke-[1.5px]", {
  variants: {
    size: {
      xs: "size-4",
      sm: "size-4",
      md: "size-5",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

const TabsButtonTriggerIcon = React.forwardRef<TabsButtonTriggerIconRef, TabsButtonTriggerIconProps>(({ className, children, ...props }, ref) => {
  const { size } = useTabsButtonContext()

  return (
    <Slot ref={ref} id="tab-trigger-icon" aria-hidden className={cn(tabsButtonTriggerIconVariants({ size }), className)} {...props}>
      {children}
    </Slot>
  )
})
TabsButtonTriggerIcon.displayName = "TabsButtonTriggerIcon"
// #endregion TabsButtonTriggerIcon

// #region TabsButtonContent
type TabsButtonContentRef = React.ComponentRef<typeof TabsPrimitive.Content>

type TabsButtonContentVariantProps = VariantProps<typeof tabsButtonContentVariants>
type TabsButtonContentBaseProps = {} & TabsButtonContentVariantProps
type TabsButtonContentProps = TabsButtonContentBaseProps & React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>

const tabsButtonContentVariants = cva("mt-2 focus-visible:outline-hidden")

const TabsButtonContent = React.forwardRef<TabsButtonContentRef, TabsButtonContentProps>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content ref={ref} className={cn(tabsButtonContentVariants(), className)} {...props} />
))
TabsButtonContent.displayName = TabsPrimitive.Content.displayName
// #endregion TabsButtonContent

const Root = TabsButton
const List = TabsButtonList
const Trigger = TabsButtonTrigger
const TriggerLabel = TabsButtonTriggerLabel
const TriggerIcon = TabsButtonTriggerIcon
const Content = TabsButtonContent

export { Root, List, Trigger, TriggerLabel, TriggerIcon, Content }

export { TabsButton, TabsButtonList, TabsButtonTrigger, TabsButtonTriggerLabel, TabsButtonTriggerIcon, TabsButtonContent }
export type {
  TabsButtonProps,
  TabsButtonListProps,
  TabsButtonTriggerProps,
  TabsButtonTriggerLabelProps,
  TabsButtonTriggerIconProps,
  TabsButtonContentProps,
}

export { tabsButtonListVariants, tabsButtonTriggerVariants, tabsButtonTriggerLabelVariants, tabsButtonTriggerIconVariants, tabsButtonContentVariants }
