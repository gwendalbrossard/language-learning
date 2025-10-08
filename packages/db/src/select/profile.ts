import { Prisma } from "../../generated/client"
import { streakDaySelect } from "./streak-day"

export const profileSelect = Prisma.validator<Prisma.ProfileSelect>()({
  id: true,
  email: true,
  avatar: true,
  name: true,
  timezone: true,
  nativeLanguage: true,
  learningLanguage: true,
  learningLanguageLevel: true,
  secondsSpoken: true,
  secondsListening: true,
  secondsInLessons: true,
  secondsInRoleplays: true,
  wordsSpoken: true,
  lessonsDone: true,
  roleplaysDone: true,
  vocabularyLearned: true,
  daysOfPractice: true,
  completedOnboarding: true,
  currentStreak: true,
  longestStreak: true,
  lastStreakDay: { select: streakDaySelect },
  revenueCatCustomer: true,
  createdAt: true,
})

export type ProfileSelected = Prisma.ProfileGetPayload<{ select: typeof profileSelect }>
