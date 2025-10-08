import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet"
import type { SlottableTextProps, SlottableViewProps, TextRef, ViewRef } from "@rn-primitives/types"
import * as React from "react"
import { BottomSheetBackdrop as BottomSheetBackdropPrimitive } from "@gorhom/bottom-sheet"
import { View } from "react-native"

import { Text } from "~/ui/text"
import { cn } from "~/utils/utils"

export const BottomSheetBackdrop = (props: BottomSheetBackdropProps) => (
  <BottomSheetBackdropPrimitive {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
)

const Header = React.forwardRef<ViewRef, SlottableViewProps>(({ className, ...props }, ref) => {
  return <View ref={ref} className={cn("border-b-2 border-neutral-100 px-4 pb-2.5 pt-0.5", className)} {...props} />
})
Header.displayName = "Header"

const HeaderTitle = React.forwardRef<TextRef, SlottableTextProps>(({ className, ...props }, ref) => {
  return <Text ref={ref} className={cn("text-center text-lg font-semibold", className)} {...props} />
})
HeaderTitle.displayName = "HeaderTitle"

export { Header, HeaderTitle }
