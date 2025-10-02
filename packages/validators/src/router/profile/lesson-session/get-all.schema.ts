import { z } from "zod/v4"

export const ZProfileLessonSessionGetAllSchema = z.object({ organizationId: z.string().min(1) })
export type TProfileLessonSessionGetAllSchema = z.infer<typeof ZProfileLessonSessionGetAllSchema>
