"use client"

import type { VariantProps } from "class-variance-authority"
import type { FC, ReactNode } from "react"
import * as React from "react"
import { useContext } from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cva } from "class-variance-authority"

import { cn } from "./lib/utils"

// #region SliderContext
type SliderSize = "sm" | "md" | "lg"

type SliderContextProps = { size: SliderSize }
const SliderContext = React.createContext<SliderContextProps>({ size: "md" })

type SliderProviderProps = { children: ReactNode; size: SliderSize }
const SliderProvider: FC<SliderProviderProps> = ({ children, size }) => <SliderContext.Provider value={{ size }}>{children}</SliderContext.Provider>
const useSlider = () => useContext(SliderContext)
// #endregion SliderContext

// #region Slider
type SliderRef = React.ComponentRef<typeof SliderPrimitive.Root>

type SliderVariantProps = VariantProps<typeof sliderVariants>
type SliderBaseProps = { size?: SliderSize } & SliderVariantProps
type SliderProps = SliderBaseProps & React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>

const sliderVariants = cva(cn("relative flex w-full touch-none items-center select-none"), {
  variants: {
    size: {
      sm: "h-4",
      md: "h-5",
      lg: "h-6",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

const Slider = React.forwardRef<SliderRef, SliderProps>(({ size = "md", className, ...props }, ref) => {
  return (
    <SliderProvider size={size}>
      <SliderPrimitive.Root ref={ref} className={cn(sliderVariants({ size }), className)} {...props}>
        <SliderTrack />
        <SliderThumb />
      </SliderPrimitive.Root>
    </SliderProvider>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName
// #endregion SliderRoot

// #region SliderTrack
type SliderTrackRef = React.ComponentRef<typeof SliderPrimitive.Track>

type SliderTrackVariantProps = Omit<VariantProps<typeof sliderTrackVariants>, "size">
type SliderTrackBaseProps = {} & SliderTrackVariantProps
type SliderTrackProps = SliderTrackBaseProps & React.ComponentPropsWithoutRef<typeof SliderPrimitive.Track>

const sliderTrackVariants = cva(
  cn("relative w-full grow overflow-hidden rounded-full bg-neutral-200 shadow-[inset_0_1px_2px_0_--theme(--color-neutral-900/12%)]"),
  {
    variants: {
      size: {
        sm: "h-1.5",
        md: "h-2",
        lg: "h-2.5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
)

const SliderTrack = React.forwardRef<SliderTrackRef, SliderTrackProps>(({ className, ...props }, ref) => {
  const { size } = useSlider()
  return (
    <SliderPrimitive.Track ref={ref} className={cn(sliderTrackVariants({ size }), className)} {...props}>
      <SliderPrimitive.Range
        className={cn(
          "absolute h-full",
          "bg-primary-500",

          // Radial gradient
          "after:absolute after:inset-px after:rounded-[calc(var(--radius-lg)-1px)]",
          "after:bg-[radial-gradient(100%_100%_at_50%_0%,--theme(--color-white/16%)_0%,--theme(--color-white/0%)_100%)]",

          // Serves as the inner border
          "before:absolute before:inset-0 before:rounded-l-full before:transition",
          "before:shadow-[inset_0_0_0_1px_--theme(--color-primary-600/100%)]",

          // 1st shadow: Adds depth around the button
          // 2nd shadow: Adds a small white line at the top for depth
          // 3rd shadow: Adds a small black line at the bottom for depth
          "shadow-[--theme(--shadow-xs),inset_0_1px_0.5px_0.5px_--theme(--color-white/44%),inset_0_-1px_2px_--theme(--color-primary-800/50%)]",

          // Disabled state
          "disabled:bg-primary-100",
          "disabled:shadow-[var(--shadow-xs),inset_0_1px_0.5px_0.5px_--theme(--color-primary-50/55%)]",
          "disabled:before:shadow-[inset_0_0_0_1px_--theme(--color-primary-200/100%)]",
        )}
      />
    </SliderPrimitive.Track>
  )
})
SliderTrack.displayName = SliderPrimitive.Track.displayName
// #endregion SliderTrack

// #region SliderThumb
type SliderThumbRef = React.ComponentRef<typeof SliderPrimitive.Thumb>

type SliderThumbVariantProps = Omit<VariantProps<typeof sliderThumbVariants>, "size">
type SliderThumbBaseProps = {} & SliderThumbVariantProps
type SliderThumbProps = SliderThumbBaseProps & React.ComponentPropsWithoutRef<typeof SliderPrimitive.Thumb>

const sliderThumbVariants = cva(
  cn(
    "block rounded-full bg-white transition-all",
    "disabled:pointer-events-none",
    "ring-1 ring-neutral-200 ring-inset",
    "shadow-[0_1px_2px_0_--theme(--color-neutral-900/6%),inset_0_-2px_1px_--theme(--color-neutral-900/6%)]",
    "focus-visible:ring-primary-500 outline-hidden focus-visible:outline-hidden",
  ),
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
)

const SliderThumb = React.forwardRef<SliderThumbRef, SliderThumbProps>(({ className, ...props }, ref) => {
  const { size } = useSlider()
  return <SliderPrimitive.Thumb ref={ref} className={cn(sliderThumbVariants({ size }), className)} {...props} />
})

SliderThumb.displayName = SliderPrimitive.Thumb.displayName
// #endregion SliderThumb

export { Slider, SliderTrack, SliderThumb }
export type { SliderProps, SliderTrackProps, SliderThumbProps }
export { sliderVariants, sliderTrackVariants, sliderThumbVariants }
