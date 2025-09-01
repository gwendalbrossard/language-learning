"use client"

import type { VariantProps } from "class-variance-authority"
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cva } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@acme/ui/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogClose = DialogPrimitive.Close
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal

// #region DialogOverlay
type DiaglogOverlayRef = React.ComponentRef<typeof DialogPrimitive.Overlay>

type DiaglogOverlayVariantProps = VariantProps<typeof diaglogOverlayVariants>
type DiaglogOverlayBaseProps = {} & DiaglogOverlayVariantProps
type DiaglogOverlayProps = DiaglogOverlayBaseProps & React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>

const diaglogOverlayVariants = cva(
  cn(
    "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-neutral-900/50",
  ),
)

const DialogOverlay = React.forwardRef<DiaglogOverlayRef, DiaglogOverlayProps>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay ref={ref} className={cn(diaglogOverlayVariants(), className)} {...props} />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName
// #endregion DialogOverlay

// #region DialogContent
type DialogContentRef = React.ComponentRef<typeof DialogPrimitive.Content>

type DialogContentVariantProps = VariantProps<typeof dialogContentVariants>
type DialogContentBaseProps = {} & DialogContentVariantProps
type DialogContentProps = DialogContentBaseProps & React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>

const dialogContentVariants = cva(
  cn(
    "fixed top-[50%] left-[50%] z-50 translate-x-[-50%] translate-y-[-50%]",
    "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200",
    "grid w-full max-w-[90vw] rounded-xl border border-neutral-200 bg-white shadow-xl sm:max-w-md",
    "focus-visible:outline-hidden",
    "has-[#dialog-body]:bg-neutral-50",
  ),
)
const DialogContent = React.forwardRef<DialogContentRef, DialogContentProps>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content ref={ref} className={cn(dialogContentVariants(), className)} {...props}>
      {children}
      <DialogButtonClose />
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName
// #endregion DialogContent

// #region DialogButtonClose
type DialogButtonCloseRef = React.ComponentRef<typeof DialogPrimitive.Close>

type DialogButtonCloseVariantProps = VariantProps<typeof dialogButtonCloseVariants>
type DialogButtonCloseBaseProps = {} & DialogButtonCloseVariantProps
type DialogButtonCloseProps = DialogButtonCloseBaseProps & React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>

const dialogButtonCloseVariants = cva(
  cn(
    "group absolute top-4 right-5 flex size-7 cursor-pointer items-center justify-center rounded-sm",
    "focus-within:ring-3 focus-visible:outline-hidden",
    "text-neutral-400 focus-within:ring-neutral-900/4 hover:bg-neutral-50",
    "group-has-[#dialog-body]:text-neutral-500 focus-within:group-has-[#dialog-body]:ring-neutral-900/8 hover:group-has-[#dialog-body]:bg-neutral-100",
  ),
)

const DialogButtonClose = React.forwardRef<DialogButtonCloseRef, DialogButtonCloseProps>(({ className, ...props }, ref) => (
  <DialogPrimitive.Close ref={ref} className={cn(dialogButtonCloseVariants(), className)} {...props}>
    <X className="size-4 shrink-0 stroke-[1.5] transition group-hover:text-neutral-700" />
    <span className="sr-only">Close</span>
  </DialogPrimitive.Close>
))
DialogButtonClose.displayName = DialogPrimitive.Close.displayName
// #endregion DialogClose

// #region DialogHeader
type DialogHeaderRef = HTMLDivElement

type DialogHeaderVariantProps = VariantProps<typeof dialogHeaderVariants>
type DialogHeaderBaseProps = {} & DialogHeaderVariantProps
type DialogHeaderProps = DialogHeaderBaseProps & React.ComponentPropsWithoutRef<"div">

const dialogHeaderVariants = cva("border-b border-neutral-200 px-5 py-4")

const DialogHeader = React.forwardRef<DialogHeaderRef, DialogHeaderProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(dialogHeaderVariants(), className)} {...props} />
))
DialogHeader.displayName = "DialogHeader"
// #endregion DialogHeader

// #region DialogBody
type DialogBodyRef = HTMLDivElement

type DialogBodyVariantProps = VariantProps<typeof dialogBodyVariants>
type DialogBodyBaseProps = {} & DialogBodyVariantProps
type DialogBodyProps = DialogBodyBaseProps & React.ComponentPropsWithoutRef<"div">

const dialogBodyVariants = cva("bg-white px-5 pt-4.5 pb-6 text-sm ring-1 ring-neutral-200")

const DialogBody = React.forwardRef<DialogBodyRef, DialogBodyProps>(({ className, ...props }, ref) => (
  <div ref={ref} id="dialog-body" className={cn(dialogBodyVariants(), className)} {...props} />
))
DialogBody.displayName = "DialogBody"
// #endregion DialogBody

// #region DialogFooter
type DialogFooterRef = HTMLDivElement

type DialogFooterVariantProps = VariantProps<typeof dialogFooterVariants>
type DialogFooterBaseProps = {} & DialogFooterVariantProps
type DialogFooterProps = DialogFooterBaseProps & React.ComponentPropsWithoutRef<"div">

const dialogFooterVariants = cva("flex w-full flex-col justify-end gap-3 px-5 pt-4 pb-3.5 sm:flex-row")

const DialogFooter = React.forwardRef<DialogFooterRef, DialogFooterProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(dialogFooterVariants(), className)} {...props} />
))
DialogFooter.displayName = "DialogFooter"
// #endregion DialogFooter

// #region DialogTitle
type DialogTitleRef = React.ComponentRef<typeof DialogPrimitive.Title>

type DialogTitleVariantProps = VariantProps<typeof dialogTitleVariants>
type DialogTitleBaseProps = {} & DialogTitleVariantProps
type DialogTitleProps = DialogTitleBaseProps & React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>

const dialogTitleVariants = cva("mr-9 text-lg font-medium")

const DialogTitle = React.forwardRef<DialogTitleRef, DialogTitleProps>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn(dialogTitleVariants(), className)} {...props} />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName
// #endregion DialogTitle

// #region DialogDescription
type DialogDescriptionRef = React.ComponentRef<typeof DialogPrimitive.Description>

type DialogDescriptionVariantProps = VariantProps<typeof dialogDescriptionVariants>
type DialogDescriptionBaseProps = {} & DialogDescriptionVariantProps
type DialogDescriptionProps = DialogDescriptionBaseProps & React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>

const dialogDescriptionVariants = cva("mt-1 text-sm text-neutral-500")

const DialogDescription = React.forwardRef<DialogDescriptionRef, DialogDescriptionProps>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn(dialogDescriptionVariants(), className)} {...props} />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName
// #endregion DialogDescription

const Root = Dialog
const Content = DialogContent
const Overlay = DialogOverlay
const Header = DialogHeader
const Body = DialogBody
const Footer = DialogFooter
const Title = DialogTitle
const Description = DialogDescription
const Close = DialogClose
const Trigger = DialogTrigger
const Portal = DialogPortal

export { Root, Content, Overlay, Header, Body, Footer, Title, Description, Close, Trigger, Portal }

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogPortal,
  DialogOverlay,
  DialogButtonClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}

export type { DialogContentProps, DialogHeaderProps, DialogFooterProps, DialogTitleProps, DialogDescriptionProps }
export {
  dialogContentVariants,
  dialogHeaderVariants,
  dialogFooterVariants,
  dialogTitleVariants,
  dialogDescriptionVariants,
  dialogButtonCloseVariants,
}
