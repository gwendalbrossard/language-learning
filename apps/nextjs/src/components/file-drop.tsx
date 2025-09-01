"use client"

import type { SlotProps } from "@radix-ui/react-slot"
import type { VariantProps } from "class-variance-authority"
import type { FC } from "react"
import type { DropzoneState } from "react-dropzone"
import * as React from "react"
import { useContext } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "@acme/ui/lib/utils"

// #region FileDropContex
export type FileDropSize = "sm" | "md"

type FileDropContextProps = { size: FileDropSize }
const FileDropContext = React.createContext<FileDropContextProps>({ size: "md" })

type FileDropProviderProps = { children: React.ReactNode; size: FileDropSize }
const FileDropProvider: FC<FileDropProviderProps> = ({ children, size }) => (
  <FileDropContext.Provider value={{ size }}>{children}</FileDropContext.Provider>
)
const useFileDrop = () => useContext(FileDropContext)
// #endregion FileDropContex

// #region FileDrop
type FileDropRef = HTMLDivElement
export type FileDropVariantProps = Omit<VariantProps<typeof fileDropVariants>, "size">
type FileDropBaseProps = { size?: FileDropSize } & FileDropVariantProps
export type FileDropProps = FileDropBaseProps & DropzoneState & React.HTMLAttributes<HTMLDivElement>

export const fileDropVariants = cva(
  cn(
    "group flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-dashed transition-all focus:outline-none",
    "border-neutral-300 bg-neutral-50 hover:border-neutral-400 hover:bg-neutral-100",
    "text-neutral-600 group-hover:text-neutral-700",
    "data-[invalid=true]:border-error-300 data-[invalid=true]:hover:border-error-400 data-[invalid=true]:hover:bg-error-100 data-[invalid=true]:bg-red-50",
    "data-[invalid=true]:text-error-600 data-[invalid=true]:group-hover:text-error-700",
  ),
  {
    variants: {
      size: {
        sm: "size-14",
        md: "size-16",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
)

const FileDrop = React.forwardRef<FileDropRef, FileDropProps>(({ size = "md", className, children, ...props }, ref) => {
  const { getRootProps, getInputProps, ...restDropzoneProps } = props

  const {
    acceptedFiles: _acceptedFiles,
    fileRejections: _fileRejections,
    rootRef: _rootRef,
    inputRef: _inputRef,
    open: _open,
    isDragActive: _isDragActive,
    isDragAccept: _isDragAccept,
    isDragReject: _isDragReject,
    isFocused: _isFocused,
    isFileDialogActive: _isFileDialogActive,
    ...restProps
  } = restDropzoneProps

  return (
    <FileDropProvider size={size}>
      <div ref={ref} className={cn(fileDropVariants({ size }), className)} {...getRootProps()} {...restProps}>
        <input {...getInputProps()} />
        {children}
      </div>
    </FileDropProvider>
  )
})
FileDrop.displayName = "FileDrop"
// #endregion FileDrop

// #region FileDropIcon
type FileDropIconVariantProps = Omit<VariantProps<typeof fileDropIconVariants>, "size">
export type FileDropIconBaseProps = {} & FileDropIconVariantProps
export type FileDropIconProps = FileDropIconBaseProps & SlotProps

const fileDropIconVariants = cva("shrink-0 stroke-[1.5px]", {
  variants: {
    size: {
      sm: "size-4",
      md: "size-4.5",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

const FileDropIcon = React.forwardRef<HTMLElement, FileDropIconProps>(({ className, children, ...props }, ref) => {
  const { size } = useFileDrop()
  return (
    <Slot ref={ref} aria-hidden className={cn(fileDropIconVariants({ size }), className)} {...props}>
      {children}
    </Slot>
  )
})
FileDropIcon.displayName = "FileDropIcon"
// #endregion FileDropIcon

export { FileDrop, FileDropIcon }
