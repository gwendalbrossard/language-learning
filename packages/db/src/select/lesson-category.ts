import { Prisma } from "../../generated/client"

export const lessonCategorySelect = Prisma.validator<Prisma.LessonCategorySelect>()({
  id: true,
  emoji: true,
  name: true,
  isPublic: true,

  profileId: true,
  organizationId: true,

  createdAt: true,
  updatedAt: true,
})

export type LessonCategorySelected = Prisma.LessonCategoryGetPayload<{ select: typeof lessonCategorySelect }>
