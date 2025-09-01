import * as React from "react"
import { Platform } from "react-native"
import Animated, { interpolateColor, useAnimatedStyle, useDerivedValue, withTiming } from "react-native-reanimated"
import * as SwitchPrimitives from "@rn-primitives/switch"

import { cn } from "~/utils/utils"

const SwitchWeb = React.forwardRef<SwitchPrimitives.RootRef, SwitchPrimitives.RootProps>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "focus-visible:ring-ring focus-visible:ring-offset-background peer h-6 w-11 shrink-0 cursor-pointer flex-row items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed",
      props.checked ? "bg-primary" : "bg-input",
      props.disabled && "opacity-50",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "bg-background shadow-foreground/5 pointer-events-none block h-5 w-5 rounded-full shadow-md ring-0 transition-transform",
        props.checked ? "translate-x-5" : "translate-x-0",
      )}
    />
  </SwitchPrimitives.Root>
))

SwitchWeb.displayName = "SwitchWeb"

const RGB_COLORS = {
  light: {
    primary: "#2160EB", // primary-600
    input: "#EFF1F6", // neutral-100
  },
} as const

const SwitchNative = React.forwardRef<SwitchPrimitives.RootRef, SwitchPrimitives.RootProps>(({ className, ...props }, ref) => {
  const translateX = useDerivedValue(() => (props.checked ? 22 : 0))
  const animatedRootStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(translateX.value, [0, 22], [RGB_COLORS.light.input, RGB_COLORS.light.primary]),
    }
  })
  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(translateX.value, { duration: 200 }) }],
  }))
  return (
    <Animated.View style={animatedRootStyle} className={cn("h-7 w-[52px] rounded-full", props.disabled && "opacity-50")}>
      <SwitchPrimitives.Root
        className={cn(
          "h-7 w-[52px] shrink-0 flex-row items-center rounded-full border-4 border-transparent",
          props.checked ? "bg-primary" : "bg-input",
          className,
        )}
        {...props}
        ref={ref}
      >
        <Animated.View style={animatedThumbStyle}>
          <SwitchPrimitives.Thumb className={"size-5.5 rounded-full bg-white shadow-xs ring-0"} />
        </Animated.View>
      </SwitchPrimitives.Root>
    </Animated.View>
  )
})
SwitchNative.displayName = "SwitchNative"

const Switch = Platform.select({
  web: SwitchWeb,
  default: SwitchNative,
})

export { Switch }
