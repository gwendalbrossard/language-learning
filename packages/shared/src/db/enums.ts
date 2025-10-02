import type {
  LearningLanguageLevel as LearningLanguageLevelOrigin,
  LessonSessionVocabularyType as LessonSessionVocabularyTypeOrigin,
  MemberRole as MemberRoleOrigin,
  RoleplaySessionMessageRole as RoleplaySessionMessageRoleOrigin,
} from "@acme/db"

export const MemberRole = {
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
} as const satisfies Record<MemberRoleOrigin, string>

export type MemberRole = MemberRoleOrigin

export const LearningLanguageLevel = {
  BEGINNER: "BEGINNER",
  INTERMEDIATE: "INTERMEDIATE",
  ADVANCED: "ADVANCED",
  PROFICIENT: "PROFICIENT",
  FLUENT: "FLUENT",
} as const satisfies Record<LearningLanguageLevelOrigin, string>

export type LearningLanguageLevel = LearningLanguageLevelOrigin

export const RoleplaySessionMessageRole = {
  ASSISTANT: "ASSISTANT",
  USER: "USER",
  SYSTEM: "SYSTEM",
} as const satisfies Record<RoleplaySessionMessageRoleOrigin, string>

export type RoleplaySessionMessageRole = RoleplaySessionMessageRoleOrigin

export const LessonSessionVocabularyType = {
  WORD: "WORD",
  PHRASE: "PHRASE",
  EXPRESSION: "EXPRESSION",
} as const satisfies Record<LessonSessionVocabularyTypeOrigin, string>

export type LessonSessionVocabularyType = LessonSessionVocabularyTypeOrigin
