import { azure } from "@ai-sdk/azure"
import { generateObject } from "ai"

import type { LearningLanguageLevel, RoleplaySessionMessage } from "@acme/db"
import { ZFeedbackSchema } from "@acme/validators"

type GetFeedbackProps = {
  transcript: string
  learningLanguage: string
  nativeLanguage: string
  difficulty: LearningLanguageLevel
  roleplaySessionMessages: RoleplaySessionMessage[]
}

// Comprehensive feedback function combining grammar checking and detailed feedback
export async function getFeedback({ transcript, learningLanguage, nativeLanguage, difficulty, roleplaySessionMessages }: GetFeedbackProps) {
  const messages = roleplaySessionMessages
    .map((message) => {
      return JSON.stringify({ role: message.role, content: message.content })
    })
    .join("\n")
  const { object } = await generateObject({
    model: azure("gpt-4o-mini"),
    schemaName: "feedback",
    schema: ZFeedbackSchema,
    prompt: `You are an expert language tutor providing comprehensive feedback for someone learning ${learningLanguage} (their native language is ${nativeLanguage}).
  
  CRITICAL: ALL feedback messages, explanations, and detailed feedback MUST be written in ${nativeLanguage} (the user's native language).
  
  IMPORTANT: This text comes from ORAL CONVERSATION, not written text. It's a speech transcript from someone speaking naturally. Adapt your feedback for spoken language patterns, not formal writing standards.
  
  LEARNER PROFILE:
  - Learning language: ${learningLanguage} (BCP 47 language tag (ISO 639 + ISO 3166)
  - Native language: ${nativeLanguage} (BCP 47 language tag (ISO 639 + ISO 3166)
  - Difficulty level: ${difficulty} (Beginner, Intermediate, Advanced, Proficient, Fluent)
  - Text source: ORAL CONVERSATION TRANSCRIPT (speech-to-text conversion)
  
  CONTEXT:
  ${messages ? `Previous conversation context: ${messages}` : "No previous context available"}
  
  TEXT TO ANALYZE: "${transcript}"
  
  FEEDBACK REQUIREMENTS:
  
  1. OVERALL QUALITY (1-100): Evaluate overall correctness and appropriateness
  2. FEEDBACK: Provide concise, friendly feedback (maximum 2-3 sentences) focusing on the most important issues while being constructive and supportive. Avoid generic encouragement phrases like "Great effort!", "Keep practicing!", or "You're doing well!" (in ${nativeLanguage})
  3. CORRECTED PHRASE: Provide the complete corrected version
  4. CORRECTIONS ARRAY: For each mistake, provide:
     - "wrong": the incorrect part from the original text
     - "correct": the corrected version of that part
     - "explanation": a clear, concise explanation for the correction
     Example: { "wrong": "Je appelle", "correct": "Je m'appelle" }
  
  5. DETAILED SCORING (all messages in ${nativeLanguage}):
     - ACCURACY (1-100): Grammar, syntax, word choice correctness - provide helpful guidance on specific issues found
     - FLUENCY (1-100): How natural and smooth the expression sounds - offer friendly suggestions for improvement
     - VOCABULARY (1-100): Appropriateness and variety of word choices - suggest alternatives in a supportive way
  
  FOCUS AREAS FOR ORAL CONVERSATION:
  ✅ Grammar mistakes that affect meaning or sound unnatural in speech
  ✅ Vocabulary errors or unnatural word choices for spoken language
  ✅ Sentence structure issues that disrupt conversational flow
  ✅ Appropriateness for oral communication at this difficulty level
  ✅ Natural spoken expression vs. literal translation from native language
  ✅ Pronunciation-related grammar issues (liaisons, contractions, etc.)
  
  IGNORE (COMMON IN ORAL SPEECH):
  ❌ Punctuation/capitalization (transcript artifacts)
  ❌ Filler words ("um", "uh", "like", "euh", etc.)
  ❌ Minor transcription errors or misheard words
  ❌ Acceptable informal speech patterns and colloquialisms
  ❌ Incomplete sentences that are natural in conversation
  ❌ Repetitions or self-corrections during speech
  ❌ Casual contractions and spoken shortcuts
  
  TONE: Be friendly, supportive, and educational while remaining specific and actionable. Focus on helping the learner improve their SPOKEN language skills through constructive guidance. Remember this is oral communication, not academic writing. Avoid generic praise but maintain a warm, encouraging approach. Write ALL feedback in ${nativeLanguage}.`,
    temperature: 0.3,
  })

  return object
}
