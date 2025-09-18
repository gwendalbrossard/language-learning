import { azure } from "@ai-sdk/azure"
import { TRPCError } from "@trpc/server"
import { generateObject } from "ai"
import { z } from "zod/v4"

import { RoleplaySessionMessageRole } from "@acme/db"
import { ZProfileRoleplaySessionGetResponseSuggestionsSchema } from "@acme/validators"

import { organizationProcedure } from "../../../trpc"

const responseSuggestionsSchema = z.object({
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

export const getResponseSuggestions = organizationProcedure
  .input(ZProfileRoleplaySessionGetResponseSuggestionsSchema)
  .mutation(async ({ ctx, input }) => {
    const roleplaySession = await ctx.db.roleplaySession.findFirst({
      where: {
        AND: [{ id: input.roleplaySessionId }, { profileId: ctx.profile.id }, { organizationId: ctx.organization.id }],
      },
      include: {
        scenario: true,
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    })

    if (!roleplaySession) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Roleplay session not found" })
    }

    const latestAssistantMessage = [...roleplaySession.messages].reverse().find((message) => message.role === RoleplaySessionMessageRole.ASSISTANT)

    if (!latestAssistantMessage) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No assistant message found to generate suggestions from",
      })
    }

    const conversationHistory = roleplaySession.messages
      .map((message) => {
        return JSON.stringify({ role: message.role, content: message.content })
      })
      .join("\n")

    const prompt = `You are an expert language tutor helping a learner practice ORAL conversational skills in a roleplay scenario.

CRITICAL: This is an ORAL conversation, not written communication. All suggestions must sound natural when spoken aloud and flow seamlessly in real-time dialogue.

You will be provided with sections delimited exclusively using AsciiDoc title formatting. These sections contain either the instructions to follow or additional context for you to use in crafting your response.
In AsciiDoc:
- A level 1 title is formatted with one equals sign ("=") followed by a space. Example: "= Level 1 Title ="
- A level 2 title is formatted with two equals signs ("==") followed by a space. Example: "== Level 2 Title =="
- A level 3 title is formatted with three equals signs ("===") followed by a space. Example: "=== Level 3 Title ==="

Only the AsciiDoc titles delimit the sections. Nothing else is used for this purpose.

= SCENARIO CONTEXT =
== Roleplay Details ==
- Title: "${roleplaySession.scenario.title}"
- Description: ${roleplaySession.scenario.description}
- Instructions: ${roleplaySession.scenario.instructions}

== Conversation History ==
${conversationHistory}

== Latest Assistant Message ==
"${latestAssistantMessage.content}"

= TASK =
Generate 3 response suggestions that help the learner continue this ORAL roleplay conversation naturally and fluently.

= REQUIREMENTS =

== ORAL Conversation Priority ==
- ALL suggestions must sound natural when spoken aloud in real-time
- Use conversational spoken language patterns
- Avoid overly formal or written-style language unless the scenario specifically requires it
- Consider rhythm, flow, and natural speech patterns
- Include responses that feel spontaneous and authentic in spoken dialogue

== Response Variety ==
Provide suggestions at 3 different difficulty levels:
=== Beginner ===
Simple, direct responses using basic vocabulary and natural spoken structures

=== Intermediate ===
More natural expressions with moderate complexity that flow well in speech

=== Advanced ===
Sophisticated responses with nuanced language, cultural appropriateness, and natural conversational flow

== Contextual Appropriateness ==
- Each suggestion must directly respond to the assistant's last message in real-time oral dialogue
- Maintain the roleplay scenario's tone and setting appropriate for spoken interaction
- Consider cultural context and social registers as they apply to oral communication
- Ensure responses advance the ORAL conversation naturally and maintain conversational momentum

== Language Learning Focus ==
- Use vocabulary and structures appropriate for each difficulty level in spoken contexts
- Include common oral conversational patterns, expressions, and speech habits
- Focus on practical, real-world SPOKEN language usage
- Encourage natural speech patterns and conversational flow over literal translations
- Include typical oral discourse markers and conversational connectors

== Educational Value ==
- Each suggestion should teach different aspects of ORAL language use
- Vary sentence structures, vocabulary, and communicative functions as they appear in speech

== Natural ORAL Conversation Flow ==
- Responses should feel authentic and unforced when spoken
- Consider what a native speaker would realistically say in oral dialogue
- Match the conversational style and pace established in the spoken scenario
- Include natural hesitations, emphasis, and oral communication patterns where appropriate

== Translation Requirements ==
- Provide accurate, natural translations in English for each response
- Translations should convey the spoken meaning, tone, and conversational flow
- Help learners understand what they're saying and how it sounds in oral communication to native speakers
- Include notes about spoken delivery when relevant

= OUTPUT GUIDELINES =
Generate responses that are practical, educational, and contextually perfect for this ORAL roleplay situation. Each suggestion should include the response text optimized for spoken delivery, its English translation, and difficulty level.`

    const result = await generateObject({
      model: azure("gpt-4o-mini"),
      schemaName: "responseSuggestions",
      schema: responseSuggestionsSchema,
      prompt: prompt,
      temperature: 0.4,
    })

    return result.object
  })
