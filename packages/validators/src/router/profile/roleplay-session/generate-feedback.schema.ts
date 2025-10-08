import { z } from "zod/v4"

export const ZProfileRoleplaySessionGenerateFeedbackSchema = z.object({ roleplaySessionId: z.string().min(1), organizationId: z.string().min(1) })
export type TProfileRoleplaySessionGenerateFeedbackSchema = z.infer<typeof ZProfileRoleplaySessionGenerateFeedbackSchema>
