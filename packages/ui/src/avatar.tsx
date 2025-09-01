"use client"

import type { VariantProps } from "class-variance-authority"
import type { FC, ReactNode } from "react"
import * as React from "react"
import { createContext, useContext } from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cva } from "class-variance-authority"

import { cn } from "@acme/ui/lib/utils"

// #region AvatarContext
type AvatarSize = "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl"
type AvatarVariant = "rounded" | "squared"

type AvatarContextProps = { size: AvatarSize; variant: AvatarVariant }
const AvatarContext = createContext<AvatarContextProps>({ size: "md", variant: "rounded" })

type AvatarProviderProps = { children: ReactNode; size: AvatarSize; variant: AvatarVariant }
const AvatarProvider: FC<AvatarProviderProps> = ({ children, size, variant }) => (
  <AvatarContext.Provider value={{ size, variant }}>{children}</AvatarContext.Provider>
)
const useAvatar = () => useContext(AvatarContext)
// #endregion AvatarContext

// #region Avatar
type AvatarRef = React.ComponentRef<typeof AvatarPrimitive.Root>

type AvatarVariantProps = VariantProps<typeof avatarVariants>
type AvatarBaseProps = {} & AvatarVariantProps
type AvatarProps = AvatarBaseProps & React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>

const avatarVariants = cva(
  cn(
    "relative flex shrink-0 overflow-hidden",
    "after:absolute after:inset-0 after:h-full after:w-full after:ring-1 after:ring-neutral-900/10 after:ring-inset", //after:shadow-[inset_0_0_0_1px_theme(colors.neutral.900/10%)]
  ),
  {
    variants: {
      variant: {
        rounded: "rounded-full after:rounded-full",
        squared: "",
      },
      size: {
        xxs: "size-4",
        xs: "size-5",
        sm: "size-6",
        md: "size-8",
        lg: "size-10",
        xl: "size-12",
        xxl: "size-14",
      },
    },
    defaultVariants: {
      variant: "rounded",
      size: "md",
    },
    compoundVariants: [
      {
        variant: "squared",
        size: "xxs",
        className: "rounded-sm after:rounded-sm",
      },
      {
        variant: "squared",
        size: "xs",
        className: "rounded-sm after:rounded-sm",
      },
      {
        variant: "squared",
        size: "sm",
        className: "rounded-sm after:rounded-sm",
      },
      {
        variant: "squared",
        size: "md",
        className: "rounded-md after:rounded-md",
      },
      {
        variant: "squared",
        size: "lg",
        className: "rounded-md after:rounded-md",
      },
      {
        variant: "squared",
        size: "xl",
        className: "rounded-lg after:rounded-lg",
      },
      {
        variant: "squared",
        size: "xxl",
        className: "rounded-lg after:rounded-lg",
      },
    ],
  },
)

const Avatar = React.forwardRef<AvatarRef, AvatarProps>(({ size = "md", variant = "rounded", className, ...props }, ref) => (
  <AvatarProvider size={size as AvatarSize} variant={variant as AvatarVariant}>
    <AvatarPrimitive.Root ref={ref} className={cn(avatarVariants({ size, variant }), className)} {...props} />
  </AvatarProvider>
))
Avatar.displayName = AvatarPrimitive.Root.displayName
// #endregion Avatar

// #region AvatarImage
type AvatarImageRef = React.ComponentRef<typeof AvatarPrimitive.Image>

type AvatarImageVariantProps = VariantProps<typeof avatarImageVariants>
type AvatarImageBaseProps = {} & AvatarImageVariantProps
type AvatarImageProps = AvatarImageBaseProps & React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>

const avatarImageVariants = cva(cn("aspect-square h-full w-full object-cover"), {
  variants: {
    variant: {
      rounded: "",
      squared: "",
    },
    size: {
      xxs: "size-4",
      xs: "size-5",
      sm: "size-6",
      md: "size-8",
      lg: "size-10",
      xl: "size-12",
      xxl: "size-14",
    },
  },
  defaultVariants: {
    variant: "rounded",
    size: "md",
  },
})
const AvatarImage = React.forwardRef<AvatarImageRef, AvatarImageProps>(({ className, ...props }, ref) => {
  const { size, variant } = useAvatar()

  return <AvatarPrimitive.Image ref={ref} className={cn(avatarImageVariants({ size, variant }), className)} {...props} />
})
AvatarImage.displayName = AvatarPrimitive.Image.displayName
// #endregion AvatarImage

