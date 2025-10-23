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
      "A concise and clear title summarizing the lesson topic and vocabulary focus. Avoid using words like 'lesson', 'practice', or 'conversation'. Focus on the content being taught.",
    ),
  description: z
    .string()
    .describe(
      "A 1-2 short sentences description of the lesson topic with correct grammar and capitalization. Clearly state which vocabulary, phrases, or language skills will be learned and practiced.",
    ),
  emoji: z.string().describe("A single emoji that represents the lesson topic, vocabulary theme, or primary subject matter."),
  categoryId: z.string().describe("The ID of the most appropriate category from the provided list, reflecting the lesson's main focus."),
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
    prompt: `You are an expert language lesson designer. Based on the provided lesson details, generate a polished title, description, emoji, and category selection.

CRITICAL: Lessons are structured to introduce vocabulary and enable natural conversational practice. Focus on clear learning objectives and structured outcomes, not roleplays.

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

= EXAMPLES =
Here are example lessons that match our structured style:

- Title: "Family Members and Relationships"  
  Description: "Learn vocabulary for family members like mother, father, brother, sister, and practice describing family relationships."  
  Emoji: "👨‍👩‍👧‍👦"  

- Title: "Restaurant Vocabulary"  
  Description: "Learn essential vocabulary for ordering food, describing dishes, and dining experiences."  
  Emoji: "🍕"  

- Title: "Daily Routines and Time"  
  Description: "Practice describing daily activities, telling time, and talking about schedules."  
  Emoji: "⏰"  

= TASK =
Generate the following lesson components based on the topic:

== Title ==
Create a short, clear title summarizing the vocabulary or topic focus. Keep it concise, informative, and aligned with structured learning. Avoid words like 'lesson' or 'practice'.

== Description ==
Write 1-2 short sentences describing the lesson topic. Correct grammar and capitalization. Specify the vocabulary, phrases, and skills learners will acquire.

== Emoji ==
Choose a single emoji representing the lesson topic, vocabulary theme, or subject matter.

== Category Selection ==
Select the most suitable category ID from the list based on lesson topic and vocabulary focus.

= REQUIREMENTS =
- Keep title concise and focused on content
- Description must clearly state learning objectives and covered vocabulary
- Consider learner proficiency and difficulty level
- Prioritize structured learning outcomes over casual conversation
- Response must be in ${ctx.profile.nativeLanguage}, regardless of the learning language

`,
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
