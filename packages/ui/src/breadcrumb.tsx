import type { VariantProps } from "class-variance-authority"
import * as React from "react"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "@acme/ui/lib/utils"

// #region Breadcrumb
type BreadcrumbRef = HTMLElement

type BreadcrumbVariantProps = VariantProps<typeof breadcrumbVariants>
type BreadcrumbBaseProps = { separator?: React.ReactNode } & BreadcrumbVariantProps
type BreadcrumbProps = BreadcrumbBaseProps & React.ComponentPropsWithoutRef<"nav">

const breadcrumbVariants = cva("")

const Breadcrumb = React.forwardRef<BreadcrumbRef, BreadcrumbProps>(({ className, ...props }, ref) => (
  <nav ref={ref} aria-label="breadcrumb" className={cn(breadcrumbVariants(), className)} {...props} />
))
Breadcrumb.displayName = "Breadcrumb"
// #endregion Breadcrumb

// #region BreadcrumbList
type BreadcrumbListRef = HTMLOListElement

type BreadcrumbListVariantProps = VariantProps<typeof breadcrumbListVariants>
type BreadcrumbListBaseProps = {} & BreadcrumbListVariantProps
type BreadcrumbListProps = BreadcrumbListBaseProps & React.ComponentPropsWithoutRef<"ol">

const breadcrumbListVariants = cva("flex items-center gap-2.5 text-sm")

const BreadcrumbList = React.forwardRef<BreadcrumbListRef, BreadcrumbListProps>(({ className, ...props }, ref) => (
  <ol ref={ref} className={cn(breadcrumbListVariants(), className)} {...props} />
))
BreadcrumbList.displayName = "BreadcrumbList"

// #region BreadcrumbItem
type BreadcrumbItemRef = HTMLLIElement

type BreadcrumbItemVariantProps = VariantProps<typeof breadcrumbItemVariants>
type BreadcrumbItemBaseProps = {} & BreadcrumbItemVariantProps
type BreadcrumbItemProps = BreadcrumbItemBaseProps & React.ComponentPropsWithoutRef<"li">

const breadcrumbItemVariants = cva("inline-flex items-center font-medium")

const BreadcrumbItem = React.forwardRef<BreadcrumbItemRef, BreadcrumbItemProps>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn(breadcrumbItemVariants(), className)} {...props} />
))
BreadcrumbItem.displayName = "BreadcrumbItem"
// #endregion BreadcrumbItem

// #region BreadcrumbLink
type BreadcrumbLinkRef = HTMLAnchorElement

type BreadcrumbLinkVariantProps = VariantProps<typeof breadcrumbLinkVariants>
type BreadcrumbLinkBaseProps = { asChild?: boolean } & BreadcrumbLinkVariantProps
type BreadcrumbLinkProps = BreadcrumbLinkBaseProps & React.ComponentPropsWithoutRef<"a">

const breadcrumbLinkVariants = cva(
  "flex items-center gap-1.5 truncate text-neutral-500 transition hover:text-neutral-900 hover:[&_#breadcrumb-item-icon]:text-neutral-900",
)

const BreadcrumbLink = React.forwardRef<BreadcrumbLinkRef, BreadcrumbLinkProps>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return <Comp ref={ref} className={cn(breadcrumbLinkVariants(), className)} {...props} />
})
BreadcrumbLink.displayName = "BreadcrumbLink"
// #endregion BreadcrumbLink

// #region BreadcrumbPage
type BreadcrumbPageRef = HTMLSpanElement

type BreadcrumbPageVariantProps = VariantProps<typeof breadcrumbPageVariants>
type BreadcrumbPageBaseProps = {} & BreadcrumbPageVariantProps
type BreadcrumbPageProps = BreadcrumbPageBaseProps & React.ComponentPropsWithoutRef<"span">

const breadcrumbPageVariants = cva("flex items-center gap-1.5 truncate text-neutral-900")

