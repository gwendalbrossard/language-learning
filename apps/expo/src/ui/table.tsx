import * as React from "react"
import * as TablePrimitive from "@rn-primitives/table"

import { TextClassContext } from "~/ui/text"
import { cn } from "~/utils/utils"

const Table = React.forwardRef<TablePrimitive.RootRef, TablePrimitive.RootProps>(({ className, ...props }, ref) => (
  <TablePrimitive.Root
    ref={ref}
    className={cn("shadow-custom-xs w-full caption-bottom rounded-xl border border-neutral-200 bg-neutral-50 p-1 text-sm", className)}
    {...props}
  />
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<TablePrimitive.HeaderRef, TablePrimitive.HeaderProps>(({ className, ...props }, ref) => (
  <TablePrimitive.Header ref={ref} className={cn("flex-row items-center justify-between", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<TablePrimitive.BodyRef, TablePrimitive.BodyProps>(({ className, style, ...props }, ref) => (
  <TablePrimitive.Body
    ref={ref}
    className={cn("shadow-custom-xs rounded-xl border border-neutral-200 bg-white", className)}
    style={[{ minHeight: 2 }, style]}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<TablePrimitive.FooterRef, TablePrimitive.FooterProps>(({ className, ...props }, ref) => (
  <TablePrimitive.Footer ref={ref} className={cn("font-medium", className)} {...props} />
))
TableFooter.displayName = "TableFooter"

const TableRowHeader = React.forwardRef<TablePrimitive.RowRef, TablePrimitive.RowProps>(({ className, ...props }, ref) => (
  <TablePrimitive.Row ref={ref} className={cn("flex-row items-center justify-between px-2 py-1", className)} {...props} />
))
TableRowHeader.displayName = "TableRowHeader"

const TableRowBody = React.forwardRef<TablePrimitive.RowRef, TablePrimitive.RowProps & { isLast?: boolean }>(
  ({ className, isLast, ...props }, ref) => (
    <TablePrimitive.Row
      ref={ref}
      className={cn("flex-row items-center justify-between px-2 py-2", !isLast && "border-b border-neutral-200", className)}
      {...props}
    />
  ),
)
TableRowBody.displayName = "TableRowBody"

const TableHead = React.forwardRef<TablePrimitive.HeadRef, TablePrimitive.HeadProps>(({ className, ...props }, ref) => (
  <TextClassContext.Provider value="text-neutral-500 text-xs font-medium uppercase">
    <TablePrimitive.Head ref={ref} className={cn("", className)} {...props} />
  </TextClassContext.Provider>
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<TablePrimitive.CellRef, TablePrimitive.CellProps>(({ className, ...props }, ref) => (
  <TextClassContext.Provider value="text-neutral-700 text-sm font-medium">
    <TablePrimitive.Cell ref={ref} className={cn("", className)} {...props} />
  </TextClassContext.Provider>
))
TableCell.displayName = "TableCell"

const Root = Table
const Body = TableBody
const Cell = TableCell
const Footer = TableFooter
const Head = TableHead
const Header = TableHeader
const RowBody = TableRowBody
const RowHeader = TableRowHeader

export { Root, Body, Cell, Footer, Head, Header, RowBody, RowHeader }
export { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRowBody, TableRowHeader }
