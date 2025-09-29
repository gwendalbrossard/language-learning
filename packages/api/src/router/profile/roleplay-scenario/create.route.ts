import { azure } from "@ai-sdk/azure"
import { generateObject } from "ai"
import { z } from "zod/v4"

import { roleplayCategorySelect, roleplayScenarioSelect } from "@acme/db"
import { ZProfileRoleplayScenarioCreateSchema } from "@acme/validators"

import { organizationProcedure } from "../../../trpc"

const ZRoleplayScenarioGenerateSchema = z.object({
  title: z.string().describe("A clear, descriptive title that captures the essence of the roleplay scenario"),
  description: z
    .string()
    .describe("A polished version of the provided description with corrected grammar and proper capitalization. It should be 1 or 2 sentences max."),
  emoji: z.string().describe("A single emoji that accurately represents the specific scenario, setting, or character role"),
  difficulty: z.number().min(1).max(3).describe("Difficulty level from 1-3, where 1 is beginner-friendly and 3 is advanced"),
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
    model: azure("gpt-5-mini"),
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

== Description ==
Rewrite and polish the provided description below with corrected grammar and proper capitalization. It should be 1 or 2 sentences max.

== Emoji ==
Choose a single emoji that accurately represents the specific scenario, setting, character role, or primary context. The emoji should be immediately recognizable and clearly relate to the roleplay situation.

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
- Focus on natural spoken conversation patterns
- Ensure the scenario is practical for real-world ORAL communication
- Match the difficulty to the complexity of spoken interaction described and the learner's language level
- Emphasize natural conversational flow
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

      description: object.description,
      emoji: object.emoji,
      title: object.title,
      difficulty: object.difficulty,
      categoryId: object.categoryId,

      organizationId: ctx.organization.id,
      profileId: ctx.profile.id,
    },
    select: roleplayScenarioSelect,
  })

  return createdRoleplayScenario
})
