import type { VariantProps } from "class-variance-authority"
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "@acme/ui/lib/utils"

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b [&_tr]:bg-neutral-50 hover:[&_tr]:bg-neutral-100", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <tfoot ref={ref} className={cn("border-t bg-neutral-50 font-medium last:[&>tr]:border-b-0 [&>tr>td]:text-neutral-500", className)} {...props} />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn("border-b transition-colors hover:bg-neutral-50 data-[state=selected]:bg-neutral-100", className)} {...props} />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-6 text-left align-middle text-xs font-medium text-nowrap text-neutral-500 [&:has([role=checkbox])]:pr-0 [&:has([role=checkbox])]:pl-4 [&>[role=checkbox]]:translate-y-[2px]",
      className,
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "px-6 py-3 align-middle text-nowrap [&:has([role=checkbox])]:pr-0 [&:has([role=checkbox])]:pl-4 [&>[role=checkbox]]:translate-y-[2px]",
      className,
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn("mt-4 text-sm text-neutral-500", className)} {...props} />
))
TableCaption.displayName = "TableCaption"

const TableEmpty = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn("w-full", className)} {...props} />
))
TableEmpty.displayName = "TableEmpty"

const TableEmptyCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn("pt-10 pb-12 text-center", className)} {...props} />
))
TableEmptyCell.displayName = "TableEmptyCell"

const TableEmptyIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(({ className, ...props }, ref) => (
  <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 179 136" fill="none" className={cn("mb-4 h-auto w-44", className)} {...props}>
    <g filter="url(#a)">
      <rect width={148.344} height={20.002} x={15.5} y={25.999} fill="#fff" rx={3.334} />
      <rect width={147.511} height={19.168} x={15.917} y={26.416} stroke="#EFF1F6" strokeWidth={0.833} rx={2.917} />
      <rect width={85.006} height={6.667} x={38.836} y={32.666} fill="#EFF1F6" rx={3.334} />
      <circle cx={27.162} cy={36} r={5} fill="#EFF1F6" />
    </g>
    <g filter="url(#b)">
      <rect width={119.003} height={16} x={29.5} y={-0.001} fill="#fff" rx={2.674} />
      <rect width={118.335} height={15.331} x={29.834} y={0.333} stroke="#EFF1F6" strokeWidth={0.669} rx={2.34} />
      <rect width={48} height={5.348} x={48.219} y={5.348} fill="#F6F8FB" rx={2.674} />
      <circle cx={38.855} cy={8.022} r={4.011} fill="#F6F8FB" />
    </g>
    <g filter="url(#c)">
      <rect width={119.003} height={16} x={29.5} y={120.001} fill="#fff" rx={2.674} />
      <rect width={118.335} height={15.331} x={29.834} y={120.335} stroke="#EFF1F6" strokeWidth={0.669} rx={2.34} />
      <rect width={72} height={5.348} x={48.219} y={125.35} fill="#F6F8FB" rx={2.674} />
      <circle cx={38.855} cy={128.024} r={4.011} fill="#F6F8FB" />
    </g>
    <g filter="url(#d)">
      <rect width={178} height={24} x={0.5} y={56.001} fill="#fff" rx={4} />
      <rect width={177} height={23} x={1} y={56.501} stroke="#EFF1F6" rx={3.5} />
      <rect width={71} height={8} x={28.5} y={64.001} fill="#DFE3EB" rx={4} />
      <circle cx={14.5} cy={68.001} r={6} fill="#DFE3EB" />
    </g>
    <g filter="url(#e)">
      <rect width={149} height={20} x={14.5} y={90.001} fill="#fff" rx={3.348} />
      <rect width={148.163} height={19.163} x={14.918} y={90.419} stroke="#EFF1F6" strokeWidth={0.837} rx={2.93} />
      <rect width={78.685} height={6.697} x={37.938} y={96.697} fill="#EFF1F6" rx={3.348} />
      <circle cx={26.218} cy={100.046} r={5.022} fill="#EFF1F6" />
    </g>
    <defs>
      <filter id="a" width={148.344} height={20.834} x={15.5} y={25.166} colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
        <feOffset dy={-1.667} />
        <feGaussianBlur stdDeviation={0.417} />
        <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
        <feBlend in2="shape" result="effect1_innerShadow_1185_2661" />
      </filter>
      <filter id="b" width={119.004} height={16.669} x={29.5} y={-0.67} colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
        <feOffset dy={-1.337} />
        <feGaussianBlur stdDeviation={0.334} />
        <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
        <feBlend in2="shape" result="effect1_innerShadow_1185_2661" />
      </filter>
      <filter id="c" width={119.004} height={16.669} x={29.5} y={119.332} colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
        <feOffset dy={-1.337} />
        <feGaussianBlur stdDeviation={0.334} />
        <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
        <feBlend in2="shape" result="effect1_innerShadow_1185_2661" />
      </filter>
      <filter id="d" width={178} height={25} x={0.5} y={55.001} colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
        <feOffset dy={-2} />
        <feGaussianBlur stdDeviation={0.5} />
        <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
        <feBlend in2="shape" result="effect1_innerShadow_1185_2661" />
      </filter>
      <filter id="e" width={149} height={20.837} x={14.5} y={89.164} colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
        <feOffset dy={-1.674} />
        <feGaussianBlur stdDeviation={0.419} />
        <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
        <feBlend in2="shape" result="effect1_innerShadow_1185_2661" />
      </filter>
    </defs>
  </svg>
))
TableEmptyIcon.displayName = "TableEmptyIcon"

// #region TableEmptyCustomIcon
type TableEmptyCustomIconRef = React.ComponentRef<typeof Slot>
type TableEmptyCustomIconVariantProps = VariantProps<typeof tableEmptyCustomIconVariants>
type TableEmptyCustomIconBaseProps = {} & TableEmptyCustomIconVariantProps
export type TableEmptyCustomIconProps = TableEmptyCustomIconBaseProps & React.ComponentPropsWithoutRef<typeof Slot>

const tableEmptyCustomIconVariants = cva("mb-4 size-6 text-neutral-500")

const TableEmptyCustomIcon = React.forwardRef<TableEmptyCustomIconRef, TableEmptyCustomIconProps>(({ className, ...props }, ref) => (
  <Slot ref={ref} className={cn(tableEmptyCustomIconVariants(), className)} {...props} />
))
TableEmptyCustomIcon.displayName = "TableEmptyCustomIcon"
// #endregion TableEmptyCustomIcon

const TableEmptyTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("mb-1 text-base font-medium", className)} {...props} />
))
TableEmptyTitle.displayName = "TableEmptyTitle"

const TableEmptyDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-neutral-500", className)} {...props} />
))
TableEmptyDescription.displayName = "TableEmptyDescription"

const TableEmptyBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mt-6 flex gap-3", className)} {...props} />
))
TableEmptyBody.displayName = "TableEmptyBody"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableEmpty,
  TableEmptyCell,
  TableEmptyIcon,
  TableEmptyCustomIcon,
  TableEmptyTitle,
  TableEmptyDescription,
  TableEmptyBody,
}
