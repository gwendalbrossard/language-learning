import { z } from "zod/v4"

export const ZPostByIdSchema = z.object({
  postId: z.string(),
})

export type TPostByIdSchema = z.infer<typeof ZPostByIdSchema>
