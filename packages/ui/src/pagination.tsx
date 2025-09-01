import type { FC, ReactNode } from "react"
import * as React from "react"
import { createContext, useContext } from "react"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Slot } from "@radix-ui/react-slot"

import * as IconButton from "@acme/ui/icon-button"
import { iconButtonVariants } from "@acme/ui/icon-button"
import { cn } from "@acme/ui/lib/utils"

import * as Button from "./button"

// #region PaginationContext
export type PaginationSize = "xxs" | "xs" | "sm" | "md" | "lg"

type PaginationContextProps = { size: PaginationSize }
const PaginationContext = createContext<PaginationContextProps>({ size: "xxs" })

type PaginationProviderProps = { children: ReactNode; size: PaginationSize }
const PaginationProvider: FC<PaginationProviderProps> = ({ children, size }) => (
  <PaginationContext.Provider value={{ size }}>{children}</PaginationContext.Provider>
)
const usePagination = () => useContext(PaginationContext)
// #endregion PaginationContext

// #region Pagination
type PaginationProps = { size?: PaginationSize } & React.ComponentProps<"nav">
const Pagination: FC<PaginationProps> = ({ size = "xxs", className, children, ...props }) => (
  <PaginationProvider size={size}>
    <nav role="navigation" aria-label="pagination" className={cn("mx-auto flex w-full justify-center", className)} {...props}>
      {children}
    </nav>
  </PaginationProvider>
)
Pagination.displayName = "Pagination"
// #endregion Pagination

// #region PaginationContent
const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
))
PaginationContent.displayName = "PaginationContent"
// #endregion PaginationContent

// #region PaginationItem
const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"
// #endregion PaginationItem

// #region PaginationPage
type PaginationPageProps = { isActive?: boolean; asChild?: boolean } & React.ComponentProps<typeof Button.Root>
const PaginationPage: FC<PaginationPageProps> = ({ className, isActive, asChild = false, ...props }) => {
  const { size } = usePagination()
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      aria-current={isActive ? "page" : undefined}
      className={cn(
        iconButtonVariants({
          variant: isActive ? "secondary" : "ghost",
          size,
        }),
        size === "xxs" ? "text-sm" : size === "xs" ? "text-sm" : size === "sm" ? "text-sm" : size === "md" ? "text-sm" : "text-base",
        className,
      )}
      {...props}
    />
  )
}
PaginationPage.displayName = "PaginationPage"
// #endregion PaginationPage

// #region PaginationNavigation
const PaginationNavigation = ({ className, ...props }: React.ComponentProps<typeof Button.Root>) => {
  const { size } = usePagination()

  return <Button.Root variant="ghost" size={size} className={cn(className)} {...props} />
}
PaginationNavigation.displayName = "PaginationNavigation"
// #endregion PaginationNavigation

// #region PaginationEllipsis
const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<typeof IconButton.Root>) => {
  const { size } = usePagination()

  return (
    <IconButton.Root variant="ghost" size={size} aria-hidden className={cn(className, "pointer-events-none")} {...props}>
      <DotsHorizontalIcon />
    </IconButton.Root>
  )
}
PaginationEllipsis.displayName = "PaginationEllipsis"
// #endregion PaginationEllipsis

export { Pagination, PaginationContent, PaginationNavigation, PaginationPage, PaginationItem, PaginationEllipsis }
