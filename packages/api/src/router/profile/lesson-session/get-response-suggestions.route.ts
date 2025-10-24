import { azure } from "@ai-sdk/azure"
import { TRPCError } from "@trpc/server"
import { generateObject } from "ai"
import { z } from "zod/v4"

import { LessonSessionMessageRole } from "@acme/db"
import { ZProfileLessonSessionGetResponseSuggestionsSchema } from "@acme/validators"

import { organizationUnlimitedProcedure } from "../../../trpc"

const ZResponseSuggestionsSchema = z.object({
  suggestions: z
    .array(
      z.object({
        text: z.string().describe("The suggested response text in the target language"),
        translation: z.string().describe("Translation of the response text in the user's native language"),
        difficulty: z.enum(["beginner", "intermediate", "advanced"]).describe("Difficulty level of this suggestion"),
      }),
    )
    .length(3)
    .describe("Array of 3 response suggestions with varying difficulty levels"),
})

export const getResponseSuggestions = organizationUnlimitedProcedure
  .input(ZProfileLessonSessionGetResponseSuggestionsSchema)
  .mutation(async ({ ctx, input }) => {
    const lessonSession = await ctx.db.lessonSession.findFirst({
      where: {
        AND: [{ id: input.lessonSessionId }, { profileId: ctx.profile.id }, { organizationId: ctx.organization.id }],
      },
      include: {
        lesson: true,
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    })

    if (!lessonSession) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Lesson session not found" })
    }

    const latestAssistantMessage = [...lessonSession.messages].reverse().find((message) => message.role === LessonSessionMessageRole.ASSISTANT)

    if (!latestAssistantMessage) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No assistant message found to generate suggestions from",
      })
    }

    const conversationHistory = lessonSession.messages
      .map((message) => {
        return JSON.stringify({ role: message.role, content: message.content })
      })
      .join("\n")

    const prompt = `You are an expert language tutor helping a learner practice and complete phrases in a structured lesson.

CRITICAL: This is a language learning lesson focused on teaching new vocabulary, phrases, and expressions. The goal is to help learners practice and master specific language patterns, not engage in casual conversation.

You will be provided with sections delimited exclusively using AsciiDoc title formatting. These sections contain either the prompt to follow or additional context for you to use in crafting your response.
In AsciiDoc:
- A level 1 title is formatted with one equals sign ("=") followed by a space. Example: "= Level 1 Title ="
- A level 2 title is formatted with two equals signs ("==") followed by a space. Example: "== Level 2 Title =="
- A level 3 title is formatted with three equals signs ("===") followed by a space. Example: "=== Level 3 Title ==="

Only the AsciiDoc titles delimit the sections. Nothing else is used for this purpose.

= LESSON CONTEXT =
== Lesson Details ==
- Title: "${lessonSession.lesson.title}"
- Description: ${lessonSession.lesson.description}

== Conversation History ==
${conversationHistory}

== Latest Assistant Message ==
"${latestAssistantMessage.content}"

= TASK =
Generate 3 response suggestions that help the learner practice and complete phrases taught in this lesson. Focus on providing more complete, well-formed responses that demonstrate proper usage of the target vocabulary and expressions.

= REQUIREMENTS =

== Educational Focus ==
- Prioritize teaching and reinforcing lesson vocabulary, phrases, and expressions
- Provide complete, well-structured responses that serve as good examples
- Focus on accuracy and proper usage rather than casual conversation
- Help learners understand how to construct full, meaningful responses using lesson content

== Response Variety ==
Provide suggestions at 3 different difficulty levels:
=== Beginner ===
Simple, clear responses using basic lesson vocabulary with straightforward sentence structures

=== Intermediate ===
More complete responses incorporating multiple lesson elements with moderate complexity

=== Advanced ===
Sophisticated, nuanced responses that demonstrate mastery of lesson vocabulary and advanced usage patterns

== Contextual Appropriateness ==
- Each suggestion must directly respond to the assistant's message while incorporating lesson objectives
- Use vocabulary and phrases that align with the lesson's learning goals
- Ensure responses demonstrate proper usage of the target language elements
- Build upon what has been taught in the lesson context

== Language Learning Focus ==
- Emphasize proper grammar, vocabulary usage, and sentence construction
- Include key phrases and expressions that learners should master
- Focus on building learner confidence with structured, complete responses
- Reinforce lesson vocabulary through practical application
- Provide examples that learners can adapt for similar situations

== Educational Value ==
- Each suggestion should demonstrate different aspects of the lesson content
- Vary complexity while maintaining educational focus
- Show progression from simple to sophisticated usage
- Include practical applications of lesson vocabulary and phrases

== Structured Learning Support ==
- Responses should model proper language use for learners to emulate
- Focus on completeness and clarity over spontaneity
- Help learners understand how to construct well-formed responses
- Provide examples that reinforce lesson learning objectives

== Translation Requirements ==
- Provide accurate, clear translations that help learners understand meaning and usage
- Explain the educational value and proper context for each suggestion
- Help learners understand when and how to use these phrases appropriately
- Focus on learning outcomes rather than conversational flow

= OUTPUT GUIDELINES =
Generate responses that are educationally valuable, linguistically correct, and aligned with the lesson's learning objectives. Each suggestion should serve as a model response that learners can study, practice, and adapt for their own use.`

    const result = await generateObject({
      model: azure("gpt-4o-mini"),
      schemaName: "responseSuggestions",
      schema: ZResponseSuggestionsSchema,
      prompt: prompt,
      temperature: 0.4,
    })

    return result.object
  })
