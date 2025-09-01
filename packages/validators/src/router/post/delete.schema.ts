import { z } from "zod/v4"

export const ZPostDeleteSchema = z.object({
  postId: z.string(),
})

export type TPostDeleteSchema = z.infer<typeof ZPostDeleteSchema>
