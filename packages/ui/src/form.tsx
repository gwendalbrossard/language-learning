import type { VariantProps } from "class-variance-authority"
import type { ControllerProps, FieldPath, FieldValues, UseFormProps } from "react-hook-form"
import type { ZodType } from "zod/v4"
import * as React from "react"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { useForm as __useForm, Controller, FormProvider, useFormContext } from "react-hook-form"

import { Label as Label_Component } from "@acme/ui/label"
import { cn } from "@acme/ui/lib/utils"

export function useForm<TOut extends FieldValues, TIn extends FieldValues>(
  props: Omit<UseFormProps<TIn, unknown, TOut>, "resolver"> & {
    schema: ZodType<TOut, TIn>
  },
) {
  const form = __useForm<TIn, unknown, TOut>({
    ...props,
    resolver: standardSchemaResolver(props.schema, undefined),
  })

  return form
}

const Form = FormProvider

type FormFieldContextValue<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue)

// #region FormField
const FormField = <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}
// #endregion FormField

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue)

// #region FormItem
type FormItemRef = HTMLDivElement

type FormItemVariantProps = VariantProps<typeof formItemVariants>
type FormItemBaseProps = {} & FormItemVariantProps
type FormItemProps = FormItemBaseProps & React.ComponentPropsWithoutRef<"div">

const formItemVariants = cva("flex flex-col gap-2")

const FormItem = React.forwardRef<FormItemRef, FormItemProps>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn(formItemVariants(), className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

// #region FormLabel
type FormLabelRef = React.ComponentRef<typeof Label_Component>

type FormLabelVariantProps = VariantProps<typeof formLabelVariants>
type FormLabelBaseProps = {} & FormLabelVariantProps
type FormLabelProps = FormLabelBaseProps & React.ComponentPropsWithoutRef<typeof Label_Component>

const formLabelVariants = cva("", {
  variants: {
    error: {
      true: "text-error-600",
    },
  },
  defaultVariants: {
    error: false,
  },
})

const FormLabel = React.forwardRef<FormLabelRef, FormLabelProps>(({ size, className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return <Label_Component size={size} ref={ref} className={cn(formLabelVariants({ error: !!error }), className)} htmlFor={formItemId} {...props} />
})
FormLabel.displayName = "FormLabel"
// #endregion FormLabel

// #region FormControl
type FormControlRef = React.ComponentRef<typeof Slot>
type FormControlProps = React.ComponentPropsWithoutRef<typeof Slot>

const FormControl = React.forwardRef<FormControlRef, FormControlProps>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"
// #endregion FormControl

// #region FormDescription
type FormDescriptionRef = HTMLParagraphElement

type FormDescriptionVariantProps = VariantProps<typeof formDescriptionVariants>
type FormDescriptionBaseProps = {} & FormDescriptionVariantProps
type FormDescriptionProps = FormDescriptionBaseProps & React.ComponentPropsWithoutRef<"p">

const formDescriptionVariants = cva("text-sm text-neutral-500 peer-disabled:text-neutral-400")

const FormDescription = React.forwardRef<FormDescriptionRef, FormDescriptionProps>(({ className, ...props }, ref) => {
  const { error, formDescriptionId } = useFormField()

  if (error) {
    return null
  }

  return <p ref={ref} id={formDescriptionId} className={cn(formDescriptionVariants(), className)} {...props} />
})
FormDescription.displayName = "FormDescription"
// #endregion FormDescription

// #region FormMessage
type FormMessageRef = HTMLParagraphElement

type FormMessageVariantProps = VariantProps<typeof formMessageVariants>
type FormMessageBaseProps = {} & FormMessageVariantProps
type FormMessageProps = FormMessageBaseProps & React.ComponentPropsWithoutRef<"p">

const formMessageVariants = cva("text-error-600 text-sm")

const FormMessage = React.forwardRef<FormMessageRef, FormMessageProps>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error.message) : children

  if (!body) {
    return null
  }

  return (
    <p ref={ref} id={formMessageId} className={cn(formMessageVariants(), className)} {...props}>
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"
// #endregion FormMessage

const Root = Form
const Field = FormField
const Item = FormItem
const Label = FormLabel
const Control = FormControl
const Description = FormDescription
const Message = FormMessage

export { Root, Field, Item, Label, Control, Description, Message }

export { useFormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField }
