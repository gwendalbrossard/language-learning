"use client"

import type { VariantProps } from "class-variance-authority"
import type { UseEmblaCarouselType } from "embla-carousel-react"
import * as React from "react"
import { cva } from "class-variance-authority"
import useEmblaCarousel from "embla-carousel-react"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

import { cn } from "@acme/ui/lib/utils"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselContextBaseProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

// #region CarouselContext
type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  scrollTo: (index: number) => void
  canScrollPrev: boolean
  canScrollNext: boolean
  scrollSnapList: number[]
  selectedScrollSnap: number
} & CarouselContextBaseProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}
// #endregion CarouselContext

// #region Carousel
type CarouselRef = HTMLDivElement

type CarouselVariantProps = VariantProps<typeof carouselVariants>
type CarouselBaseProps = {} & CarouselVariantProps
type CarouselProps = CarouselBaseProps & CarouselContextBaseProps & React.ComponentPropsWithoutRef<"div">

const carouselVariants = cva("relative")

const Carousel = React.forwardRef<CarouselRef, CarouselProps>(
  ({ orientation = "horizontal", opts, setApi, plugins, className, children, ...props }, ref) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins,
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState<boolean>(false)
    const [canScrollNext, setCanScrollNext] = React.useState<boolean>(false)
    const [scrollSnapList, setScrollSnapList] = React.useState<number[]>([])
    const [selectedScrollSnap, setSelectedScrollSnap] = React.useState<number>(0)

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
      setScrollSnapList(api.scrollSnapList())
      setSelectedScrollSnap(api.selectedScrollSnap())
    }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const scrollTo = React.useCallback((index: number) => api?.scrollTo(index), [api])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext],
    )

    React.useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) {
        return
      }

      onSelect(api)
      api.on("reInit", onSelect)
      api.on("select", onSelect)

      return () => {
        api.off("select", onSelect)
      }
    }, [api, onSelect])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation: orientation,
          scrollPrev,
          scrollNext,
          scrollTo,
          canScrollPrev,
          canScrollNext,
          scrollSnapList,
          selectedScrollSnap,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn(carouselVariants(), className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  },
)
Carousel.displayName = "Carousel"
// #endregion Carousel

// #region CarouselContent
type CarouselContentRef = HTMLDivElement

type CarouselContentVariantProps = VariantProps<typeof carouselContentVariants>
type CarouselContentBaseProps = {} & CarouselContentVariantProps
type CarouselContentProps = CarouselContentBaseProps & React.ComponentPropsWithoutRef<"div">

