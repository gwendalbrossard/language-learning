import { prisma } from "@acme/db"

export type IncrementProfileStats = {
  tokensInputText?: number
  tokensInputTextCached?: number
  tokensInputAudio?: number
  tokensInputAudioCached?: number
  tokensOutputText?: number
  tokensOutputAudio?: number
  tokensTranslationInput?: number
  tokensTranslationOutput?: number
  tokensPronunciationInput?: number
  tokensPronunciationOutput?: number
  secondsSpoken?: number
  secondsListening?: number
  secondsInLessons?: number
  secondsInRoleplays?: number
  wordsSpoken?: number
  lessonsDone?: number
  roleplaysDone?: number
  vocabularyLearned?: number
  daysOfPractice?: number
  currentStreak?: number
  longestStreak?: number
  profileId: string
}

export async function incrementProfileStats({
  profileId,
  tokensInputText = 0,
  tokensInputTextCached = 0,
  tokensInputAudio = 0,
  tokensInputAudioCached = 0,
  tokensOutputText = 0,
  tokensOutputAudio = 0,
  tokensTranslationInput = 0,
  tokensTranslationOutput = 0,
  tokensPronunciationInput = 0,
  tokensPronunciationOutput = 0,
  secondsSpoken = 0,
  secondsListening = 0,
  secondsInLessons = 0,
  secondsInRoleplays = 0,
  wordsSpoken = 0,
  lessonsDone = 0,
  roleplaysDone = 0,
  vocabularyLearned = 0,
  daysOfPractice = 0,
  currentStreak = 0,
  longestStreak = 0,
}: IncrementProfileStats) {
  return await prisma.profile.update({
    where: { id: profileId },
    data: {
      tokensInputText: { increment: tokensInputText },
      tokensInputTextCached: { increment: tokensInputTextCached },
      tokensInputAudio: { increment: tokensInputAudio },
      tokensInputAudioCached: { increment: tokensInputAudioCached },
      tokensOutputText: { increment: tokensOutputText },
      tokensOutputAudio: { increment: tokensOutputAudio },
      tokensTranslationInput: { increment: tokensTranslationInput },
      tokensTranslationOutput: { increment: tokensTranslationOutput },
      tokensPronunciationInput: { increment: tokensPronunciationInput },
      tokensPronunciationOutput: { increment: tokensPronunciationOutput },
      secondsSpoken: { increment: secondsSpoken },
      secondsListening: { increment: secondsListening },
      secondsInLessons: { increment: secondsInLessons },
      secondsInRoleplays: { increment: secondsInRoleplays },
      wordsSpoken: { increment: wordsSpoken },
      lessonsDone: { increment: lessonsDone },
      roleplaysDone: { increment: roleplaysDone },
      vocabularyLearned: { increment: vocabularyLearned },
      daysOfPractice: { increment: daysOfPractice },
      currentStreak: { increment: currentStreak },
      longestStreak: { increment: longestStreak },
    },
  })
}
