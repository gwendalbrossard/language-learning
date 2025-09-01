import type { VariantProps } from "class-variance-authority"
import * as React from "react"
import * as TabsPrimitive from "@rn-primitives/tabs"
import { cva } from "class-variance-authority"
import { type LucideIcon } from "lucide-react-native"
import { type PressableStateCallbackType } from "react-native"

import { cn } from "~/utils/utils"
import { Text } from "./text"

// #region TabsContext
export type TabsSize = "xs" | "sm" | "md"
export type TabsVariant = "default"
export type TabsOrientation = "vertical" | "horizontal"

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
type TabsProps = { size?: TabsSize; variant?: TabsVariant; orientation?: TabsOrientation } & TabsPrimitive.RootProps
const Tabs: React.FC<TabsProps> = ({ size = "md", variant = "default", orientation = "horizontal", children, ...props }) => {
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
      horizontal: "flex-row",
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
  cn("relative flex w-full flex-row items-center gap-2 whitespace-nowrap transition", "border-none", "disabled:text-neutral-300"),
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
      active: {
        true: "",
        false: "",
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
        className: "px-1 pb-2.5 pt-1.5",
      },
      {
        orientation: "horizontal",
        size: "sm",
        className: "px-1 pb-3 pt-2",
      },
      {
        orientation: "horizontal",
        size: "md",
        className: "px-1.5 pb-3 pt-2",
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
        className: "-bottom-px justify-center",
      },
      {
        orientation: "horizontal",
        active: true,
        className: "border-b-2 border-primary-700",
      },
      {
        orientation: "horizontal",
        active: false,
        className: "",
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
  const { value } = TabsPrimitive.useRootContext()

  const active = props.value === value

  const renderTabsTriggerChildren = (children: React.ReactNode | ((state: PressableStateCallbackType) => React.ReactNode)) => {
    if (typeof children === "function") {
      throw new Error("TabsTrigger children cannot be a function")
    }

    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        if (child.type === TabsTriggerText) {
          return React.cloneElement(child, { variant, size, orientation, active } as Partial<TabsTriggerTextProps>)
        }
        if (child.type === TabsTriggerIcon) {
          return React.cloneElement(child, { variant, size, orientation, active } as Partial<TabsTriggerIconProps>)
        }

        return child
      }
      return child
    })
  }

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(tabsTriggerVariants({ size: size, variant: variant, orientation: orientation, active: active }), className)}
      {...props}
    >
      {renderTabsTriggerChildren(props.children)}
    </TabsPrimitive.Trigger>
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName
// #endregion TabsTrigger

// #region TabsTriggerText
type TabsTriggerTextRef = React.ComponentRef<typeof Text>

type TabsTriggerTextVariantProps = VariantProps<typeof tabsTriggerTextVariants>
type TabsTriggerTextBaseProps = {} & TabsTriggerTextVariantProps
type TabsTriggerTextProps = TabsTriggerTextBaseProps & React.ComponentPropsWithoutRef<typeof Text>

const tabsTriggerTextVariants = cva("web:pointer-events-none font-medium", {
  variants: {
    variant: {
      default: "",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
    },
    orientation: {
      horizontal: "",
      vertical: "",
    },
    active: {
      true: "text-primary-700",
      false: "text-neutral-500",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
    orientation: "horizontal",
  },
})

const TabsTriggerText = React.forwardRef<TabsTriggerTextRef, TabsTriggerTextProps>(
  ({ variant, size, orientation, active, className, ...props }, ref) => {
    return (
      <Text
        ref={ref}
        className={cn(tabsTriggerTextVariants({ variant: variant, size: size, orientation: orientation, active: active }), className)}
        {...props}
      />
    )
  },
)
TabsTriggerText.displayName = "TabsTriggerText"
// #endregion TabsTriggerText

// #region TabsTriggerIcon
type TabsTriggerIconVariantProps = VariantProps<typeof tabsTriggerIconVariants>
type TabsTriggerIconBaseProps = { icon: LucideIcon } & TabsTriggerIconVariantProps
type TabsTriggerIconProps = TabsTriggerIconBaseProps

const tabsTriggerIconVariants = cva("", {
  variants: {
    variant: {
      default: "",
    },
    size: {
      xs: "",
      sm: "",
      md: "",
    },
    active: {
      true: "",
      false: "",
    },
    orientation: {
      horizontal: "",
      vertical: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
    orientation: "horizontal",
  },
})

const TabsTriggerIcon = ({ icon, variant, size, active, ...props }: TabsTriggerIconProps) => {
  const color = {
    default: active ? "#2160EB" : "#666E7D", // primary-600 : neutral-500
  }[variant ?? "default"]

  const iconSize = {
    xs: 16,
    sm: 16,
    md: 20,
  }[size ?? "md"]

  const Icon = icon
  return <Icon strokeWidth={1.7} size={iconSize} color={color} {...props} />
}
TabsTriggerIcon.displayName = "TabsTriggerIcon"
// #endregion TabsTriggerIcon

const TabsContent = React.forwardRef<TabsPrimitive.ContentRef, TabsPrimitive.ContentProps>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content ref={ref} className={cn("", className)} {...props} />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

const Root = Tabs
const List = TabsList
const Trigger = TabsTrigger
const TriggerText = TabsTriggerText
const TriggerIcon = TabsTriggerIcon
const Content = TabsContent

export { Root, List, Trigger, TriggerText, TriggerIcon, Content }

export { Tabs, TabsList, TabsTrigger, TabsTriggerText, TabsTriggerIcon, TabsContent }
export { tabsListVariants, tabsTriggerVariants, tabsTriggerTextVariants, tabsTriggerIconVariants }