const carouselContentVariants = cva("flex", {
  variants: {
    orientation: {
      horizontal: "",
      vertical: "flex-col",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
})
const CarouselContent = React.forwardRef<CarouselContentRef, CarouselContentProps>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div ref={ref} className={cn(carouselContentVariants({ orientation: orientation }), className)} {...props} />
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"
// #endregion CarouselContent

// #region CarouselItem
type CarouselItemRef = HTMLDivElement

type CarouselItemVariantProps = VariantProps<typeof carouselItemVariants>
type CarouselItemBaseProps = {} & CarouselItemVariantProps
type CarouselItemProps = CarouselItemBaseProps & React.ComponentPropsWithoutRef<"div">

const carouselItemVariants = cva("min-w-0 shrink-0 grow-0 basis-full")

const CarouselItem = React.forwardRef<CarouselItemRef, CarouselItemProps>(({ className, ...props }, ref) => {
  return <div ref={ref} role="group" aria-roledescription="slide" className={cn(carouselItemVariants(), className)} {...props} />
})
CarouselItem.displayName = "CarouselItem"
// #endregion CarouselItem

// #region CarouselPrevious
type CarouselPreviousRef = HTMLButtonElement

type CarouselPreviousVariantProps = VariantProps<typeof carouselPreviousVariants>
type CarouselPreviousBaseProps = {} & CarouselPreviousVariantProps
type CarouselPreviousProps = CarouselPreviousBaseProps & React.ComponentPropsWithoutRef<"button">

const carouselPreviousVariants = cva(
  cn(
    "flex size-10 shrink-0 items-center justify-center rounded-full",
    "disabled:pointer-events-none disabled:text-neutral-300",
    "focus-visible:outline-hidden",

    "bg-white text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-900",
    "[&>svg]:size-5",
    // 1st shadow: Adds depth around the button
    // 2nd shadow: Inner border
    // 3rd shadow: Adds a small black line at the bottom for depth
    "shadow-[--theme(--shadow-xs),inset_0_0_0_1px_--theme(--color-neutral-200/100%),inset_0_-1px_2px_--theme(--color-neutral-900/12%)]",
  ),
  {
    variants: {
      orientation: {
        horizontal: "",
        vertical: "rotate-90",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  },
)

const CarouselPrevious = React.forwardRef<CarouselPreviousRef, CarouselPreviousProps>(({ className, ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <button
      ref={ref}
      className={cn(carouselPreviousVariants({ orientation: orientation }), className)}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeftIcon strokeWidth={1.5} />
      <span className="sr-only">Previous slide</span>
    </button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"
// #endregion CarouselPrevious

// #region CarouselNext
type CarouselNextRef = HTMLButtonElement

type CarouselNextVariantProps = VariantProps<typeof carouselNextVariants>
type CarouselNextBaseProps = {} & CarouselNextVariantProps
type CarouselNextProps = CarouselNextBaseProps & React.ComponentPropsWithoutRef<"button">

const carouselNextVariants = cva(
  cn(
    "flex size-10 shrink-0 items-center justify-center rounded-full",
    "disabled:pointer-events-none disabled:text-neutral-300",
    "focus-visible:outline-hidden",
    "bg-white text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-900",
    "[&>svg]:size-5",
    // 1st shadow: Adds depth around the button
    // 2nd shadow: Inner border
    // 3rd shadow: Adds a small black line at the bottom for depth
    "shadow-[--theme(--shadow-xs),inset_0_0_0_1px_--theme(--color-neutral-200/100%),inset_0_-1px_2px_--theme(--color-neutral-900/12%)]",
  ),
  {
    variants: {
      orientation: {
        horizontal: "",
        vertical: "rotate-90",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  },
)

const CarouselNext = React.forwardRef<CarouselNextRef, CarouselNextProps>(({ className, ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <button
      ref={ref}
      className={cn(carouselNextVariants({ orientation: orientation }), className)}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRightIcon strokeWidth={1.5} />
      <span className="sr-only">Next slide</span>
    </button>
  )
})
CarouselNext.displayName = "CarouselNext"
// #endregion CarouselContext

// #region CarouselIndicators
type CarouselIndicatorsRef = HTMLDivElement

type CarouselIndicatorsVariantProps = VariantProps<typeof carouselIndicatorsVariants>
type CarouselIndicatorsBaseProps = {} & CarouselIndicatorsVariantProps
type CarouselIndicatorsProps = CarouselIndicatorsBaseProps & React.ComponentPropsWithoutRef<"div">

const carouselIndicatorsVariants = cva("flex gap-1.5")

const CarouselIndicators = React.forwardRef<CarouselIndicatorsRef, CarouselIndicatorsProps>(({ className, ...props }, ref) => {
  const { scrollTo, scrollSnapList, selectedScrollSnap } = useCarousel()

  return (
    <div ref={ref} className={cn(carouselIndicatorsVariants(), className)} {...props}>
      {scrollSnapList.map((snap, i) => {
        const isActive = i === selectedScrollSnap

        return (
          <button
            key={snap}
            className={cn(
              "relative size-2 shrink-0 rounded-full transition",

              // Active state
              "data-[state=active]:bg-primary-600",

              // Active state - Radial gradient
              "data-[state=active]:after:absolute data-[state=active]:after:inset-0 data-[state=active]:after:rounded-full",
              "data-[state=active]:after:bg-[radial-gradient(100%_100%_at_50%_0%,--theme(--color-white/16%)_0%,--theme(--color-white/0%)_100%)]",

              // Inactive state
              "data-[state=inactive]:bg-neutral-200",
            )}
            type="button"
            onClick={() => scrollTo(i)}
            data-state={isActive ? "active" : "inactive"}
          />
        )
      })}
    </div>
  )
})
CarouselIndicators.displayName = "CarouselIndicators"
// #endregion CarouselIndicators

const Root = Carousel
const Content = CarouselContent
const Item = CarouselItem
const Previous = CarouselPrevious
const Next = CarouselNext
const Indicators = CarouselIndicators

export { Root, Content, Item, Previous, Next, Indicators }
export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, CarouselIndicators }
export type { CarouselProps, CarouselContentProps, CarouselItemProps, CarouselPreviousProps, CarouselNextProps, CarouselIndicatorsProps }
export { carouselVariants, carouselContentVariants, carouselItemVariants, carouselPreviousVariants, carouselNextVariants, carouselIndicatorsVariants }
