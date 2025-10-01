import type { Prisma } from "../generated/client"
import { prisma } from "./client"

const roleplayCategories: { category: Prisma.RoleplayCategoryCreateInput; scenarios: Prisma.RoleplayScenarioCreateWithoutCategoryInput[] }[] = [
  {
    category: {
      emoji: "🏠",
      name: "Daily Life",
      isPublic: true,
    },
    scenarios: [
      {
        emoji: "🍕",
        title: "Ordering Food at a Restaurant",
        assistantRole: "Restaurant waiter",
        userRole: "Customer",
        description: "Practice ordering food, asking about ingredients, and making special requests in a casual dining setting.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "🛒",
        title: "Shopping for Groceries",
        assistantRole: "Store employee",
        userRole: "Shopper",
        description: "Navigate a grocery store, ask for help finding items, and interact with cashiers and store employees.",
        difficulty: 1,
        isPublic: true,
      },
    ],
  },
  {
    category: {
      emoji: "🏥",
      name: "Healthcare",
      isPublic: true,
    },
    scenarios: [
      {
        emoji: "🏥",
        title: "Doctor's Appointment",
        assistantRole: "Doctor",
        userRole: "Patient",
        description: "Learn to describe symptoms, understand medical advice, and communicate with healthcare professionals.",
        difficulty: 3,
        isPublic: true,
      },
    ],
  },
  {
    category: {
      emoji: "✈️",
      name: "Travel",
      isPublic: true,
    },
    scenarios: [
      {
        emoji: "✈️",
        title: "Airport and Travel",
        assistantRole: "Airport staff",
        userRole: "Traveler",
        description: "Handle airport procedures, ask for directions, and communicate during travel situations.",
        difficulty: 3,
        isPublic: true,
      },
    ],
  },
  {
    category: {
      emoji: "💼",
      name: "Professional",
      isPublic: true,
    },
    scenarios: [
      {
        emoji: "💼",
        title: "Job Interview",
        assistantRole: "Hiring manager",
        userRole: "Job candidate",
        description: "Practice professional communication, answer interview questions, and discuss qualifications and experience.",
        difficulty: 3,
        isPublic: true,
      },
    ],
  },
]

const lessonCategories: { category: Prisma.LessonCategoryCreateInput; lessons: Prisma.LessonCreateWithoutCategoryInput[] }[] = [
  {
    category: {
      emoji: "👨‍👩‍👧‍👦",
      name: "Family & Relationships",
      isPublic: true,
    },
    lessons: [
      {
        emoji: "👨‍👩‍👧‍👦",
        title: "Family Members and Relationships",
        description: "Learn vocabulary for family members like mother, father, brother, sister, and practice describing family relationships.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "💍",
        title: "Marriage and Partnership",
        description: "Practice vocabulary related to marriage, dating, and romantic relationships.",
        difficulty: 2,
        isPublic: true,
      },
    ],
  },
  {
    category: {
      emoji: "🍽️",
      name: "Food & Dining",
      isPublic: true,
    },
    lessons: [
      {
        emoji: "🍕",
        title: "Restaurant Vocabulary",
        description: "Learn essential vocabulary for ordering food, describing dishes, and dining experiences.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "🥘",
        title: "Cooking and Recipes",
        description: "Practice vocabulary for cooking methods, ingredients, and following recipes.",
        difficulty: 2,
        isPublic: true,
      },
    ],
  },
  {
    category: {
      emoji: "🏠",
      name: "Home & Daily Life",
      isPublic: true,
    },
    lessons: [
      {
        emoji: "🏠",
        title: "Rooms and Furniture",
        description: "Learn vocabulary for different rooms in a house and common furniture items.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "⏰",
        title: "Daily Routines and Time",
        description: "Practice describing daily activities, telling time, and talking about schedules.",
        difficulty: 1,
        isPublic: true,
      },
    ],
  },
  {
    category: {
      emoji: "✈️",
      name: "Travel & Transportation",
      isPublic: true,
    },
    lessons: [
      {
        emoji: "✈️",
        title: "Airport and Flight Vocabulary",
        description: "Learn essential vocabulary for air travel, from check-in to boarding and arrival.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "🚗",
        title: "Getting Around Town",
        description: "Practice vocabulary for public transportation, directions, and navigating a city.",
        difficulty: 2,
        isPublic: true,
      },
    ],
  },
  {
    category: {
      emoji: "💼",
      name: "Work & Professional",
      isPublic: true,
    },
    lessons: [
      {
        emoji: "💼",
        title: "Job and Career Vocabulary",
        description: "Learn vocabulary for different professions, workplace activities, and career discussions.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "📊",
        title: "Business Meetings and Presentations",
        description: "Practice formal language for business meetings, presentations, and professional communication.",
        difficulty: 3,
        isPublic: true,
      },
    ],
  },
]

async function seed() {
  console.log("🌱 Seeding database...")

  try {
    // Check existing roleplay data
    const existingRoleplayCategories = await prisma.roleplayCategory.findMany()
    const existingRoleplayScenarios = await prisma.roleplayScenario.findMany()

    // Check existing lesson data
    const existingLessonCategories = await prisma.lessonCategory.findMany()
    const existingLessons = await prisma.lesson.findMany()

    // Seed roleplay data if not exists
    if (existingRoleplayCategories.length === 0 && existingRoleplayScenarios.length === 0) {
      console.log("📁 Creating roleplay categories and scenarios...")

      for (const { category, scenarios } of roleplayCategories) {
        const createdCategory = await prisma.roleplayCategory.create({
          data: category,
        })
        console.log(`✅ Created roleplay category: ${createdCategory.name}`)

        // Create scenarios for this category
        for (const scenario of scenarios) {
          const created = await prisma.roleplayScenario.create({
            data: {
              emoji: scenario.emoji,
              title: scenario.title,
              assistantRole: scenario.assistantRole,
              userRole: scenario.userRole,
              description: scenario.description,
              difficulty: scenario.difficulty,
              isPublic: scenario.isPublic,

              categoryId: createdCategory.id,
            },
          })
          console.log(`✅ Created roleplay scenario: ${created.title}`)
        }
      }
    } else {
      console.log("⏭️ Roleplay data already exists, skipping...")
    }

    // Seed lesson data if not exists
    if (existingLessonCategories.length === 0 && existingLessons.length === 0) {
      console.log("📚 Creating lesson categories and lessons...")

      for (const { category, lessons } of lessonCategories) {
        const createdCategory = await prisma.lessonCategory.create({
          data: category,
        })
        console.log(`✅ Created lesson category: ${createdCategory.name}`)

        // Create lessons for this category
        for (const lesson of lessons) {
          const created = await prisma.lesson.create({
            data: {
              emoji: lesson.emoji,
              title: lesson.title,
              description: lesson.description,
              difficulty: lesson.difficulty,
              isPublic: lesson.isPublic,

              categoryId: createdCategory.id,
            },
          })
          console.log(`✅ Created lesson: ${created.title}`)
        }
      }
    } else {
      console.log("⏭️ Lesson data already exists, skipping...")
    }

    console.log("🎉 Seeding completed successfully!")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seed function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}

export { seed }
