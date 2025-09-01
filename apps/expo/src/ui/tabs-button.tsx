import type { VariantProps } from "class-variance-authority"
import * as React from "react"
import * as TabsPrimitive from "@rn-primitives/tabs"
import { cva } from "class-variance-authority"
import { type LucideIcon } from "lucide-react-native"
import { type PressableStateCallbackType } from "react-native"

import { cn } from "~/utils/utils"
import { Text } from "./text"

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
type TabsButtonProps = { size?: TabsButtonSize; variant?: TabsButtonVariant; orientation?: TabsButtonOrientation } & TabsPrimitive.RootProps
const TabsButton: React.FC<TabsButtonProps> = ({ size = "md", variant = "plain", orientation = "horizontal", children, ...props }) => {
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
      border: "ring-1 ring-inset ring-neutral-200",
    },
    size: {
      xs: "rounded-[10px] px-1 py-1",
      sm: "rounded-[10px] px-1 py-1",
      md: "rounded-xl px-1.5 py-1.5",
    },
    orientation: {
      horizontal: "flex-row",
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
    "relative flex w-full flex-1 flex-row items-center gap-2 whitespace-nowrap transition-all",
    "rounded-md",
    "border-none",
    "disabled:text-neutral-300",
    "shadow-xs",
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
      active: {
        true: "bg-white",
        false: "bg-transparent shadow-transparent",
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
  const { value } = TabsPrimitive.useRootContext()

  const active = props.value === value

  const renderTabsButtonTriggerChildren = (children: React.ReactNode | ((state: PressableStateCallbackType) => React.ReactNode)) => {
    if (typeof children === "function") {
      throw new Error("TabsButtonTrigger children cannot be a function")
    }

    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        if (child.type === TabsButtonTriggerText) {
          return React.cloneElement(child, { variant, size, orientation, active } as Partial<TabsButtonTriggerTextProps>)
        }
        if (child.type === TabsButtonTriggerIcon) {
          return React.cloneElement(child, { variant, size, orientation, active } as Partial<TabsButtonTriggerIconProps>)
        }

        return child
      }
      return child
    })
  }

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(tabsButtonTriggerVariants({ size: size, variant: variant, orientation: orientation, active: active }), className)}
      {...props}
    >
      {renderTabsButtonTriggerChildren(props.children)}
    </TabsPrimitive.Trigger>
  )
})
TabsButtonTrigger.displayName = TabsPrimitive.Trigger.displayName
// #endregion TabsButtonTrigger

// #region TabsButtonTriggerText
type TabsButtonTriggerTextRef = React.ComponentRef<typeof Text>

type TabsButtonTriggerTextVariantProps = VariantProps<typeof tabsButtonTriggerTextVariants>
type TabsButtonTriggerTextBaseProps = {} & TabsButtonTriggerTextVariantProps
type TabsButtonTriggerTextProps = TabsButtonTriggerTextBaseProps & React.ComponentPropsWithoutRef<typeof Text>

const tabsButtonTriggerTextVariants = cva("web:pointer-events-none font-medium", {
  variants: {
    variant: {
      plain: "",
      border: "",
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
      true: "text-neutral-900",
      false: "text-neutral-500",
    },
  },
  defaultVariants: {
    variant: "plain",
    size: "md",
    orientation: "horizontal",
  },
})

const TabsButtonTriggerText = React.forwardRef<TabsButtonTriggerTextRef, TabsButtonTriggerTextProps>(
  ({ variant, size, orientation, active, className, ...props }, ref) => {
    return (
      <Text
        ref={ref}
        className={cn(tabsButtonTriggerTextVariants({ variant: variant, size: size, orientation: orientation, active: active }), className)}
        {...props}
      />
    )
  },
)
TabsButtonTriggerText.displayName = "TabsButtonTriggerText"
// #endregion TabsButtonTriggerText

// #region TabsButtonTriggerIcon
type TabsButtonTriggerIconVariantProps = VariantProps<typeof tabsButtonTriggerIconVariants>
type TabsButtonTriggerIconBaseProps = { icon: LucideIcon } & TabsButtonTriggerIconVariantProps
type TabsButtonTriggerIconProps = TabsButtonTriggerIconBaseProps

const tabsButtonTriggerIconVariants = cva("", {
  variants: {
    variant: {
      plain: "",
      border: "",
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
    variant: "plain",
    size: "md",
    orientation: "horizontal",
  },
})

const TabsButtonTriggerIcon = ({ icon, variant, size, active, ...props }: TabsButtonTriggerIconProps) => {
  const color = {
    plain: active ? "#2160EB" : "#90C4FD", // primary-600 : primary-300
    border: active ? "#2160EB" : "#90C4FD", // primary-600 : primary-300
  }[variant ?? "plain"]

  const iconSize = {
    xs: 16,
    sm: 16,
    md: 20,
  }[size ?? "md"]

  const Icon = icon
  return <Icon strokeWidth={1.7} size={iconSize} color={color} {...props} />
}
TabsButtonTriggerIcon.displayName = "TabsButtonTriggerIcon"
// #endregion TabsButtonTriggerIcon

const TabsButtonContent = React.forwardRef<TabsPrimitive.ContentRef, TabsPrimitive.ContentProps>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content ref={ref} className={cn("", className)} {...props} />
))
TabsButtonContent.displayName = TabsPrimitive.Content.displayName

const Root = TabsButton
const List = TabsButtonList
const Trigger = TabsButtonTrigger
const TriggerText = TabsButtonTriggerText
const TriggerIcon = TabsButtonTriggerIcon
const Content = TabsButtonContent

export { Root, List, Trigger, TriggerText, TriggerIcon, Content }

export { TabsButton, TabsButtonList, TabsButtonTrigger, TabsButtonTriggerText, TabsButtonTriggerIcon, TabsButtonContent }
export { tabsButtonListVariants, tabsButtonTriggerVariants, tabsButtonTriggerTextVariants, tabsButtonTriggerIconVariants }
