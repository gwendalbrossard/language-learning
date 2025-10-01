import { Prisma } from "../../generated/client"

export const lessonSessionMessageSelect = Prisma.validator<Prisma.LessonSessionMessageSelect>()({
  id: true,
  role: true,
  content: true,
  feedback: true,
  createdAt: true,
  updatedAt: true,
})

export type LessonSessionMessageSelected = Prisma.LessonSessionMessageGetPayload<{ select: typeof lessonSessionMessageSelect }>
