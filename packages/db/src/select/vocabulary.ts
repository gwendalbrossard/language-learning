import { Prisma } from "../../generated/client"

export const vocabularySelect = Prisma.validator<Prisma.VocabularySelect>()({
  id: true,
  type: true,
  text: true,
  romanization: true,
  translation: true,
  learningLanguage: true,
  audioStorageKey: true,
  masteredAt: true,

  createdAt: true,
  updatedAt: true,
})

export type VocabularySelected = Prisma.VocabularyGetPayload<{ select: typeof vocabularySelect }>
