import { Prisma } from "../../generated/client"
import { lessonCategorySelect } from "./lesson-category"

export const lessonSelect = Prisma.validator<Prisma.LessonSelect>()({
  id: true,
  emoji: true,
  title: true,
  description: true,
  isPublic: true,

  difficulty: true,

  category: { select: lessonCategorySelect },

  profileId: true,
  organizationId: true,

  createdAt: true,
  updatedAt: true,
})

export type LessonSelected = Prisma.LessonGetPayload<{ select: typeof lessonSelect }>
