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

async function seed() {
  console.log("🌱 Seeding roleplay data...")

  try {
    const existingCategories = await prisma.roleplayCategory.findMany()
    const existingScenarios = await prisma.roleplayScenario.findMany()

    if (existingCategories.length > 0 || existingScenarios.length > 0) {
      console.log("❌ Roleplay data already exists")
      return
    }

    // Create categories and scenarios
    console.log("📁 Creating categories and scenarios...")

    for (const { category, scenarios } of roleplayCategories) {
      const createdCategory = await prisma.roleplayCategory.create({
        data: category,
      })
      console.log(`✅ Created category: ${createdCategory.name}`)

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
        console.log(`✅ Created scenario: ${created.title}`)
      }
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
