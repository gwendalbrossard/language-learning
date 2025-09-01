"use client"

import type { VariantProps } from "class-variance-authority"
import type { FC } from "react"
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva } from "class-variance-authority"

import { cn } from "@acme/ui/lib/utils"

// #region TabsContext
type TabsSize = "xs" | "sm" | "md"
type TabsVariant = "default"
type TabsOrientation = "vertical" | "horizontal"

type TabsContextProps = { size: TabsSize; variant: TabsVariant; orientation: TabsOrientation }
const TabsContext = React.createContext<TabsContextProps>({ size: "md", variant: "default", orientation: "horizontal" })

type TabsContextProviderProps = {
  children: React.ReactNode
  size: TabsSize
  variant: TabsVariant
  orientation: TabsOrientation
}
const TabsContextProvider: React.FC<TabsContextProviderProps> = ({ children, size, variant, orientation }) => (
  <TabsContext.Provider value={{ size, variant, orientation }}>{children}</TabsContext.Provider>
)
const useTabsContext = () => React.useContext(TabsContext)
// #endregion TabsContextContex

// #region Tabs
type TabsProps = { size?: TabsSize; variant?: TabsVariant; orientation?: TabsOrientation } & TabsPrimitive.TabsProps
const Tabs: FC<TabsProps> = ({ size = "md", variant = "default", orientation = "horizontal", children, ...props }) => {
  return (
    <TabsContextProvider size={size} variant={variant} orientation={orientation}>
      <TabsPrimitive.Root {...props} orientation={orientation}>
        {children}
      </TabsPrimitive.Root>
    </TabsContextProvider>
  )
}
Tabs.displayName = TabsPrimitive.Root.displayName
// #endregion Tabs

// #region TabsList
type TabsListRootRef = React.ComponentRef<typeof TabsPrimitive.List>

type TabsListVariantProps = Omit<VariantProps<typeof tabsListVariants>, "size" | "variant">
type TabsListBaseProps = {} & TabsListVariantProps
type TabsListProps = TabsListBaseProps & React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>

const tabsListVariants = cva(cn("inline-flex items-center justify-center gap-3"), {
  variants: {
    variant: {
      default: "",
    },
    size: {
      xs: "",
      sm: "",
      md: "",
    },
    orientation: {
      horizontal: "",
      vertical: "flex-col",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "sm",
    orientation: "horizontal",
  },
  compoundVariants: [
    {
      variant: "default",
      orientation: "horizontal",
      className: "border-b border-neutral-200",
    },
  ],
})

const TabsList = React.forwardRef<TabsListRootRef, TabsListProps>(({ className, ...props }, ref) => {
  const { size, variant, orientation } = useTabsContext()
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(tabsListVariants({ size: size, variant: variant, orientation: orientation }), className)}
      {...props}
    />
  )
})
TabsList.displayName = TabsPrimitive.List.displayName
// #endregion TabsList

// #region TabsTrigger
type TabsTriggerRootRef = React.ComponentRef<typeof TabsPrimitive.Trigger>

type TabsTriggerVariantProps = Omit<VariantProps<typeof tabsTriggerVariants>, "size">
type TabsTriggerBaseProps = {} & TabsTriggerVariantProps
type TabsTriggerProps = TabsTriggerBaseProps & React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>

