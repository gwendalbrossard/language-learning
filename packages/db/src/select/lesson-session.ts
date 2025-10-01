import { Prisma } from "../../generated/client"
import { lessonSelect } from "./lesson"
import { lessonSessionMessageSelect } from "./lesson-session-message"

export const lessonSessionSelect = Prisma.validator<Prisma.LessonSessionSelect>()({
  id: true,
  duration: true,
  userSpeakingDuration: true,
  aiSpeakingDuration: true,
  lesson: { select: lessonSelect },
  messages: { select: lessonSessionMessageSelect },
  createdAt: true,
  updatedAt: true,
})

export type LessonSessionSelected = Prisma.LessonSessionGetPayload<{ select: typeof lessonSessionSelect }>
