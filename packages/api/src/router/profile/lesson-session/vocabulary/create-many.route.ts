import { azure } from "@ai-sdk/azure"
import { TRPCError } from "@trpc/server"
import { generateObject } from "ai"
import { z } from "zod/v4"

import type { LessonSessionSelected, ProfileSelected } from "@acme/db"
import { lessonSessionSelect, VocabularyType } from "@acme/db"
import { ZProfileLessonSessionVocabularyCreateManySchema } from "@acme/validators"

import { organizationUnlimitedProcedure } from "../../../../trpc"

export const createMany = organizationUnlimitedProcedure.input(ZProfileLessonSessionVocabularyCreateManySchema).mutation(async ({ ctx, input }) => {
  const lessonSession = await ctx.db.lessonSession.findUnique({
    where: { id: input.lessonSessionId, profileId: ctx.profile.id, organizationId: ctx.organization.id },
    select: lessonSessionSelect,
  })

  if (!lessonSession) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Lesson session not found" })
  }

  const vocabularies = await Promise.all(
    input.vocabulary.map((vocabulary) =>
      createVocabulary({
        text: vocabulary,
        lessonSession: lessonSession,
        profile: ctx.profile,
      }),
    ),
  )

  const createdVocabularies = await ctx.db.vocabulary.createMany({
    data: vocabularies.map((vocabulary) => ({
      type: vocabulary.type,
      text: vocabulary.text,
      romanization: vocabulary.romanization,
      translation: vocabulary.translation,
      phraseExample: vocabulary.phraseExample,
      phraseExampleTranslation: vocabulary.phraseExampleTranslation,

      learningLanguage: ctx.profile.learningLanguage,
      profileId: ctx.profile.id,
      organizationId: ctx.organization.id,
    })),
  })

  return createdVocabularies
})

const ZVocabularySchema = z.object({
  text: z.string().describe("The original text item in the learning language that needs to be translated"),
  translation: z.string().describe("The accurate translation of the text item into the user's native language"),
  romanization: z
    .string()
    .nullable()
    .describe(
      "The romanized version of the text for non-Roman scripts (e.g., Pinyin for Chinese, Romaji for Japanese, etc.). Use null if the learning language already uses Roman script",
    ),
  phraseExample: z
    .string()
    .describe(
      "A natural, contextually relevant short sentence in the learning language that demonstrates how the vocabulary item is used in real conversation",
    ),
  phraseExampleTranslation: z
    .string()
    .describe("The translation of the phrase example into the user's native language to help them understand the usage context"),
  type: z
    .enum(VocabularyType)
    .describe(
      "The grammatical/linguistic type: WORD for single words, PHRASE for multi-word expressions with specific meaning, EXPRESSION for idiomatic or colloquial phrases",
    ),
})

type CreateVocabularyProps = {
  text: string
  lessonSession: LessonSessionSelected
  profile: ProfileSelected
}
const createVocabulary = async ({ text, lessonSession, profile }: CreateVocabularyProps) => {
  const { object } = await generateObject({
    model: azure("gpt-4o-mini"),
    schemaName: "create-vocabulary",
    schema: ZVocabularySchema,
    prompt: `You are an expert language educator and translator. Your task is to create vocabulary entries for language learners.

You will be provided with sections delimited exclusively using AsciiDoc title formatting. These sections contain either the instructions to follow or additional context for you to use in crafting your response.
In AsciiDoc:
- A level 1 title is formatted with one equals sign ("=") followed by a space. Example: "= Level 1 Title ="
- A level 2 title is formatted with two equals signs ("==") followed by a space. Example: "== Level 2 Title =="
- A level 3 title is formatted with three equals signs ("===") followed by a space. Example: "=== Level 3 Title ==="

Only the AsciiDoc titles delimit the sections. Nothing else is used for this purpose.

= TASK =
For the given vocabulary item (VOCABULARY ITEM TO PROCESS), provide:
1. An accurate translation into the learner's native language
2. Romanization if needed (null for Roman script languages)
3. A natural example sentence showing how this vocabulary is used in context
4. Translation of the example sentence
5. The appropriate vocabulary type (WORD/PHRASE/EXPRESSION)

= LEARNER PROFILE =
- Learning Language: ${profile.learningLanguage}
- Native Language: ${profile.nativeLanguage}
- Learning Language Level: ${profile.learningLanguageLevel}

= CONTEXT =
This vocabulary item comes from a lesson session conversation. Use this context to:
- Understand the meaning and usage of the vocabulary item
- Create a relevant example sentence that fits the conversation theme
- Choose appropriate difficulty level for the learner

== LESSON TITLE ==
${lessonSession.lesson.title}

== LESSON DESCRIPTION ==
${lessonSession.lesson.description}

== LESSON SESSION MESSAGES ==
${lessonSession.messages.map((msg) => `${msg.role}: ${msg.content}`).join("\n")}

== VOCABULARY ITEM TO PROCESS ==
"${text}"
`,
    temperature: 0.3,
  })

  return object
}
