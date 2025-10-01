import { Prisma } from "../../generated/client"
import { lessonSelect } from "./lesson"
import { lessonSessionMessageSelect } from "./lesson-session-message"
import { lessonSessionVocabularySelect } from "./lesson-session-vocabulary"

export const lessonSessionSelect = Prisma.validator<Prisma.LessonSessionSelect>()({
  id: true,
  duration: true,
  userSpeakingDuration: true,
  aiSpeakingDuration: true,
  lesson: { select: lessonSelect },
  messages: { select: lessonSessionMessageSelect },
  vocabulary: { select: lessonSessionVocabularySelect },
  createdAt: true,
  updatedAt: true,
})

export type LessonSessionSelected = Prisma.LessonSessionGetPayload<{ select: typeof lessonSessionSelect }>