const BreadcrumbPage = React.forwardRef<BreadcrumbPageRef, BreadcrumbPageProps>(({ className, ...props }, ref) => (
  <span ref={ref} role="link" aria-disabled="true" aria-current="page" className={cn(breadcrumbPageVariants(), className)} {...props} />
))
BreadcrumbPage.displayName = "BreadcrumbPage"
// #endregion BreadcrumbPage

// #region BreadcrumbSeparator
type BreadcrumbSeparatorRef = HTMLLIElement

type BreadcrumbSeparatorVariantProps = VariantProps<typeof breadcrumbSeparatorVariants>
type BreadcrumbSeparatorBaseProps = {} & BreadcrumbSeparatorVariantProps
type BreadcrumbSeparatorProps = BreadcrumbSeparatorBaseProps & React.ComponentPropsWithoutRef<"li">

const breadcrumbSeparatorVariants = cva("text-neutral-300")

const BreadcrumbSeparator = React.forwardRef<BreadcrumbSeparatorRef, BreadcrumbSeparatorProps>(({ className, children, ...props }, ref) => (
  <li ref={ref} role="presentation" aria-hidden="true" className={cn(breadcrumbSeparatorVariants(), className)} {...props}>
    {children ?? "/"}
  </li>
))
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"
// #endregion BreadcrumbSeparator

// #region BreadcrumbEllipsis
type BreadcrumbEllipsisRef = HTMLSpanElement

type BreadcrumbEllipsisVariantProps = VariantProps<typeof breadcrumbEllipsisVariants>
type BreadcrumbEllipsisBaseProps = {} & BreadcrumbEllipsisVariantProps
type BreadcrumbEllipsisProps = BreadcrumbEllipsisBaseProps & React.ComponentPropsWithoutRef<"span">

const breadcrumbEllipsisVariants = cva("flex h-9 w-9 items-center justify-center text-neutral-500 transition hover:text-neutral-900")

const BreadcrumbEllipsis = React.forwardRef<BreadcrumbEllipsisRef, BreadcrumbEllipsisProps>(({ className, ...props }, ref) => (
  <span ref={ref} role="presentation" aria-hidden="true" className={cn(breadcrumbEllipsisVariants(), className)} {...props}>
    <DotsHorizontalIcon className="size-4 shrink-0" />
    <span className="sr-only">More</span>
  </span>
))
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis"

// #region BreadcrumbItemIcon
type BreadcrumbItemIconRef = React.ComponentRef<typeof Slot>

type BreadcrumbItemIconVariantProps = VariantProps<typeof breadcrumbItemIconVariants>
type BreadcrumbItemIconBaseProps = {} & BreadcrumbItemIconVariantProps
type BreadcrumbItemIconProps = BreadcrumbItemIconBaseProps & React.ComponentPropsWithoutRef<typeof Slot>

const breadcrumbItemIconVariants = cva("size-4 shrink-0 stroke-[1.5px]")

const BreadcrumbItemIcon = React.forwardRef<BreadcrumbItemIconRef, BreadcrumbItemIconProps>(({ className, children, ...props }, ref) => (
  <Slot ref={ref} id="breadcrumb-item-icon" aria-hidden className={cn(breadcrumbItemIconVariants(), className)} {...props}>
    {children}
  </Slot>
))
BreadcrumbItemIcon.displayName = "BreadcrumbItemIcon"
// #endregion BreadcrumbItemIcon

const Root = Breadcrumb
const List = BreadcrumbList
const Item = BreadcrumbItem
const Link = BreadcrumbLink
const Page = BreadcrumbPage
const Separator = BreadcrumbSeparator
const Ellipsis = BreadcrumbEllipsis
const ItemIcon = BreadcrumbItemIcon

export { Root, List, Item, Link, Page, Separator, Ellipsis, ItemIcon }
export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis, BreadcrumbItemIcon }
export type {
  BreadcrumbProps,
  BreadcrumbListProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbPageProps,
  BreadcrumbSeparatorProps,
  BreadcrumbEllipsisProps,
  BreadcrumbItemIconProps,
}
