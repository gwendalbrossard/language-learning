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
        prompt:
          "You are a friendly waiter at a casual Italian restaurant. Help the customer order food by describing menu items, answering questions about ingredients, and accommodating special dietary requests. Be patient and encouraging with their language learning. Use simple, clear language and repeat information if needed. Always be polite and professional.",

        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "🛒",
        title: "Shopping for Groceries",
        assistantRole: "Store employee",
        userRole: "Shopper",
        description: "Navigate a grocery store, ask for help finding items, and interact with cashiers and store employees.",
        prompt:
          "You are a helpful grocery store employee. Assist the customer in finding items, explaining where different products are located, and helping with any questions about prices or products. Be friendly and patient. If they're looking for something specific, offer alternatives if the item isn't available. Use everyday vocabulary related to shopping and food.",

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
        prompt:
          "You are a compassionate doctor conducting a routine check-up. Help the patient describe their symptoms and concerns. Use medical terminology when appropriate but explain it in simple terms. Ask follow-up questions to understand their condition better. Provide clear, reassuring advice and instructions. Be patient and understanding as they may struggle with medical vocabulary.",
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
        prompt:
          "You are an airport staff member (could be check-in agent, security, or information desk). Help the traveler with their needs - checking in, finding gates, understanding announcements, or handling travel issues. Use travel-related vocabulary and be clear about procedures. Be helpful and patient, especially if they seem stressed about traveling. Provide step-by-step guidance when needed.",
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
        prompt:
          "You are a professional hiring manager conducting a job interview for a mid-level position. Ask typical interview questions about experience, skills, and career goals. Be professional but friendly, and help the candidate express their qualifications clearly. If they struggle with professional vocabulary, gently guide them to better expressions. Provide constructive feedback and encouragement throughout the conversation.",

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
            prompt: scenario.prompt,
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
