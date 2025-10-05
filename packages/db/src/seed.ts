import type { Prisma } from "../generated/client"
import { prisma } from "./client"

const roleplayCategories: { category: Prisma.RoleplayCategoryCreateInput; roleplays: Prisma.RoleplayCreateWithoutCategoryInput[] }[] = [
  {
    category: {
      emoji: "🍕",
      name: "Food",
      isPublic: true,
    },
    roleplays: [
      {
        emoji: "🍽️",
        title: "Favorite Food",
        assistantRole: "Friend B",
        userRole: "Friend A",
        description: "Two friends share what they ate today, then talk about their favorite foods.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "🍦",
        title: "Buying Ice Cream",
        assistantRole: "Ice Cream Seller",
        userRole: "Customer",
        description: "The customer buys dessert and chooses between flavors, asking what options are available and confirming their order.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "🍽️",
        title: "Ordering Food",
        assistantRole: "Waiter",
        userRole: "Customer",
        description: "The customer asks for seating for two people and orders food at a restaurant.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "🤔",
        title: "What to Get?",
        assistantRole: "Waiter",
        userRole: "Customer",
        description: "The customer is deciding between two dishes that both sound good and asks the waiter for insights and recommendations.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "📞",
        title: "Food Delivery",
        assistantRole: "Restaurant Employee",
        userRole: "Customer",
        description: "The customer calls a restaurant to order food, asking for the menu, confirms their order, and asks how long the wait will be.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "🌮",
        title: "Trying Local Food",
        assistantRole: "Local Guide",
        userRole: "Tourist",
        description:
          "A tourist tries local food for the first time, asking about the ingredients and sharing their reaction to tasting these new dishes.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "🥘",
        title: "Exploring Local Cuisine",
        assistantRole: "Local Resident",
        userRole: "Visitor",
        description:
          "The visitor asks a local resident about popular local dishes and where to try them. They discuss cultural foods and must-try specialties.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "💑",
        title: "Deciding What to Eat",
        assistantRole: "Girlfriend",
        userRole: "Boyfriend",
        description:
          "A couple decides where to eat, discussing restaurant and cuisine preferences. They share likes and dislikes until they finally come to an agreement.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "😅",
        title: "Ordering the Wrong Item",
        assistantRole: "Waiter",
        userRole: "Customer",
        description: "The customer realizes they ordered the wrong dish and must explain their mistake to the waiter.",
        difficulty: 2,
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
    roleplays: [
      {
        emoji: "🗺️",
        title: "Asking for Directions",
        assistantRole: "Local",
        userRole: "Lost Tourist",
        description: "A lost tourist in the subway asks a local for directions to their hotel, clarifying the best route to take.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "🌍",
        title: "Dream Destination",
        assistantRole: "Friend B",
        userRole: "Friend A",
        description: "Two friends talk about their dream travel destinations and why they want to visit them.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "🏨",
        title: "Hotel Booking",
        assistantRole: "Hotel Receptionist",
        userRole: "Traveler",
        description: "A traveler books a hotel room, asking about availability, room types, pricing, and amenities.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "🚌",
        title: "Bus Fare",
        assistantRole: "Bus Driver or Local",
        userRole: "Passenger",
        description: "A passenger asks about the bus fare, where the bus stops, and how long the ride will take to reach their destination.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "🚕",
        title: "Taxi Ride",
        assistantRole: "Taxi Driver",
        userRole: "Passenger",
        description: "A passenger orders a taxi to go back to the hotel and has a fun chat with the driver about the city.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "🚆",
        title: "Buying Train Tickets",
        assistantRole: "Train Station Attendant",
        userRole: "Passenger",
        description: "A passenger buys train tickets, asking how many they need, how much it costs, and confirming their destination.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "✈️",
        title: "Booking a Flight",
        assistantRole: "Airline Agent",
        userRole: "Traveler",
        description: "A traveler books a flight, asking about flight details like timing, baggage allowance, and seat options.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "🎒",
        title: "Tour Guide Recommendations",
        assistantRole: "Tour Guide",
        userRole: "Traveler",
        description: "A traveler asks a tour guide about the best places to visit in the city, how to get there, and other local tips.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "🏛️",
        title: "Tourist Attraction",
        assistantRole: "Ticket Seller or Guide",
        userRole: "Tourist",
        description: "A tourist buys tickets to a famous landmark and asks for information about its history and interesting facts about the site.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "👮",
        title: "Lost Wallet",
        assistantRole: "Police Officer",
        userRole: "Distressed Tourist",
        description: "A tourist who lost their wallet describes it to a police officer, providing details to help locate it.",
        difficulty: 3,
        isPublic: true,
      },
      {
        emoji: "😰",
        title: "Missed the Last Bus",
        assistantRole: "Friend B",
        userRole: "Friend A",
        description: "Two friends realize they missed the last bus back to their hotel and brainstorm alternative ways to get back.",
        difficulty: 2,
        isPublic: true,
      },
    ],
  },
  {
    category: {
      emoji: "🏠",
      name: "Life",
      isPublic: true,
    },
    roleplays: [
      {
        emoji: "☀️",
        title: "Morning Chat",
        assistantRole: "Person B",
        userRole: "Person A",
        description: "Two people have a casual morning conversation about how they slept, their plans for the day, and lighthearted topics.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "📅",
        title: "Daily Routines",
        assistantRole: "Person B",
        userRole: "Person A",
        description: "Two people exchange simple questions about their daily routines, sharing details about their activities and habits.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "🎉",
        title: "Weekend Plans",
        assistantRole: "Person B",
        userRole: "Person A",
        description: "Two people discuss their plans for the weekend, sharing ideas for activities or events they might attend.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "🌙",
        title: "Talking About Life",
        assistantRole: "Friend B",
        userRole: "Friend A",
        description: "Two friends talk about life before going to sleep.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "🏡",
        title: "Finally Home",
        assistantRole: "Partner B",
        userRole: "Partner A",
        description: "Partner A comes home from work and shares details about their day with Partner B, who listens and responds supportively.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "🧘",
        title: "Favorite Ways to Relax",
        assistantRole: "Friend B",
        userRole: "Friend A",
        description: "Two friends talk about their favorite ways to relax, like reading, sports, or gaming, and share tips with each other.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "👴",
        title: "Advice from Grandpa",
        assistantRole: "Grandpa",
        userRole: "Grandchild",
        description: "The Grandchild seeks advice from Grandpa on life decisions and challenges, engaging in a thoughtful conversation.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "🐶",
        title: "New Dog",
        assistantRole: "Friend",
        userRole: "Dog Owner",
        description:
          "A pet owner talks with their friend about their new puppy, sharing stories about its adorable habits but recently naughty behavior.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "👋",
        title: "Catching Up",
        assistantRole: "Old Friend B",
        userRole: "Old Friend A",
        description: "Two old friends reconnect and catch up on life updates, discussing what they've been doing recently.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "👵",
        title: "Mother-in-Law Visit",
        assistantRole: "Mother-in-Law",
        userRole: "Son/Daughter-in-Law",
        description: "A son/daughter-in-law visits their mother-in-law and has a polite conversation about how she is doing and how her grandson is.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "👨‍🍳",
        title: "Cooking Together",
        assistantRole: "Friend B",
        userRole: "Friend A",
        description: "Two friends plan to cook a new dish together, discussing what ingredients they need to buy and how they'll prepare the meal.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "💬",
        title: "Therapy Session",
        assistantRole: "Empathetic Friend",
        userRole: "Stressed Person",
        description: "A person facing a lot of pressure and stress talks to a friend, who listens empathetically and offers comfort and reassurance.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "🤫",
        title: "Gossiping",
        assistantRole: "Friend B",
        userRole: "Friend A",
        description: "Two friends gossip about the latest drama involving a mutual friend and share their reactions to the situation.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "💪",
        title: "Sharing Fitness Plans",
        assistantRole: "Friend B",
        userRole: "Friend A",
        description: "Two friends discuss their workout routines, health goals, and ways to eat healthy while motivating each other.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "📖",
        title: "Storytelling",
        assistantRole: "Friend B",
        userRole: "Friend A",
        description: "Two friends share memorable, funny, or nostalgic stories about their lives, bonding over shared experiences.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "✨",
        title: "Dreaming Big",
        assistantRole: "Friend B",
        userRole: "Friend A",
        description:
          "Two friends meet at a coffee shop and talk about their future dreams and goals, sharing what makes them happy and inspired in life.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "😨",
        title: "Fears & Phobias",
        assistantRole: "Friend B",
        userRole: "Friend A",
        description: "Two friends get vulnerable and talk about their fears and phobias, supporting each other through the discussion.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "🌌",
        title: "Deep Talk",
        assistantRole: "Friend B",
        userRole: "Friend A",
        description:
          "Two friends have a heartfelt conversation before going to sleep, discussing their core values, most vulnerable moments, and the purpose of life.",
        difficulty: 2,
        isPublic: true,
      },
    ],
  },
  {
    category: {
      emoji: "🌱",
      name: "Beginner",
      isPublic: true,
    },
    roleplays: [
      {
        emoji: "👋",
        title: "Introductions",
        assistantRole: "Person B",
        userRole: "Person A",
        description:
          "Two people introduce themselves to each other. They exchange simple greetings and names, then details like age, occupation, and home country.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "🤝",
        title: "Making Friends",
        assistantRole: "Friend B",
        userRole: "Friend A",
        description:
          "Two new friends meet at a park and introduce themselves. They ask each other's age, where they are from, and then what they like to do. They bond over discovering they both enjoy the same activities.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "😊",
        title: "Basic Emotions",
        assistantRole: "Friend B",
        userRole: "Friend A",
        description: "Two friends meet at the park and talk about how they feel today, sharing simple emotions like happy, sad, or tired.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "📆",
        title: "How's Your Day?",
        assistantRole: "Friend B",
        userRole: "Friend A",
        description: "Friend B asks Friend A about their daily routine and what they did today, practicing talking about daily activities.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "👨‍👩‍👧‍👦",
        title: "Introducing Family",
        assistantRole: "Classmate B",
        userRole: "Classmate A",
        description:
          "Classmate B asks Classmate A about their family and Classmate A introduces their family members, including their occupations and relationships.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "🎨",
        title: "Hobbies",
        assistantRole: "Another Party Attendee",
        userRole: "Party Attendee",
        description: "Two people meet at a social event and talk about their favorite hobbies, colors, foods, animals, and sports.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "🍎",
        title: "Counting Apples",
        assistantRole: "Market Seller",
        userRole: "Customer",
        description: "The customer buys three apples at the market and asks for the price, practicing counting and quantities.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "🌤️",
        title: "Weather",
        assistantRole: "Friend B",
        userRole: "Friend A",
        description: "Two friends chat about the nice weather today and discuss what activities they might do together.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "👍",
        title: "Likes/Dislikes",
        assistantRole: "Friend B",
        userRole: "Friend A",
        description: "Friend A and Friend B talk about their likes and dislikes, sharing basic opinions about different activities and interests.",
        difficulty: 1,
        isPublic: true,
      },
    ],
  },
  {
    category: {
      emoji: "👥",
      name: "Social",
      isPublic: true,
    },
    roleplays: [
      {
        emoji: "🌳",
        title: "Meeting at a Park",
        assistantRole: "Friend B",
        userRole: "Friend A",
        description: "Two friends bump into each other at a park and talk about their day and recent activities, planning their next meet up.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "🎊",
        title: "Meeting Someone New",
        assistantRole: "Party Attendee B",
        userRole: "Party Attendee A",
        description:
          "A party attendee meets a charming stranger for the first time, exchanging introductions and having a lighthearted conversation.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "📞",
        title: "Inviting Someone Out",
        assistantRole: "Friend B",
        userRole: "Friend A",
        description: "Friend A invites Friend B to hang out or attend an event, suggesting fun activities and checking Friend B's availability.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "🍸",
        title: "Rooftop Bar",
        assistantRole: "Guest B",
        userRole: "Guest A",
        description:
          "Two people meet at a rooftop bar. Guest A buys a drink for Guest B and strikes up a friendly conversation, asking about their evening.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "🎂",
        title: "Forgot a Birthday",
        assistantRole: "Best Friend",
        userRole: "Forgetful Friend",
        description:
          "A forgetful friend realizes they totally forgot about their best friend's birthday and apologizes, trying to make amends with a thoughtful gesture or plan.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "💔",
        title: "Cheering Up a Friend",
        assistantRole: "Heartbroken Friend",
        userRole: "Supportive Friend",
        description:
          "A supportive friend consoles their heartbroken friend, who can't stop crying after a breakup. They offer comforting words and advice.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "🥐",
        title: "Career Advice",
        assistantRole: "Friend B",
        userRole: "Friend A",
        description:
          "Friend B is uncertain about what to do after quitting their unfulfilling 9-5. They share their dream of opening a bakery despite not knowing how to bake and seek Friend A's advice on what to do.",
        difficulty: 3,
        isPublic: true,
      },
    ],
  },
  {
    category: {
      emoji: "🛍️",
      name: "Shopping",
      isPublic: true,
    },
    roleplays: [
      {
        emoji: "🛒",
        title: "Basic Shopping",
        assistantRole: "Store Employee",
        userRole: "Customer",
        description: "The customer is shopping at a supermarket, asking for prices of fruits and where to find certain items.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "💳",
        title: "Checking Out",
        assistantRole: "Cashier",
        userRole: "Customer",
        description: "The customer is checking out at a store, asking for the total price and whether they can pay with a card.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "👕",
        title: "Shopping for Clothes",
        assistantRole: "Store Employee",
        userRole: "Customer",
        description: "The customer is looking for a sweater, asking about available sizes and colors, and deciding on the one they want to buy.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "🥬",
        title: "Grocery Shopping",
        assistantRole: "Store Employee",
        userRole: "Customer",
        description: "The customer is buying ingredients for a recipe and asks for directions to the vegetable section.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "🎁",
        title: "Buying Souvenirs",
        assistantRole: "Shopkeeper",
        userRole: "Customer",
        description: "The customer is looking for a souvenir to bring back as a gift. They ask for recommendations and discuss the price of items.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "📚",
        title: "At the Bookstore",
        assistantRole: "Bookstore Employee",
        userRole: "Customer",
        description:
          "The customer is looking for the best books to buy and asks the shopkeeper for recommendations, getting into a discussion of their favorite book.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "🎀",
        title: "Buying a Gift",
        assistantRole: "Store Employee",
        userRole: "Customer",
        description:
          "The customer is buying a gift for their partner and asks the store employee for suggestions based on what the customer thinks their partner might like.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "💻",
        title: "New Computer",
        assistantRole: "Electronics Store Employee",
        userRole: "Customer",
        description:
          "The customer is buying a new computer for their tech job. They ask about features, prices, and recommendations for their specific needs.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "💰",
        title: "Bargaining at the Market",
        assistantRole: "Market Seller",
        userRole: "Customer",
        description:
          "The customer is buying a necklace and tries to bargain the price from $10 to $3. They practice negotiating prices and asking for discounts.",
        difficulty: 3,
        isPublic: true,
      },
    ],
  },
  {
    category: {
      emoji: "🎓",
      name: "Education",
      isPublic: true,
    },
    roleplays: [
      {
        emoji: "📝",
        title: "First Day of Class",
        assistantRole: "Teacher and Classmates",
        userRole: "Student",
        description:
          "The student introduces themselves to the teacher and classmates on the first day of class. They share their name, age, where they are from, and their favorite subject.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "🌍",
        title: "Exchange Student",
        assistantRole: "Local Classmate Student",
        userRole: "New Exchange Student",
        description:
          "A new exchange student introduces themselves to their classmates. They share their name, home country, and why they are excited to study in a new country.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "📖",
        title: "Homework Help",
        assistantRole: "Teacher",
        userRole: "Student",
        description: "The student asks the teacher for clarification on homework and a project due date.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "⏰",
        title: "Running Late",
        assistantRole: "Angry Teacher",
        userRole: "Student",
        description:
          "The student is explaining to the teacher why they are an hour late to class. The teacher asks questions while the student apologizes and makes up excuses.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "📉",
        title: "Bad Grade",
        assistantRole: "Teacher",
        userRole: "Student",
        description:
          "The student received a bad grade and asks the teacher what they did wrong. They discuss how to improve while the student expresses frustration over the difficulty of the subject.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "👨‍👩‍👦",
        title: "Parent-Teacher Conference",
        assistantRole: "Teacher",
        userRole: "Parent",
        description: "A parent politely discusses their child's struggles in math with the teacher.",
        difficulty: 3,
        isPublic: true,
      },
    ],
  },
  {
    category: {
      emoji: "💕",
      name: "Romance",
      isPublic: true,
    },
    roleplays: [
      {
        emoji: "💝",
        title: "Exchanging Compliments",
        assistantRole: "Partner B",
        userRole: "Partner A",
        description: "A couple sits together on the couch, exchanging sweet and basic compliments.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "☕",
        title: "First Date",
        assistantRole: "Person B",
        userRole: "Person A",
        description:
          "Two people on their first date share what they like to do and talk about their interests while navigating a little nervousness.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "🚂",
        title: "Cute Stranger",
        assistantRole: "Cute Stranger",
        userRole: "Passenger A",
        description:
          "A playful passenger flirts with a cute stranger at the train station, trying to strike up a conversation and ask for their number.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "📚",
        title: "Captivating Classmate",
        assistantRole: "Cute Classmate",
        userRole: "Student A",
        description: "A student flirts with a cute classmate they meet in the library, using the book they're reading as a conversation starter.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "🛗",
        title: "Stuck in an Elevator",
        assistantRole: "Crush",
        userRole: "Person A",
        description: "The person and their crush are stuck in an elevator.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "💖",
        title: "Heartfelt Confession",
        assistantRole: "Crush",
        userRole: "Admirer",
        description: "An admirer builds up the courage to confess their feelings to their crush, choosing their words carefully.",
        difficulty: 3,
        isPublic: true,
      },
      {
        emoji: "🏖️",
        title: "Weekend Getaway",
        assistantRole: "Partner B",
        userRole: "Partner A",
        description: "A couple plans a romantic weekend getaway, discussing destinations, activities, and ways to make the trip special.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "😡",
        title: "Intense Argument",
        assistantRole: "Cheating Partner",
        userRole: "Betrayed Partner",
        description:
          "After discovering their partner cheated after 10 years together, a betrayed partner confronts them in an intense argument, expressing their pain and frustration.",
        difficulty: 3,
        isPublic: true,
      },
      {
        emoji: "☕",
        title: "Ex, Or Not?",
        assistantRole: "Ex",
        userRole: "Person A",
        description: "A person runs into their ex at a café, who still secretly has feelings for them.",
        difficulty: 3,
        isPublic: true,
      },
      {
        emoji: "💔",
        title: "Breaking Up",
        assistantRole: "Partner B",
        userRole: "Partner A",
        description:
          "Partner A explains to Partner B why they're better off as friends and have an honest, heartfelt conversation about ending their relationship.",
        difficulty: 3,
        isPublic: true,
      },
      {
        emoji: "💍",
        title: "Wedding Proposal",
        assistantRole: "Partner",
        userRole: "Proposer",
        description: "A person proposes to their partner, expressing their love and choosing heartfelt words to make the moment unforgettable.",
        difficulty: 3,
        isPublic: true,
      },
    ],
  },
  {
    category: {
      emoji: "💼",
      name: "Work",
      isPublic: true,
    },
    roleplays: [
      {
        emoji: "🚗",
        title: "Getting to Work",
        assistantRole: "Colleague",
        userRole: "Employee",
        description: "Two colleagues talk about how they travel to work, sharing simple details about their commute.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "🆕",
        title: "First Day at Work",
        assistantRole: "Supervisor",
        userRole: "New Employee",
        description:
          "A new employee begins their first day at work, getting instructions on tasks, asking about their main responsibilities, and clarifying expectations.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "🍽️",
        title: "Company Dinner",
        assistantRole: "Colleague",
        userRole: "Employee",
        description:
          "An employee introduces themselves at a company dinner, talking about their job, work schedule, and hobbies outside of work to get to know their colleagues.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "🎯",
        title: "Career Planning",
        assistantRole: "Career Advisor",
        userRole: "Job Seeker",
        description:
          "A job seeker discusses their career goals and plans with a career advisor, seeking advice on their next steps and long-term objectives.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "📧",
        title: "Email Disaster",
        assistantRole: "Boss",
        userRole: "Employee",
        description:
          "An employee accidentally sends an inappropriate or embarrassing email to the whole company and must explain the mistake to their boss, apologizing and proposing a solution.",
        difficulty: 3,
        isPublic: true,
      },
      {
        emoji: "💼",
        title: "Job Interview",
        assistantRole: "Interviewer",
        userRole: "Job Candidate",
        description:
          "A job candidate is being interviewed for a position at a company, answering questions about their skills and experience while also asking about career growth opportunities.",
        difficulty: 3,
        isPublic: true,
      },
      {
        emoji: "📊",
        title: "Company Meeting",
        assistantRole: "Team Lead",
        userRole: "Team Member",
        description:
          "During a company meeting, the team lead discusses ongoing projects, and the team member contributes ideas or asks questions about their role in the team's objectives.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "🎯",
        title: "Setting Team Goals",
        assistantRole: "Unmotivated Teammate",
        userRole: "Team Lead",
        description:
          "A team lead motivates an unmotivated teammate to stay on track and meet a challenging deadline, emphasizing the importance of teamwork and goal-setting.",
        difficulty: 3,
        isPublic: true,
      },
      {
        emoji: "💰",
        title: "Salary Negotiation",
        assistantRole: "Recruiter",
        userRole: "Job Seeker",
        description: "A job seeker negotiates for a hefty salary raise in order to accept the job offer.",
        difficulty: 3,
        isPublic: true,
      },
      {
        emoji: "📈",
        title: "Performance Review",
        assistantRole: "Employee",
        userRole: "Manager",
        description:
          "A manager gives a performance review to an employee, offering constructive feedback on areas of improvement and praising success.",
        difficulty: 3,
        isPublic: true,
      },
      {
        emoji: "⬆️",
        title: "Requesting a Promotion",
        assistantRole: "Manager",
        userRole: "Employee",
        description:
          "An employee requests a promotion after performing exceptionally well in the last quarter, confidently sharing their contributions to impress their manager.",
        difficulty: 3,
        isPublic: true,
      },
      {
        emoji: "💡",
        title: "Pitching an Idea",
        assistantRole: "Boss",
        userRole: "Employee",
        description:
          "An employee presents an innovative work idea to their boss, addressing their skeptical boss's concerns about budget constraints and highlighting the potential benefits.",
        difficulty: 3,
        isPublic: true,
      },
    ],
  },
  {
    category: {
      emoji: "🎬",
      name: "Entertainment",
      isPublic: true,
    },
    roleplays: [
      {
        emoji: "🎵",
        title: "Favorite Music",
        assistantRole: "Friend B",
        userRole: "Friend A",
        description: "Two friends ask and answer simple questions about their favorite music and genre.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "🎟️",
        title: "Buying a Movie Ticket",
        assistantRole: "Ticket Seller",
        userRole: "Moviegoer",
        description:
          "A moviegoer buys a ticket and asks the ticket seller for recommendations on what to watch tonight, discussing available genres and showtimes.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "📺",
        title: "Favorite Movies & TV Shows",
        assistantRole: "Person B",
        userRole: "Person A",
        description:
          "Two people talk about their favorite movies or TV shows, asking questions like, 'Have you watched [show]?' or 'What's your favorite movie of all time?'",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "⭐",
        title: "Meeting a Celebrity",
        assistantRole: "Celebrity",
        userRole: "Fan",
        description:
          "A fan meets their favorite celebrity at a meet-and-greet and tries to stay calm while expressing their excitement for the celebrity's work.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "🎤",
        title: "Favorite Music Artist",
        assistantRole: "Music Artist",
        userRole: "Fan",
        description:
          "A fan spots their favorite famous musical artist and asks for an autograph, expressing admiration and sharing how much their music means to them.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "🎸",
        title: "Bonding Over a Band",
        assistantRole: "Concertgoer B",
        userRole: "Concertgoer A",
        description: "Two concertgoers meet and bond over their shared love for the band performing, talking about their favorite songs.",
        difficulty: 1,
        isPublic: true,
      },
      {
        emoji: "🎢",
        title: "Scary Ride",
        assistantRole: "Friend B",
        userRole: "Friend A",
        description:
          "Two friends at an amusement park discuss what to do next, debating whether to go on the big scary ride or choose something less intense.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "🎥",
        title: "Discussing a Movie Ending",
        assistantRole: "Friend B",
        userRole: "Friend A",
        description:
          "Two friends talk about a recent movie they watched, discussing its ending and sharing their opinions on whether it was satisfying.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "🏆",
        title: "Debating the Best Sports Player",
        assistantRole: "Friend B",
        userRole: "Friend A",
        description:
          "Two friends fiercely debate who the best sports player of all time is in their favorite sport, citing stats, achievements, and personal opinions.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "🎨",
        title: "Abstract Art",
        assistantRole: "Art Critic",
        userRole: "Artist",
        description:
          "An artist describes their abstract art piece using descriptive adjectives and tries to convince the critic why it's worth millions, emphasizing the emotions and creativity behind it.",
        difficulty: 3,
        isPublic: true,
      },
    ],
  },
  {
    category: {
      emoji: "🗣️",
      name: "Persuasion",
      isPublic: true,
    },
    roleplays: [
      {
        emoji: "💃",
        title: "Dance Class",
        assistantRole: "Friend B",
        userRole: "Friend A",
        description: "A friend persuades their hesitant and awkward friend to join a dance class, highlighting how fun and exciting it could be.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "🧹",
        title: "Clean Your Room!",
        assistantRole: "Messy Kid",
        userRole: "Parent",
        description: "A parent tries to persuade their messy kid to clean their room and focus on studying instead of playing video games.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "🍕",
        title: "Picky Eater",
        assistantRole: "Kid",
        userRole: "Parent",
        description: "A parent convinces their picky eater kid who only eats pizza to try healthier foods, making it sound fun and appealing.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "👨‍👧",
        title: "Meeting the Parents",
        assistantRole: "Stern Dad",
        userRole: "Partner",
        description: "A person meets their partner's stern and intimidating dad and tries to persuade him why they're a good fit for his child.",
        difficulty: 3,
        isPublic: true,
      },
      {
        emoji: "🚗",
        title: "Spontaneous Road Trip",
        assistantRole: "Friend B",
        userRole: "Friend A",
        description:
          "One friend convinces another to join them on a spontaneous weekend road trip, sharing exciting plans for destinations and activities.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "💕",
        title: "Hard to Get",
        assistantRole: "Woman Playing Hard to Get",
        userRole: "Admirer",
        description: "An admirer tries to convince a woman playing hard to get to go on a date and share her number, using charm and persistence.",
        difficulty: 3,
        isPublic: true,
      },
      {
        emoji: "🏖️",
        title: "Slacking Off",
        assistantRole: "Boss",
        userRole: "Employee",
        description:
          "An employee convinces their boss to let them work remotely and also take a year of paid leave, explaining how it benefits the company.",
        difficulty: 3,
        isPublic: true,
      },
      {
        emoji: "👨‍👦",
        title: "Handling Teenagers",
        assistantRole: "Teenage Son",
        userRole: "Parent",
        description:
          "A parent tries to convince their teenage son to attend a family event instead of hanging out with his friends, emphasizing the importance of family time.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "🥾",
        title: "Hiking Trip",
        assistantRole: "Scared Friend",
        userRole: "Adventurous Friend",
        description:
          "An adventurous friend tries to convince their friend who is scared of everything outdoors to join a hiking trip, addressing concerns about bugs and pooping outside.",
        difficulty: 3,
        isPublic: true,
      },
      {
        emoji: "🚓",
        title: "Pulled Over",
        assistantRole: "Police Officer",
        userRole: "Driver",
        description:
          "A driver pulled over for speeding tries to talk their way out of getting a ticket by explaining the situation and staying calm.",
        difficulty: 3,
        isPublic: true,
      },
      {
        emoji: "🎸",
        title: "Dropping Out",
        assistantRole: "Parent",
        userRole: "Aspiring Musician",
        description:
          "An aspiring musician tries to convince their parents why they want to drop out of school to pursue their dream, explaining their passion and goals.",
        difficulty: 3,
        isPublic: true,
      },
      {
        emoji: "☢️",
        title: "Nuclear Threat",
        assistantRole: "Foreign President",
        userRole: "Diplomat",
        description:
          "A diplomat negotiates with a foreign president who keeps on wanting to send nuclear bombs, convincing them to choose diplomacy instead.",
        difficulty: 3,
        isPublic: true,
      },
      {
        emoji: "🎙️",
        title: "Presidential Speech",
        assistantRole: "Nation's Citizens",
        userRole: "President",
        description:
          "The president delivers a speech addressing their first 100 days in office, highlighting achievements and plans to win over the audience.",
        difficulty: 3,
        isPublic: true,
      },
    ],
  },
  {
    category: {
      emoji: "🏥",
      name: "Health",
      isPublic: true,
    },
    roleplays: [
      {
        emoji: "🩺",
        title: "Basic Check-Up",
        assistantRole: "Friendly Doctor",
        userRole: "Patient",
        description:
          "A patient visits the doctor for a routine check-up. The doctor asks simple questions about their daily habits to learn more about their lifestyle.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "🤕",
        title: "Stomach Pain",
        assistantRole: "Nurse",
        userRole: "Patient",
        description: "A patient talks to the nurse about their stomach hurting, discussing possible reasons and symptoms to identify the cause.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "🍪",
        title: "Guilty Confessions",
        assistantRole: "Doctor",
        userRole: "Snack Lover",
        description: "A nervous patient visits the doctor for a check-up and admits their recent weight gain and unhealthy binge-eating at night.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "💪",
        title: "Fitness Goals",
        assistantRole: "Doctor",
        userRole: "Patient",
        description: "A patient discusses their fitness goals with a doctor, who suggests a new workout plan that seems a little unreasonable.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "🚑",
        title: "Car Accident",
        assistantRole: "911 Operator",
        userRole: "Witness",
        description:
          "A witness reports a car accident and describes the location and injuries. The operator guides them on staying safe and waiting for help.",
        difficulty: 3,
        isPublic: true,
      },
    ],
  },
  {
    category: {
      emoji: "⚖️",
      name: "Debates",
      isPublic: true,
    },
    roleplays: [
      {
        emoji: "💼",
        title: "Online vs In-Person Work",
        assistantRole: "In-Person Work Enthusiast",
        userRole: "Remote Work Fan",
        description: "Two people debate the pros and cons of online versus in-person work.",
        difficulty: 2,
        isPublic: true,
      },
      {
        emoji: "📅",
        title: "Four-Day Workweek",
        assistantRole: "Company Board Member",
        userRole: "Employee Advocate",
        description: "An employee advocate passionately argues for a four-day workweek.",
        difficulty: 3,
        isPublic: true,
      },
      {
        emoji: "🍺",
        title: "Lowering the Drinking Age",
        assistantRole: "Government Official",
        userRole: "Policy Advocate",
        description: "An advocate proposes lowering the drinking age to a government official, debating potential benefits and societal impacts.",
        difficulty: 3,
        isPublic: true,
      },
      {
        emoji: "🌍",
        title: "Climate Change Debate",
        assistantRole: "Skeptical Friend",
        userRole: "Concerned Environmentalist",
        description:
          "A passionate environmentalist debates their friend on climate change, advocating for alternatives to fossil fuels and stricter government policies.",
        difficulty: 3,
        isPublic: true,
      },
      {
        emoji: "🤖",
        title: "AI Dilemma",
        assistantRole: "Visionary Tech CEO",
        userRole: "Tech Ethicist",
        description:
          "A tech ethicist debates with a CEO about the ethical implications of their new AI, discussing its impact on jobs and how to implement it responsibly.",
        difficulty: 3,
        isPublic: true,
      },
      {
        emoji: "📚",
        title: "Educational Policy",
        assistantRole: "Government Official",
        userRole: "Advocate for Equality",
        description:
          "An advocate proposes an educational policy to reduce income inequality while addressing a government official's concerns about budget constraints.",
        difficulty: 3,
        isPublic: true,
      },
      {
        emoji: "💵",
        title: "Universal Basic Income",
        assistantRole: "Interviewer",
        userRole: "Politician",
        description:
          "A politician discusses the benefits of universal basic income with an interviewer, responding to tough questions and defending the policy's impact on society.",
        difficulty: 3,
        isPublic: true,
      },
      {
        emoji: "🚀",
        title: "Space Exploration",
        assistantRole: "Skeptic",
        userRole: "Advocate for Space Exploration",
        description:
          "An advocate argues for the importance of space exploration for humanity's future while the skeptic insists resources should be focused on Earth's immediate problems.",
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
    const existingRoleplays = await prisma.roleplay.findMany()

    // Check existing lesson data
    const existingLessonCategories = await prisma.lessonCategory.findMany()
    const existingLessons = await prisma.lesson.findMany()

    // Seed roleplay data if not exists
    if (existingRoleplayCategories.length === 0 && existingRoleplays.length === 0) {
      console.log("📁 Creating roleplay categories and roleplays...")

      for (const { category, roleplays } of roleplayCategories) {
        const createdCategory = await prisma.roleplayCategory.create({
          data: category,
        })
        console.log(`✅ Created roleplay category: ${createdCategory.name}`)

        // Create roleplays for this category
        for (const roleplay of roleplays) {
          const created = await prisma.roleplay.create({
            data: {
              emoji: roleplay.emoji,
              title: roleplay.title,
              assistantRole: roleplay.assistantRole,
              userRole: roleplay.userRole,
              description: roleplay.description,
              difficulty: roleplay.difficulty,
              isPublic: roleplay.isPublic,

              categoryId: createdCategory.id,
            },
          })
          console.log(`✅ Created roleplay: ${created.title}`)
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
