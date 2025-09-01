"use client"

import type { JSX } from "react"
import { Slot } from "@radix-ui/react-slot"
import { AlertCircle, AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react"
import { Toaster as Sonner, toast as toastSonner } from "sonner"

import { cn } from "@acme/ui/lib/utils"

type ToastType = "error" | "success" | "warning" | "information"

const ToastIcon: Record<ToastType, { icon: JSX.Element; color: string }> = {
  error: { icon: <AlertTriangle />, color: "text-error-500" },
  success: { icon: <CheckCircle2 />, color: "text-success-300" },
  warning: { icon: <AlertCircle />, color: "text-warning-300" },
  information: { icon: <Lightbulb />, color: "text-primary-400" },
}

type ToastBuilderProps = {
  type: ToastType
  title: string
  message: string
}

const toastBuilder = ({ type, title, message }: ToastBuilderProps) => {
  const icon = ToastIcon[type].icon
  const color = ToastIcon[type].color

  return toastSonner.custom((_t) => (
    <div
      className={cn(
        "relative flex w-full justify-between gap-3 rounded-lg bg-linear-to-b from-neutral-800 from-50% to-neutral-900 p-4 sm:w-96",

        // Serves as the inner border
        "before:absolute before:inset-0 before:rounded-lg before:transition",
        "before:shadow-[inset_0_0_0_1px_--theme(--color-neutral-700/100%)]",

        // 1st shadow: Adds depth around the button
        // 2nd shadow: Adds a small white line at the top for depth
        // 3rd shadow: Adds a small black line at the bottom for depth
        "shadow-[0_8px_16px_--theme(--color-neutral-900/24%),inset_0_1px_0.5px_0.5px_--theme(--color-white/44%),inset_0_-1px_2px_1px_--theme(--color-neutral-900/75%)]",
      )}
    >
      <div className="flex gap-3">
        <Slot className={cn("size-5 shrink-0 stroke-[1.67px]", color)}>{icon}</Slot>

        <div className="space-y-1">
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="text-sm text-neutral-300">{message}</p>
        </div>
      </div>
    </div>
  ))
}

export const toast = {
  error: (title: string, message: string) => toastBuilder({ type: "error", title: title, message: message }),
  information: (title: string, message: string) => toastBuilder({ type: "information", title: title, message: message }),
  success: (title: string, message: string) => toastBuilder({ type: "success", title: title, message: message }),
  warning: (title: string, message: string) => toastBuilder({ type: "warning", title: title, message: message }),
}

type ToasterProps = React.ComponentProps<typeof Sonner>
export const Toaster = ({ ...props }: ToasterProps) => {
  return <Sonner duration={8000} {...props} />
}
