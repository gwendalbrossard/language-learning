import { prisma } from "./client"

const roleplayScenarios = [
  {
    emoji: "🍕",
    title: "Ordering Food at a Restaurant",
    description: "Practice ordering food, asking about ingredients, and making special requests in a casual dining setting.",
    instructions:
      "You are a friendly waiter at a casual Italian restaurant. Help the customer order food by describing menu items, answering questions about ingredients, and accommodating special dietary requests. Be patient and encouraging with their language learning. Use simple, clear language and repeat information if needed. Always be polite and professional.",
    tags: ["restaurant", "food", "beginner", "daily-life"],
  },
  {
    emoji: "🏥",
    title: "Doctor's Appointment",
    description: "Learn to describe symptoms, understand medical advice, and communicate with healthcare professionals.",
    instructions:
      "You are a compassionate doctor conducting a routine check-up. Help the patient describe their symptoms and concerns. Use medical terminology when appropriate but explain it in simple terms. Ask follow-up questions to understand their condition better. Provide clear, reassuring advice and instructions. Be patient and understanding as they may struggle with medical vocabulary.",
    tags: ["medical", "health", "intermediate", "essential"],
  },
  {
    emoji: "🛒",
    title: "Shopping for Groceries",
    description: "Navigate a grocery store, ask for help finding items, and interact with cashiers and store employees.",
    instructions:
      "You are a helpful grocery store employee. Assist the customer in finding items, explaining where different products are located, and helping with any questions about prices or products. Be friendly and patient. If they're looking for something specific, offer alternatives if the item isn't available. Use everyday vocabulary related to shopping and food.",
    tags: ["shopping", "daily-life", "beginner", "practical"],
  },
  {
    emoji: "✈️",
    title: "Airport and Travel",
    description: "Handle airport procedures, ask for directions, and communicate during travel situations.",
    instructions:
      "You are an airport staff member (could be check-in agent, security, or information desk). Help the traveler with their needs - checking in, finding gates, understanding announcements, or handling travel issues. Use travel-related vocabulary and be clear about procedures. Be helpful and patient, especially if they seem stressed about traveling. Provide step-by-step guidance when needed.",
    tags: ["travel", "airport", "intermediate", "practical"],
  },
  {
    emoji: "💼",
    title: "Job Interview",
    description: "Practice professional communication, answer interview questions, and discuss qualifications and experience.",
    instructions:
      "You are a professional hiring manager conducting a job interview for a mid-level position. Ask typical interview questions about experience, skills, and career goals. Be professional but friendly, and help the candidate express their qualifications clearly. If they struggle with professional vocabulary, gently guide them to better expressions. Provide constructive feedback and encouragement throughout the conversation.",
    tags: ["professional", "career", "advanced", "business"],
  },
]

async function seed() {
  console.log("🌱 Seeding roleplay scenarios...")

  try {
    const existing = await prisma.roleplayScenario.findMany()
    if (existing.length > 0) {
      console.log("❌ Roleplay scenarios already exist")
      return
    }

    // Create new scenarios
    for (const scenario of roleplayScenarios) {
      const created = await prisma.roleplayScenario.create({
        data: scenario,
      })
      console.log(`✅ Created scenario: ${created.title}`)
    }

    console.log("🎉 Seeding completed successfully!")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

export { seed }
