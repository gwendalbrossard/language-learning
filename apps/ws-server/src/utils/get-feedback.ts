import { azure } from "@ai-sdk/azure"
import { generateObject } from "ai"

import type { Profile, RoleplaySessionMessage } from "@acme/db"
import { ZFeedbackSchema } from "@acme/validators"

type GetFeedbackProps = {
  transcript: string
  profile: Profile
  roleplaySessionMessages: RoleplaySessionMessage[]
}

// Comprehensive feedback function combining grammar checking and detailed feedback
export async function getFeedback({ transcript, profile, roleplaySessionMessages }: GetFeedbackProps) {
  const messages = roleplaySessionMessages
    .map((message) => {
      return JSON.stringify({ role: message.role, content: message.content })
    })
    .join("\n")
  const { object } = await generateObject({
    model: azure("gpt-4o-mini"),
    schemaName: "feedback",
    schema: ZFeedbackSchema,
    prompt: `You are an expert language tutor providing feedback for someone learning a new language.

You will be provided with sections delimited exclusively using AsciiDoc title formatting. These sections contain either the instructions to follow or additional context for you to use in crafting your response.
In AsciiDoc:
- A level 1 title is formatted with one equals sign ("=") followed by a space. Example: "= Level 1 Title ="
- A level 2 title is formatted with two equals signs ("==") followed by a space. Example: "== Level 2 Title =="
- A level 3 title is formatted with three equals signs ("===") followed by a space. Example: "=== Level 3 Title ==="

Only the AsciiDoc titles delimit the sections. Nothing else is used for this purpose.

= LEARNER PROFILE =
- Native Language: ${profile.nativeLanguage}
- Learning Language: ${profile.learningLanguage}
- Learning Language Level: ${profile.learningLanguageLevel} (Beginner, Intermediate, Advanced, Proficient, Fluent)

== Text Source ==
ORAL CONVERSATION TRANSCRIPT (speech-to-text conversion)

= CONTEXT =
${messages ? `Previous conversation context: ${messages}` : "No previous context available"}

= TEXT TO ANALYZE =
"${transcript}"

= CRITICAL REQUIREMENTS =
IMPORTANT: ALL feedback messages MUST be written in ${profile.nativeLanguage} (the user's native language).

IMPORTANT: This text comes from ORAL CONVERSATION, not written text. It's a speech transcript from someone speaking naturally. Adapt your feedback for spoken language patterns, not formal writing standards.

= FEEDBACK REQUIREMENTS =

If the text is already correct or has no significant errors that need correction:
- Set isCorrect to true
- Set both feedback and correctedPhrase to null

If there are errors that should be corrected:
- Set isCorrect to false
- Provide concise, friendly feedback (maximum 2-3 sentences) focusing on the most important issues while being constructive and supportive in ${profile.nativeLanguage}
- Provide the complete corrected version of the text

= FOCUS AREAS FOR ORAL CONVERSATION =

== What to Address ==
✅ Grammar mistakes that affect meaning or sound unnatural in speech
✅ Vocabulary errors or unnatural word choices for spoken language
✅ Sentence structure issues that disrupt conversational flow
✅ Appropriateness for oral communication at this difficulty level
✅ Natural spoken expression vs. literal translation from native language
✅ Pronunciation-related grammar issues (liaisons, contractions, etc.)

== What to Ignore ==
❌ Punctuation/capitalization (transcript artifacts)
❌ Filler words ("um", "uh", "like", "euh", etc.)
❌ Minor transcription errors or misheard words
❌ Acceptable informal speech patterns and colloquialisms
❌ Incomplete sentences that are natural in conversation
❌ Repetitions or self-corrections during speech
❌ Casual contractions and spoken shortcuts

= TONE AND APPROACH =
Be friendly, supportive, and educational while remaining specific and actionable. Focus on helping the learner improve their SPOKEN language skills through constructive guidance. Remember this is oral communication, not academic writing. Write ALL feedback in ${profile.nativeLanguage}.`,
    temperature: 0.3,
  })

  return object
}
