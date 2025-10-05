import { z } from "zod"

import { LearningLanguageLevel } from "@acme/shared/db"

export enum LearningReason {
  CAREER_GROWTH = "CAREER_GROWTH",
  TRAVEL = "TRAVEL",
  STUDY_EXAMS = "STUDY_EXAMS",
  MOVING_ABROAD = "MOVING_ABROAD",
  RELATIONSHIPS = "RELATIONSHIPS",
  CULTURE_MEDIA = "CULTURE_MEDIA",
  PERSONAL_CHALLENGE = "PERSONAL_CHALLENGE",
}

export enum CurrentPractice {
  NOT_STARTED = "NOT_STARTED",
  APPS_FLASHCARDS = "APPS_FLASHCARDS",
  CLASSES_TUTOR = "CLASSES_TUTOR",
  PODCASTS_VIDEOS = "PODCASTS_VIDEOS",
  SPEAKING_FRIENDS = "SPEAKING_FRIENDS",
  MIXED_APPROACH = "MIXED_APPROACH",
}

export enum SpeakingStruggle {
  FINDING_WORDS = "FINDING_WORDS",
  UNDERSTANDING_SPEED = "UNDERSTANDING_SPEED",
  BUILDING_SENTENCES = "BUILDING_SENTENCES",
  PRONUNCIATION = "PRONUNCIATION",
  REMEMBERING_VOCABULARY = "REMEMBERING_VOCABULARY",
  CONFIDENCE = "CONFIDENCE",
  GRAMMAR_ACCURACY = "GRAMMAR_ACCURACY",
}

export enum SpeakingComfort {
  VERY_UNCOMFORTABLE = "VERY_UNCOMFORTABLE",
  SOMEWHAT_UNCOMFORTABLE = "SOMEWHAT_UNCOMFORTABLE",
  NEUTRAL = "NEUTRAL",
  SOMEWHAT_COMFORTABLE = "SOMEWHAT_COMFORTABLE",
  VERY_COMFORTABLE = "VERY_COMFORTABLE",
}

export enum DailyCommitment {
  FIVE_MIN = "FIVE_MIN",
  TEN_MIN = "TEN_MIN",
  FIFTEEN_MIN = "FIFTEEN_MIN",
  TWENTY_MIN = "TWENTY_MIN",
  THIRTY_MIN = "THIRTY_MIN",
}

export enum ProgressGoal {
  TWO_WEEKS = "TWO_WEEKS",
  ONE_MONTH = "ONE_MONTH",
  THREE_MONTHS = "THREE_MONTHS",
  OWN_PACE = "OWN_PACE",
}

export const ZProfileOnboardSchema = z.object({
  learningLanguage: z.string(),
  learningLanguageLevel: z.enum(LearningLanguageLevel),
  learningReason: z.enum(LearningReason),
  currentPractice: z.enum(CurrentPractice),
  speakingStruggles: z.array(z.enum(SpeakingStruggle)),
  speakingComfort: z.enum(SpeakingComfort),
  dailyCommitment: z.enum(DailyCommitment),
  progressGoal: z.enum(ProgressGoal),
})

export type TProfileOnboardSchema = z.infer<typeof ZProfileOnboardSchema>