const tabsTriggerVariants = cva(
  cn(
    "relative flex w-full cursor-pointer items-center gap-2 whitespace-nowrap transition",
    "font-medium",
    "disabled:pointer-events-none",
    "focus-visible:outline-hidden",
    "data-[state=active]:text-primary-700 data-[state=inactive]:text-neutral-500 data-[state=inactive]:hover:text-neutral-700",

    // Border on active
    "data-[state=active]:after:bg-primary-700 data-[state=active]:after:absolute data-[state=active]:after:rounded-full",

    // Disabled state
    "disabled:text-neutral-300",
  ),
  {
    variants: {
      variant: {
        default: "",
      },
      size: {
        xs: "text-sm",
        sm: "text-sm",
        md: "text-base",
      },
      orientation: {
        horizontal: "",
        vertical: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
      orientation: "horizontal",
    },
    compoundVariants: [
      {
        orientation: "horizontal",
        size: "xs",
        className: "px-1 pt-1.5 pb-2.5",
      },
      {
        orientation: "horizontal",
        size: "sm",
        className: "px-1 pt-2 pb-3",
      },
      {
        orientation: "horizontal",
        size: "md",
        className: "px-1.5 pt-2 pb-3",
      },
      {
        orientation: "vertical",
        size: "xs",
        className: "h-9 px-3",
      },
      {
        orientation: "vertical",
        size: "sm",
        className: "h-10 px-3.5",
      },
      {
        orientation: "vertical",
        size: "md",
        className: "h-11 px-4",
      },
      {
        orientation: "horizontal",
        className: "justify-center data-[state=active]:after:inset-x-0 data-[state=active]:after:-bottom-px data-[state=active]:after:h-0.5",
      },
      {
        orientation: "vertical",
        className: "justify-start data-[state=active]:after:inset-y-0 data-[state=active]:after:-left-px data-[state=active]:after:w-0.5",
      },
    ],
  },
)

const TabsTrigger = React.forwardRef<TabsTriggerRootRef, TabsTriggerProps>(({ className, ...props }, ref) => {
  const { size, variant, orientation } = useTabsContext()
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(tabsTriggerVariants({ size: size, variant: variant, orientation: orientation }), className)}
      {...props}
    />
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName
// #endregion TabsTrigger

// #region TabsTriggerLabel
type TabsTriggerLabelRef = HTMLSpanElement

type TabsTriggerLabelVariantProps = VariantProps<typeof tabsTriggerLabelVariants>
type TabsTriggerLabelBaseProps = {} & TabsTriggerLabelVariantProps
type TabsTriggerLabelProps = TabsTriggerLabelBaseProps & React.HTMLAttributes<HTMLSpanElement>

const tabsTriggerLabelVariants = cva()

const TabsTriggerLabel = React.forwardRef<TabsTriggerLabelRef, TabsTriggerLabelProps>(({ className, children, ...props }, ref) => {
  return (
    <span className={className} {...props} ref={ref}>
      {children}
    </span>
  )
})
TabsTriggerLabel.displayName = "TabsTriggerLabel"
// #endregion TabsTriggerLabel

// #region TabsTriggerIcon
type TabsTriggerIconRef = React.ComponentRef<typeof Slot>

type TabsTriggerIconVariantProps = Omit<VariantProps<typeof tabsTriggerIconVariants>, "size">
type TabsTriggerIconBaseProps = {} & TabsTriggerIconVariantProps
type TabsTriggerIconProps = TabsTriggerIconBaseProps & React.ComponentPropsWithoutRef<typeof Slot>

const tabsTriggerIconVariants = cva("shrink-0 stroke-[1.5px]", {
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

const TabsTriggerIcon = React.forwardRef<TabsTriggerIconRef, TabsTriggerIconProps>(({ className, children, ...props }, ref) => {
  const { size } = useTabsContext()

  return (
    <Slot ref={ref} id="tab-trigger-icon" aria-hidden className={cn(tabsTriggerIconVariants({ size }), className)} {...props}>
      {children}
    </Slot>
  )
})
TabsTriggerIcon.displayName = "TabsTriggerIcon"
// #endregion TabsTriggerIcon

// #region TabsContent
type TabsContentRef = React.ComponentRef<typeof TabsPrimitive.Content>

type TabsContentVariantProps = VariantProps<typeof tabsContentVariants>
type TabsContentBaseProps = {} & TabsContentVariantProps
type TabsContentProps = TabsContentBaseProps & React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>

const tabsContentVariants = cva("mt-2 focus-visible:outline-hidden")

const TabsContent = React.forwardRef<TabsContentRef, TabsContentProps>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content ref={ref} className={cn(tabsContentVariants(), className)} {...props} />
))
TabsContent.displayName = TabsPrimitive.Content.displayName
// #endregion TabsContent

const Root = Tabs
const List = TabsList
const Trigger = TabsTrigger
const TriggerLabel = TabsTriggerLabel
const TriggerIcon = TabsTriggerIcon
const Content = TabsContent

export { Root, List, Trigger, TriggerLabel, TriggerIcon, Content }

export { Tabs, TabsList, TabsTrigger, TabsTriggerLabel, TabsTriggerIcon, TabsContent }
export type { TabsProps, TabsListProps, TabsTriggerProps, TabsTriggerLabelProps, TabsTriggerIconProps, TabsContentProps }
export { tabsListVariants, tabsTriggerVariants, tabsTriggerLabelVariants, tabsTriggerIconVariants, tabsContentVariants }
