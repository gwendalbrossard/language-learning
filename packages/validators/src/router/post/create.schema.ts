import { z } from "zod/v4"

export const ZPostCreateSchema = z.object({
  title: z.string(),
  content: z.string().optional(),
})

export type TPostCreateSchema = z.infer<typeof ZPostCreateSchema>
