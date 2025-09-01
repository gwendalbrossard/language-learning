import * as React from "react"
import { Text as RNText } from "react-native"
import * as Slot from "@rn-primitives/slot"
import { type SlottableTextProps, type TextRef } from "@rn-primitives/types"

import { cn } from "~/utils/utils"

const TextClassContext = React.createContext<string | undefined>(undefined)

const Text = React.forwardRef<TextRef, SlottableTextProps>(({ className, asChild = false, ...props }, ref) => {
  const textClass = React.useContext(TextClassContext)
  const Component = asChild ? Slot.Text : RNText
  return <Component className={cn("web:select-text text-base", textClass, className)} ref={ref} {...props} />
})
Text.displayName = "Text"

const TextError = React.forwardRef<TextRef, SlottableTextProps>(({ className, asChild = false, ...props }, ref) => {
  const Component = asChild ? Slot.Text : RNText
  return <Component className={cn("web:select-text text-sm text-red-500", className)} ref={ref} {...props} />
})
TextError.displayName = "TextError"

const TextDescription = React.forwardRef<TextRef, SlottableTextProps>(({ className, asChild = false, ...props }, ref) => {
  const Component = asChild ? Slot.Text : RNText
  return <Component className={cn("web:select-text text-sm text-neutral-500", className)} ref={ref} {...props} />
})
TextDescription.displayName = "TextDescription"

export { Text, TextError, TextDescription, TextClassContext }
