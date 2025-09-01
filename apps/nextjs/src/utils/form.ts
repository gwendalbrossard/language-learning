import type { FieldValues, Path, UseFormSetError } from "react-hook-form"
import type { $ZodErrorTree } from "zod/v4/core"

/**
 * Sets form errors based on Zod validation errors.
 *
 * @param setError - Function provided by react-hook-form to set errors for form fields.
 * @param zodError - Treeified error object from Zod validation having field errors.
 */
export function mapErrorsZodToForm<TFieldValues extends FieldValues>(
  setError: UseFormSetError<TFieldValues>,
  zodError: $ZodErrorTree<TFieldValues>,
): void {
  // Handle field errors from properties
  if ("properties" in zodError && zodError.properties) {
    Object.entries(zodError.properties).forEach(([fieldName, errorTree]) => {
      if (errorTree && typeof errorTree === "object" && "errors" in errorTree && Array.isArray(errorTree.errors) && errorTree.errors.length > 0) {
        const fieldPath = fieldName as Path<TFieldValues>
        setError(fieldPath, { type: "FIELD_ERROR", message: errorTree.errors[0] })
      }
    })
  }
}
