import { azure } from "@ai-sdk/azure"
import { generateObject } from "ai"
import { z } from "zod/v4"

import { roleplayCategorySelect, roleplayScenarioSelect } from "@acme/db"
import { ZProfileRoleplayScenarioCreateSchema } from "@acme/validators"

import { organizationProcedure } from "../../../trpc"

const ZRoleplayScenarioGenerateSchema = z.object({
  title: z.string().describe("A clear, descriptive title for the roleplay scenario"),
  prompt: z
    .string()
    .describe("Detailed instructions for the AI assistant on how to roleplay the character, including personality, behavior, and conversation style"),
  emoji: z.string().describe("A single emoji that represents the roleplay scenario"),
  difficulty: z.number().min(1).max(3).describe("Difficulty level from 1-3 (1 being easiest, 3 being hardest)"),
  categoryId: z.string().describe("The ID of the most appropriate category from the provided list"),
})

export const create = organizationProcedure.input(ZProfileRoleplayScenarioCreateSchema).mutation(async ({ ctx, input }) => {
  // Fetch all available categories for the user
  const roleplayCategories = await ctx.db.roleplayCategory.findMany({
    where: { OR: [{ isPublic: true }, { AND: [{ isPublic: false }, { profileId: ctx.profile.id }, { organizationId: ctx.organization.id }] }] },
    select: roleplayCategorySelect,
    orderBy: [{ createdAt: "desc" }],
  })

  const { object } = await generateObject({
    model: azure("gpt-4o-mini"),
    schemaName: "roleplay-scenario-generate",
    schema: ZRoleplayScenarioGenerateSchema,
    prompt: `You are an expert language learning scenario designer. Create a roleplay scenario for ORAL conversation practice where learners will speak naturally with an AI assistant using their voice.

CRITICAL: This is for ORAL/SPOKEN language practice, not written communication. The scenario must be optimized for natural voice conversations.

You will be provided with sections delimited exclusively using AsciiDoc title formatting. These sections contain either the instructions to follow or additional context for you to use in crafting your response.
In AsciiDoc:
- A level 1 title is formatted with one equals sign ("=") followed by a space. Example: "= Level 1 Title ="
- A level 2 title is formatted with two equals signs ("==") followed by a space. Example: "== Level 2 Title =="
- A level 3 title is formatted with three equals signs ("===") followed by a space. Example: "=== Level 3 Title ==="

Only the AsciiDoc titles delimit the sections. Nothing else is used for this purpose.

= INPUT DETAILS =
== User Role ==
${input.userRole}

== Assistant Role ==
${input.assistantRole}

== Description ==
${input.description}

== Learner Profile ==
- Learning Language: ${ctx.profile.learningLanguage}
- Learning Language Level: ${ctx.profile.learningLanguageLevel}

== Available Categories ==
${JSON.stringify(
  roleplayCategories.map((cat) => ({ id: cat.id, name: cat.name, emoji: cat.emoji })),
  null,
  2,
)}

= TASK =
Generate a complete ORAL roleplay scenario with the following components:

== Title ==
Create a clear, descriptive title that captures the essence of the ORAL roleplay scenario.

== Prompt ==
Write detailed instructions for the AI assistant on how to roleplay the character in ORAL conversation. Include:
- Personality traits and conversational behavior style for spoken interaction
- How to engage the language learner in natural voice conversation
- Appropriate spoken vocabulary level and conversational complexity
- Specific context and setting details for oral communication
- Encouragement for spoken language learning and pronunciation practice
- Professional or contextual expertise the character should demonstrate through speech
- Natural conversational flow, including typical oral discourse markers
- Patience with pronunciation, hesitations, and speaking pace
- Use of everyday spoken expressions and colloquialisms appropriate to the scenario

== Emoji ==
Choose a single emoji that best represents the scenario or setting.

== Difficulty ==
Assess the difficulty level (1-3, with 1 being the easiest, 3 being the hardest) for ORAL communication based on:
- Spoken vocabulary complexity and pronunciation challenges
- Cultural or professional knowledge needed for natural conversation
- Real-time conversational complexity and response speed required
- Frequency of this type of spoken interaction in real life

== Category Selection ==
Choose the most appropriate category ID from the available categories list above. Consider:
- The context and setting of the oral roleplay
- The type of spoken interaction described
- The professional or social domain where this conversation would occur

= REQUIREMENTS =
- The prompt should be comprehensive enough for the AI to engage in natural ORAL roleplay
- Focus on spoken language learning - the AI should encourage natural speech patterns
- Ensure the scenario is practical for real-world ORAL communication
- Match the difficulty to the complexity of spoken interaction described and the learner's language level
- Emphasize conversational flow, listening skills, and speaking confidence
- Include guidance for the AI to adapt to different speaking speeds and accents
- Consider the learner's proficiency level when designing the scenario
- The response should always be in English, regardless of the learning language
- Tailor the roleplay scenario to the learner's proficiency level`,
    temperature: 0.3,
  })

  const createdRoleplayScenario = await ctx.db.roleplayScenario.create({
    data: {
      isPublic: false,

      assistantRole: input.assistantRole,
      userRole: input.userRole,
      description: input.description,

      emoji: object.emoji,
      title: object.title,
      prompt: object.prompt,
      difficulty: object.difficulty,
      categoryId: object.categoryId,

      organizationId: ctx.organization.id,
      profileId: ctx.profile.id,
    },
    select: roleplayScenarioSelect,
  })

  return createdRoleplayScenario
})
