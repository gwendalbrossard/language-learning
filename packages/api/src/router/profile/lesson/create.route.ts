import { azure } from "@ai-sdk/azure"
import { generateObject } from "ai"
import { z } from "zod/v4"

import { lessonCategorySelect, lessonSelect } from "@acme/db"
import { ZProfileLessonCreateSchema } from "@acme/validators"

import { organizationUnlimitedProcedure } from "../../../trpc"

// TODO: Update schema and prompt
const ZLessonGenerateSchema = z.object({
  title: z
    .string()
    .describe(
      "A short, clear title that summarizes the lesson topic and learning focus. No mention of 'lesson', 'practice', 'conversation' or similar terms.",
    ),
  description: z
    .string()
    .describe(
      "An expanded version of the provided topic with corrected grammar and proper capitalization. Should describe what vocabulary and language skills will be covered.",
    ),
  emoji: z.string().describe("A single emoji that accurately represents the lesson topic, vocabulary theme, or primary subject matter"),
  categoryId: z.string().describe("The ID of the most appropriate category from the provided list"),
})

export const create = organizationUnlimitedProcedure.input(ZProfileLessonCreateSchema).mutation(async ({ ctx, input }) => {
  // Fetch all available categories for the user
  const lessonCategories = await ctx.db.lessonCategory.findMany({
    where: { OR: [{ isPublic: true }, { AND: [{ isPublic: false }, { profileId: ctx.profile.id }, { organizationId: ctx.organization.id }] }] },
    orderBy: [{ createdAt: "desc" }],
    select: lessonCategorySelect,
  })

  const { object } = await generateObject({
    model: azure("gpt-5-mini"),
    schemaName: "lesson-generate",
    schema: ZLessonGenerateSchema,
    prompt: `You are an expert language learning lesson designer. Based on the provided lesson description, generate a polished title, description, emoji, and category selection.

CRITICAL: This is for structured language lessons focused on vocabulary introduction and conversational practice. The lesson must be optimized for natural voice conversations with clear learning objectives.

You will be provided with sections delimited exclusively using AsciiDoc title formatting. These sections contain either the instructions to follow or additional context for you to use in crafting your response.
In AsciiDoc:
- A level 1 title is formatted with one equals sign ("=") followed by a space. Example: "= Level 1 Title ="
- A level 2 title is formatted with two equals signs ("==") followed by a space. Example: "== Level 2 Title =="
- A level 3 title is formatted with three equals signs ("===") followed by a space. Example: "=== Level 3 Title ==="

Only the AsciiDoc titles delimit the sections. Nothing else is used for this purpose.

= INPUT DETAILS =
== Lesson Topic ==
${input.description}

== Difficulty Level ==
${input.difficulty} (1=beginner, 2=intermediate, 3=advanced)

== Learner Profile ==
- Learning Language: ${ctx.profile.learningLanguage}
- Native Language: ${ctx.profile.nativeLanguage}
- Learning Language Level: ${ctx.profile.learningLanguageLevel}

== Available Categories ==
${JSON.stringify(
  lessonCategories.map((cat) => ({ id: cat.id, name: cat.name, emoji: cat.emoji })),
  null,
  2,
)}

= TASK =
Generate the following components for a structured language lesson:

== Title ==
Create a short, clear title that summarizes the lesson topic and learning focus. Examples: "Family Members and Relationships", "Ordering Food at a Restaurant", "Daily Routines and Time". Do not mention "lesson", "practice", "conversation" or similar terms. Keep it concise and focused on the content being taught.

== Description ==
Expand on the provided topic with corrected grammar and proper capitalization. Describe what vocabulary and language skills will be covered in this lesson. The description should be exactly 1 or 2 sentences long and clearly indicate the learning objectives.

== Emoji ==
Choose a single emoji that accurately represents the lesson topic, vocabulary theme, or primary subject matter being taught.

== Category Selection ==
Choose the most appropriate category ID from the available categories list above based on the lesson topic and vocabulary focus.

= REQUIREMENTS =
- Keep the title focused on the vocabulary/topic being taught
- The description should clearly indicate what will be learned (vocabulary, phrases, skills)
- Consider the learner's proficiency level and difficulty when crafting the content
- Focus on structured learning outcomes rather than roleplays
- The response should always be in ${ctx.profile.nativeLanguage}, regardless of the learning language`,
    temperature: 0.3,
  })

  const createdLesson = await ctx.db.lesson.create({
    data: {
      isPublic: false,

      description: object.description,
      emoji: object.emoji,
      title: object.title,
      difficulty: input.difficulty,
      categoryId: object.categoryId,

      organizationId: ctx.organization.id,
      profileId: ctx.profile.id,
    },
    select: lessonSelect,
  })

  return createdLesson
})
