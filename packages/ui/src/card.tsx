import type { VariantProps } from "class-variance-authority"
import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@acme/ui/lib/utils"

// #region Card
type CardRef = HTMLDivElement

type CardVariantProps = VariantProps<typeof cardVariants>
type CardBaseProps = {} & CardVariantProps
type CardProps = CardBaseProps & React.ComponentPropsWithoutRef<"div">

const cardVariants = cva("overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 shadow-xs")

const Card = React.forwardRef<CardRef, CardProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(cardVariants(), className)} {...props} />
))
Card.displayName = "Card"
// #endregion Card

// #region CardHeader
type CardHeaderRef = HTMLDivElement

type CardHeaderVariantProps = VariantProps<typeof cardHeaderVariants>
type CardHeaderBaseProps = {} & CardHeaderVariantProps
type CardHeaderProps = CardHeaderBaseProps & React.ComponentPropsWithoutRef<"div">

const cardHeaderVariants = cva("p-5")

const CardHeader = React.forwardRef<CardHeaderRef, CardHeaderProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(cardHeaderVariants(), className)} {...props} />
))
CardHeader.displayName = "CardHeader"
// #endregion CardHeader

// #region CardTitle
type CardTitleRef = HTMLHeadingElement

type CardTitleVariantProps = VariantProps<typeof cardTitleVariants>
type CardTitleBaseProps = {} & CardTitleVariantProps
type CardTitleProps = CardTitleBaseProps & React.ComponentPropsWithoutRef<"h3">

const cardTitleVariants = cva("text-sm font-medium text-neutral-800")

const CardTitle = React.forwardRef<CardTitleRef, CardTitleProps>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn(cardTitleVariants(), className)} {...props} />
))
CardTitle.displayName = "CardTitle"
// #endregion CardTitle

// #region CardDescription
type CardDescriptionRef = HTMLParagraphElement

type CardDescriptionVariantProps = VariantProps<typeof cardDescriptionVariants>
type CardDescriptionBaseProps = {} & CardDescriptionVariantProps
type CardDescriptionProps = CardDescriptionBaseProps & React.ComponentPropsWithoutRef<"p">

const cardDescriptionVariants = cva("text-xs text-neutral-600")

const CardDescription = React.forwardRef<CardDescriptionRef, CardDescriptionProps>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn(cardDescriptionVariants(), className)} {...props} />
))
CardDescription.displayName = "CardDescription"
// #endregion CardDescription

// #region CardContent
type CardContentRef = HTMLDivElement

type CardContentVariantProps = VariantProps<typeof cardContentVariants>
type CardContentBaseProps = {} & CardContentVariantProps
type CardContentProps = CardContentBaseProps & React.ComponentPropsWithoutRef<"div">

const cardContentVariants = cva("border-t border-neutral-200 bg-white")

const CardContent = React.forwardRef<CardContentRef, CardContentProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(cardContentVariants(), className)} {...props} />
))
CardContent.displayName = "CardContent"
// #endregion CardContent

// #region CardRow
type CardRowRef = HTMLFieldSetElement

type CardRowVariantProps = VariantProps<typeof cardRowVariants>
type CardRowBaseProps = {} & CardRowVariantProps
type CardRowProps = CardRowBaseProps & React.ComponentPropsWithoutRef<"fieldset">

const cardRowVariants = cva("grid grid-cols-1 gap-8 px-5 py-6 not-last:border-b not-last:border-neutral-200 sm:grid-cols-2 sm:gap-20")

const CardRow = React.forwardRef<CardRowRef, CardRowProps>(({ className, ...props }, ref) => (
  <fieldset ref={ref} className={cn(cardRowVariants(), className)} {...props} />
))
CardRow.displayName = "CardRow"
// #endregion CardRow

// #region CardRowHeader
type CardRowHeaderRef = HTMLDivElement

type CardRowHeaderVariantProps = VariantProps<typeof cardRowHeaderVariants>
type CardRowHeaderBaseProps = {} & CardRowHeaderVariantProps
type CardRowHeaderProps = CardRowHeaderBaseProps & React.ComponentPropsWithoutRef<"div">

const cardRowHeaderVariants = cva("")

const CardRowHeader = React.forwardRef<CardRowHeaderRef, CardRowHeaderProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(cardRowHeaderVariants(), className)} {...props} />
))
CardRowHeader.displayName = "CardRowHeader"
// #endregion CardRowHeader

// #region CardRowLegend
type CardRowLegendRef = HTMLLegendElement

type CardRowLegendVariantProps = VariantProps<typeof cardRowLegendVariants>
type CardRowLegendBaseProps = {} & CardRowLegendVariantProps
type CardRowLegendProps = CardRowLegendBaseProps & React.ComponentPropsWithoutRef<"legend">

const cardRowLegendVariants = cva("text-sm font-medium text-neutral-700")

const CardRowLegend = React.forwardRef<CardRowLegendRef, CardRowLegendProps>(({ className, ...props }, ref) => (
  <legend ref={ref} className={cn(cardRowLegendVariants(), className)} {...props} />
))
CardRowLegend.displayName = "CardRowLegend"
// #endregion CardRowLegend

// #region CardRowDescription
type CardRowDescriptionRef = HTMLParagraphElement

type CardRowDescriptionVariantProps = VariantProps<typeof cardRowDescriptionVariants>
type CardRowDescriptionBaseProps = {} & CardRowDescriptionVariantProps
type CardRowDescriptionProps = CardRowDescriptionBaseProps & React.ComponentPropsWithoutRef<"p">

const cardRowDescriptionVariants = cva("text-xs text-neutral-500")
const CardRowDescription = React.forwardRef<CardRowDescriptionRef, CardRowDescriptionProps>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn(cardRowDescriptionVariants(), className)} {...props} />
))
CardRowDescription.displayName = "CardRowDescription"
// #endregion CardRowDescription

// #region CardRowBody
type CardRowBodyRef = HTMLDivElement

type CardRowBodyVariantProps = VariantProps<typeof cardRowBodyVariants>
type CardRowBodyBaseProps = {} & CardRowBodyVariantProps
type CardRowBodyProps = CardRowBodyBaseProps & React.ComponentPropsWithoutRef<"div">

const cardRowBodyVariants = cva("")

const CardRowBody = React.forwardRef<CardRowBodyRef, CardRowBodyProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(cardRowBodyVariants(), className)} {...props} />
))
CardRowBody.displayName = "CardRowBody"
// #endregion CardRowBody

const Root = Card
const Header = CardHeader
const Title = CardTitle
const Description = CardDescription
const Content = CardContent
const Row = CardRow
const RowHeader = CardRowHeader
const RowLegend = CardRowLegend
const RowDescription = CardRowDescription
const RowBody = CardRowBody

export { Root, Header, Title, Description, Content, Row, RowHeader, RowLegend, RowDescription, RowBody }
export type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardRowProps,
  CardRowHeaderProps,
  CardRowLegendProps,
  CardRowDescriptionProps,
  CardRowBodyProps,
}
export {
  cardVariants,
  cardHeaderVariants,
  cardTitleVariants,
  cardDescriptionVariants,
  cardContentVariants,
  cardRowVariants,
  cardRowHeaderVariants,
  cardRowLegendVariants,
  cardRowDescriptionVariants,
  cardRowBodyVariants,
}
