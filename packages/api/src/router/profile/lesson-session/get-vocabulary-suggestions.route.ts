import { azure } from "@ai-sdk/azure"
import { TRPCError } from "@trpc/server"
import { generateObject } from "ai"
import { z } from "zod/v4"

import type { LessonSessionSelected, ProfileSelected } from "@acme/db"
import { lessonSessionSelect } from "@acme/db"
import { ZProfileLessonSessionGetVocabularySuggestionsSchema } from "@acme/validators"

import { organizationUnlimitedProcedure } from "../../../trpc"

export const getVocabularySuggestions = organizationUnlimitedProcedure
  .input(ZProfileLessonSessionGetVocabularySuggestionsSchema)
  .mutation(async ({ ctx, input }) => {
    const lessonSession = await ctx.db.lessonSession.findFirst({
      where: {
        AND: [{ id: input.lessonSessionId }, { profileId: ctx.profile.id }, { organizationId: ctx.organization.id }],
      },
      select: lessonSessionSelect,
    })

    if (!lessonSession) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Lesson session not found" })
    }

    const vocabularySuggestions = await generateVocabularySuggestions({ lessonSession: lessonSession, profile: ctx.profile })

    return vocabularySuggestions
  })

const ZVocabularySuggestionSchema = z.object({
  suggestions: z
    .array(
      z.object({
        text: z.string().describe("The original text item in the learning language that needs to be translated"),
        translation: z.string().describe("The accurate translation of the text item into the user's native language"),
        romanization: z
          .string()
          .nullable()
          .describe(
            "The romanized version of the text for non-Roman scripts (e.g., Pinyin for Chinese, Romaji for Japanese, etc.). Use null if the learning language already uses Roman script",
          ),
        type: z
          .enum(["WORD", "PHRASE", "EXPRESSION"])
          .describe(
            "The grammatical/linguistic type: WORD for single words, PHRASE for multi-word expressions with specific meaning, EXPRESSION for idiomatic or colloquial phrases",
          ),
      }),
    )
    .length(10)
    .describe("Array of 10 vocabulary suggestions with a mix of words, phrases, and expressions"),
})

type GetVocabularySuggestionsProps = {
  lessonSession: LessonSessionSelected
  profile: ProfileSelected
}
const generateVocabularySuggestions = async ({ lessonSession, profile }: GetVocabularySuggestionsProps) => {
  const prompt = `You are an expert language tutor generating vocabulary suggestions for a structured lesson.

CRITICAL: Generate 10 vocabulary items (words, phrases, and expressions) that are relevant to this lesson context. Focus on providing a balanced mix of vocabulary types that will help learners expand their language skills.

You will be provided with sections delimited exclusively using AsciiDoc title formatting. These sections contain either the prompt to follow or additional context for you to use in crafting your response.
In AsciiDoc:
- A level 1 title is formatted with one equals sign ("=") followed by a space. Example: "= Level 1 Title ="
- A level 2 title is formatted with two equals signs ("==") followed by a space. Example: "== Level 2 Title =="
- A level 3 title is formatted with three equals signs ("===") followed by a space. Example: "=== Level 3 Title ==="

Only the AsciiDoc titles delimit the sections. Nothing else is used for this purpose.

= TASK =
Generate 10 vocabulary suggestions that are relevant to this lesson context. Include a balanced mix of words, phrases, and expressions that learners should know for this topic.

= LEARNER PROFILE =
- Learning Language: ${profile.learningLanguage}
- Native Language: ${profile.nativeLanguage}
- Learning Language Level: ${profile.learningLanguageLevel}

= LESSON CONTEXT =
== Lesson Details ==
- Title: "${lessonSession.lesson.title}"
- Description: ${lessonSession.lesson.description}

= REQUIREMENTS =

== Vocabulary Types ==
Include a balanced mix of:
=== WORD ===
Single words that are fundamental to the lesson topic

=== PHRASE ===
Multi-word expressions with specific meanings relevant to the lesson

=== EXPRESSION ===
Idiomatic or colloquial phrases that native speakers commonly use in this context

== Educational Value ==
- Select vocabulary that directly relates to the lesson topic and goals
- Include items that learners are likely to encounter in real-world usage
- Ensure vocabulary is appropriate for the lesson's difficulty level
- Focus on practical, useful language items

== Language Requirements ==
- Provide accurate translations in the user's native language
- Include romanization for non-Roman scripts when applicable
- Ensure all vocabulary items are contextually appropriate
- Select items that complement each other and build a cohesive vocabulary set

== Contextual Relevance ==
- All vocabulary should be directly relevant to the lesson topic
- Consider what vocabulary would be most useful for learners in this context
- Include both basic and more advanced vocabulary to support different learning levels
- Focus on vocabulary that appears in authentic language use

= OUTPUT GUIDELINES =
Generate 10 vocabulary items that form a comprehensive set for this lesson topic. Each item should include the original text, accurate translation, appropriate romanization (if needed), and correct type classification.`

  const result = await generateObject({
    model: azure("gpt-4o-mini"),
    schemaName: "vocabularySuggestions",
    schema: ZVocabularySuggestionSchema,
    prompt: prompt,
    temperature: 0.4,
  })

  return result.object
}
