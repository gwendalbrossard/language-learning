import type { SlottableTextProps, SlottableViewProps, TextRef, ViewRef } from "@rn-primitives/types"
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import * as React from "react"
import { ArrowLeftIcon } from "lucide-react-native"
import { Pressable, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"

import { Text } from "~/ui/text"
import { cn } from "~/utils/utils"

type ScrollContextType = {
  scrollEnabled: boolean
  isScrolledToBottom: boolean
  isScrolledToTop: boolean
  setScrollEnabled: (enabled: boolean) => void
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
}

const ScrollContext = React.createContext<ScrollContextType | undefined>(undefined)

function useScroll() {
  const context = React.useContext(ScrollContext)
  if (context === undefined) {
    throw new Error("useScroll must be used within a ScrollProvider")
  }
  return context
}

export type StepProps = {
  onContinue: () => void
  onBack: () => void
  progress: number
}

const Container = React.forwardRef<ViewRef, SlottableViewProps>(({ className, ...props }, ref) => {
  const [scrollEnabled, setScrollEnabled] = React.useState(false)
  const [isScrolledToBottom, setIsScrolledToBottom] = React.useState(false)
  const [isScrolledToTop, setIsScrolledToTop] = React.useState(true)

  const handleScroll = React.useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent

    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height
    const isCloseToTop = contentOffset.y <= 0

    setIsScrolledToBottom(isCloseToBottom)
    setIsScrolledToTop(isCloseToTop)
  }, [])

  return (
    <ScrollContext.Provider
      value={{
        scrollEnabled,
        isScrolledToBottom,
        isScrolledToTop,
        setScrollEnabled,
        handleScroll,
      }}
    >
      <View ref={ref} className={cn("flex-1 flex-col justify-between", className)} {...props} />
    </ScrollContext.Provider>
  )
})
Container.displayName = "Container"

type ProgressProps = {
  onBack: () => void
  progress: number
}

const Progress = React.forwardRef<ViewRef, SlottableViewProps & ProgressProps>(({ onBack, progress, className, ...props }, ref) => {
  return (
    <View ref={ref} className={cn("flex-row items-center gap-2 px-4", className)} {...props}>
      <Pressable onPress={onBack} className="-ml-1 flex size-8 shrink-0 flex-row items-center justify-center gap-1">
        <ArrowLeftIcon className="text-neutral-600" />
      </Pressable>
      <View className="h-2.5 flex-1 rounded-full bg-neutral-200">
        <View className="h-full rounded-full bg-primary-600" style={{ width: `${progress}%` }} />
      </View>
    </View>
  )
})
Progress.displayName = "Progress"

const Header = React.forwardRef<ViewRef, SlottableViewProps>(({ className, ...props }, ref) => {
  const { isScrolledToTop, scrollEnabled } = useScroll()
  return (
    <View
      ref={ref}
      className={cn(
        "mt-3 flex flex-col items-center justify-center gap-0.5 px-4 pb-4",
        scrollEnabled && !isScrolledToTop && "border-b-2 border-neutral-100",
        className,
      )}
      {...props}
    />
  )
})
Header.displayName = "Header"

const HeaderIllustration = React.forwardRef<ViewRef, SlottableViewProps>(({ className, ...props }, ref) => {
  return <View ref={ref} className={cn("relative mb-6 h-[45%] w-full", className)} {...props} />
})
HeaderIllustration.displayName = "HeaderIllustration"

const HeaderTitle = React.forwardRef<TextRef, SlottableTextProps>(({ className, ...props }, ref) => {
  return <Text ref={ref} className={cn("text-center text-2xl font-semibold", className)} {...props} />
})
HeaderTitle.displayName = "HeaderTitle"

const HeaderDescription = React.forwardRef<TextRef, SlottableTextProps>(({ className, ...props }, ref) => {
  return <Text ref={ref} className={cn("text-center text-neutral-500", className)} {...props} />
})
HeaderDescription.displayName = "HeaderDescription"

const Body = React.forwardRef<ViewRef, SlottableViewProps>(({ className, ...props }, ref) => {
  const { scrollEnabled, setScrollEnabled, handleScroll } = useScroll()
  const [contentHeight, setContentHeight] = React.useState(0)
  const [containerHeight, setContainerHeight] = React.useState(0)

  React.useEffect(() => {
    setScrollEnabled(contentHeight > containerHeight)
  }, [contentHeight, containerHeight, setScrollEnabled])

  return (
    <KeyboardAwareScrollView
      bottomOffset={16}
      enabled
      contentContainerStyle={{ flexGrow: 1 }}
      scrollEnabled={scrollEnabled}
      showsVerticalScrollIndicator={scrollEnabled}
      onContentSizeChange={(_, height) => setContentHeight(height)}
      onScroll={handleScroll}
      onLayout={(event) => setContainerHeight(event.nativeEvent.layout.height)}
    >
      <View ref={ref} className={cn("flex-1 px-4 py-4", className)} {...props} />
    </KeyboardAwareScrollView>
  )
})
Body.displayName = "Body"

const Bottom = React.forwardRef<ViewRef, SlottableViewProps>(({ className, ...props }, ref) => {
  const { isScrolledToBottom, scrollEnabled } = useScroll()
  return (
    <View
      ref={ref}
      className={cn("flex flex-col gap-2 px-4 py-4", scrollEnabled && !isScrolledToBottom && "border-t-2 border-neutral-100", className)}
      {...props}
    />
  )
})
Bottom.displayName = "Bottom"

export { Container, Header, HeaderIllustration, HeaderTitle, HeaderDescription, Bottom, Body, Progress }
