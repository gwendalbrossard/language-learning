import { azure } from "@ai-sdk/azure"
import { generateObject } from "ai"

import type { LessonSessionMessage, Profile } from "@acme/db"
import { ZActionSchema } from "@acme/validators"

type GetActionProps = {
  transcript: string
  profile: Profile
  lessonSessionMessages: LessonSessionMessage[]
}

// Comprehensive feedback function combining grammar checking and detailed feedback
export async function getAction({ transcript, profile, lessonSessionMessages }: GetActionProps) {
  const messages = lessonSessionMessages
    .map((message) => {
      return JSON.stringify({ role: message.role, content: message.content })
    })
    .join("\n")
  const { object } = await generateObject({
    model: azure("gpt-5-mini"),
    schemaName: "action",
    schema: ZActionSchema,
    prompt: `You are an expert language lesson analyzer that identifies the specific action the AI tutor wants the user to perform.

You will be provided with sections delimited exclusively using AsciiDoc title formatting. These sections contain either the instructions to follow or additional context for you to use in crafting your response.
In AsciiDoc:
- A level 1 title is formatted with one equals sign ("=") followed by a space. Example: "= Level 1 Title ="
- A level 2 title is formatted with two equals signs ("==") followed by a space. Example: "== Level 2 Title =="
- A level 3 title is formatted with three equals signs ("===") followed by a space. Example: "=== Level 3 Title ==="

Only the AsciiDoc titles delimit the sections. Nothing else is used for this purpose.

= LEARNER PROFILE =
- Learning Language: ${profile.learningLanguage}
- Native Language: ${profile.nativeLanguage}
- Learning Language Level: ${profile.learningLanguageLevel}

== Text Source ==
ORAL CONVERSATION TRANSCRIPT (speech-to-text conversion)

= LESSON CONTEXT =
${messages ? `Previous conversation context: ${messages}` : "No previous context available"}

= AI MESSAGE TO ANALYZE =
"${transcript}"

= ANALYSIS OBJECTIVE =
Analyze the AI tutor's latest message and determine what specific action the AI is requesting from the user. The AI tutor's goal is to guide the user through language learning by asking them to:
1. Repeat specific words or sentences for pronunciation practice
2. Answer questions to practice comprehension and response skills

= ACTION IDENTIFICATION REQUIREMENTS =

== Primary Action Type ==
Identify the main action the AI is requesting:
- "REPEAT": AI wants user to repeat specific words/phrases/sentences
- "ANSWER": AI wants user to answer a question or respond to a prompt

== Target Content ==
Extract the specific content the user should focus on:
- For "REPEAT": The exact words, phrases, or expressions to repeat
- For "ANSWER": The question being asked or prompt being given

== Target Content Translation ==
Translate the target content into the user's native language (${profile.nativeLanguage}) to help them understand what they're practicing or being asked to do. This translation should be:
- Accurate and contextually appropriate
- Natural in the target language
- Helpful for learning comprehension

== Target Content Romanization ==
If the target content is in a non-Roman script (e.g., Japanese, Russian, Korean, Arabic, Chinese, etc.), provide a romanized version to help with pronunciation and reading. This should be:
- Accurate phonetic representation in Roman characters
- Following standard romanization systems (e.g., Hepburn for Japanese, Pinyin for Chinese, etc.)
- Set to null if the content is already in Roman script or romanization is not applicable

== Vocabulary Type (for "REPEAT" actions only) ==
When the action type is "REPEAT", also identify the vocabulary type:
- "WORD": Single vocabulary words (e.g., "hello", "merci", "casa")
- "PHRASE": Short combinations of words (e.g., "good morning", "how are you", "where is the bathroom")
- "EXPRESSION": Idiomatic expressions or common sayings (e.g., "break a leg", "it's raining cats and dogs", "l'habit ne fait pas le moine")

== Context Awareness ==
Consider the lesson flow and previous messages to ensure the identified action makes sense in the current learning context.

= CRITICAL REQUIREMENTS =
IMPORTANT: Focus on extracting the ACTION the AI wants the user to take, not providing feedback on the user's performance.

IMPORTANT: The AI message is from speech-to-text conversion, so account for potential transcription artifacts while focusing on the core instructional intent.

= ANALYSIS APPROACH =
Analyze the AI tutor's message to identify:
1. What the AI is asking the user to do ("REPEAT" or "ANSWER")
2. The specific content (words, phrases, expressions, questions) the user should focus on
3. The translation of that content into the user's native language (${profile.nativeLanguage})
4. The romanized version of the content (if applicable for non-Roman scripts)
5. For "REPEAT" actions: the vocabulary type (WORD, PHRASE, or EXPRESSION)`,
    temperature: 0.3,
  })

  return object
}
