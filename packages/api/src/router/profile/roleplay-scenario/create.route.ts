import { azure } from "@ai-sdk/azure"
import { generateObject } from "ai"
import { z } from "zod/v4"

import { roleplayCategorySelect, roleplayScenarioSelect } from "@acme/db"
import { ZProfileRoleplayScenarioCreateSchema } from "@acme/validators"

import { organizationProcedure } from "../../../trpc"

const ZRoleplayScenarioGenerateSchema = z.object({
  title: z
    .string()
    .describe("A short, straight-to-the-point title that summarizes what the scenario is about. No mention of 'oral conversation' or similar terms."),
  description: z
    .string()
    .describe(
      "An expanded version of the provided description with corrected grammar and proper capitalization. Should elaborate slightly on the given description while keeping it concise.",
    ),
  emoji: z.string().describe("A single emoji that accurately represents the specific scenario, setting, or character role"),
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
    prompt: `You are an expert language learning scenario designer. Based on the provided scenario description, generate a polished title, description, emoji, and category selection.

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

== Difficulty Level ==
${input.difficulty} (1=beginner, 2=intermediate, 3=advanced)

== Learner Profile ==
- Learning Language: ${ctx.profile.learningLanguage}
- Native Language: ${ctx.profile.nativeLanguage}
- Learning Language Level: ${ctx.profile.learningLanguageLevel}

== Available Categories ==
${JSON.stringify(
  roleplayCategories.map((cat) => ({ id: cat.id, name: cat.name, emoji: cat.emoji })),
  null,
  2,
)}

= TASK =
Generate the following components:

== Title ==
Create a short, straight-to-the-point title that summarizes what the scenario is about. Do not mention "oral conversation", "roleplay", or similar terms. Keep it concise and descriptive. Never use em dashes "—" in the title.

== Description ==
Expand slightly on the provided description with corrected grammar and proper capitalization. Elaborate on the given description while keeping it concise and engaging. The description should be exactly 1 or 2 sentences long.

== Emoji ==
Choose a single emoji that accurately represents the specific scenario, setting, character role, or primary context.

== Category Selection ==
Choose the most appropriate category ID from the available categories list above based on the scenario context and setting.

= REQUIREMENTS =
- Keep the title short and focused on the scenario content
- Expand the description naturally while maintaining the original intent
- Consider the learner's proficiency level and difficulty when crafting the content
- The response should always be in ${ctx.profile.nativeLanguage}, regardless of the learning language`,
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
      difficulty: input.difficulty,
      categoryId: object.categoryId,

      organizationId: ctx.organization.id,
      profileId: ctx.profile.id,
    },
    select: roleplayScenarioSelect,
  })

  return createdRoleplayScenario
})