// #region AvatarTextFallback
type AvatarTextFallbackRef = React.ComponentRef<typeof AvatarPrimitive.Fallback>

type AvatarTextFallbackVariantProps = VariantProps<typeof avatarTextFallbackVariants>
type AvatarTextFallbackBaseProps = {} & AvatarTextFallbackVariantProps
type AvatarTextFallbackProps = AvatarTextFallbackBaseProps & React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>

const avatarTextFallbackVariants = cva(
  cn("flex h-full w-full items-center justify-center uppercase", "bg-neutral-100 font-medium text-neutral-500"),
  {
    variants: {
      variant: {
        rounded: "",
        squared: "",
      },
      size: {
        xxs: "size-4 text-[0.5rem] leading-3.5",
        xs: "size-5 text-[0.625rem] leading-4",
        sm: "size-6 text-xs",
        md: "size-8 text-sm",
        lg: "size-10 text-base",
        xl: "size-12 text-lg",
        xxl: "size-14 text-xl",
      },
    },
    defaultVariants: {
      variant: "rounded",
      size: "md",
    },
  },
)
const AvatarTextFallback = React.forwardRef<AvatarTextFallbackRef, AvatarTextFallbackProps>(({ className, ...props }, ref) => {
  const { size, variant } = useAvatar()

  return <AvatarPrimitive.Fallback ref={ref} className={cn(avatarTextFallbackVariants({ size, variant }), className)} {...props} />
})
AvatarTextFallback.displayName = AvatarPrimitive.Fallback.displayName
// #endregion AvatarTextFallback

// #region AvatarIconFallback
type AvatarIconFallbackRef = React.ComponentRef<typeof AvatarPrimitive.Fallback>

type AvatarIconFallbackVariantProps = VariantProps<typeof avatarIconFallbackVariants>
type AvatarIconFallbackBaseProps = {} & AvatarIconFallbackVariantProps
type AvatarIconFallbackProps = AvatarIconFallbackBaseProps & React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>

const avatarIconFallbackVariants = cva(cn("h-full w-full", "bg-neutral-100"), {
  variants: {
    variant: {
      rounded: "",
      squared: "",
    },
    size: {
      xxs: "",
      xs: "",
      sm: "",
      md: "",
      lg: "",
      xl: "",
      xxl: "",
    },
  },
  defaultVariants: {
    variant: "rounded",
    size: "md",
  },
})
const AvatarIconFallback = React.forwardRef<AvatarIconFallbackRef, AvatarIconFallbackProps>(({ className, ...props }, ref) => {
  const { size, variant } = useAvatar()

  return (
    <AvatarPrimitive.Fallback ref={ref} className={cn(avatarIconFallbackVariants({ size, variant }), className)} {...props} asChild>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56">
        <g filter="url(#a)">
          <ellipse cx={28} cy={43} fill="#979FAD" rx={20} ry={12} />
        </g>
        <g filter="url(#b)">
          <circle cx={28} cy={19} r={8} fill="#979FAD" />
        </g>
        <defs>
          <filter id="a" width={40} height={26} x={8} y={31} colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
            <feOffset dy={2} />
            <feGaussianBlur stdDeviation={1} />
            <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
            <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.32 0" />
            <feBlend in2="shape" result="effect1_innerShadow_2004_984" />
          </filter>
          <filter id="b" width={16} height={18} x={20} y={11} colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
            <feOffset dy={2} />
            <feGaussianBlur stdDeviation={1} />
            <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
            <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.32 0" />
            <feBlend in2="shape" result="effect1_innerShadow_2004_984" />
          </filter>
        </defs>
      </svg>
    </AvatarPrimitive.Fallback>
  )
})
AvatarIconFallback.displayName = AvatarPrimitive.Fallback.displayName
// #endregion AvatarIconFallback

const Root = Avatar
const Image = AvatarImage
const TextFallback = AvatarTextFallback
const IconFallback = AvatarIconFallback

export { Root, Image, TextFallback, IconFallback }
export { Avatar, AvatarImage, AvatarTextFallback, AvatarIconFallback }
export type { AvatarProps, AvatarImageProps, AvatarTextFallbackProps, AvatarIconFallbackProps }
export { avatarVariants, avatarImageVariants, avatarTextFallbackVariants, avatarIconFallbackVariants }
