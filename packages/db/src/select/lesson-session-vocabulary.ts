import { Prisma } from "../../generated/client"

export const lessonSessionVocabularySelect = Prisma.validator<Prisma.LessonSessionVocabularySelect>()({
  id: true,
  type: true,
  text: true,
  translation: true,
  information: true,

  createdAt: true,
  updatedAt: true,
})

export type LessonSessionVocabularySelected = Prisma.LessonSessionVocabularyGetPayload<{ select: typeof lessonSessionVocabularySelect }>
