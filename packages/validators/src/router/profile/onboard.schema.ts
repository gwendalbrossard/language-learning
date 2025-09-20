import { z } from "zod"

import { LearningLanguageLevel } from "@acme/shared/db"

export enum DrinkingTrigger {
  STRESS = "STRESS",
  SOCIAL_PRESSURE = "SOCIAL_PRESSURE",
  TROUBLE_SLEEPING = "TROUBLE_SLEEPING",
  BOREDOM = "BOREDOM",
  HABIT = "HABIT",
  CELEBRATION = "CELEBRATION",
  SADNESS = "SADNESS",
  ANGER = "ANGER",
  RELAXATION = "RELAXATION",
}

export enum Relationship {
  IN_RELATIONSHIP = "IN_RELATIONSHIP",
  MARRIED = "MARRIED",
  SINGLE = "SINGLE",
  DIVORCED_OR_SEPARATED = "DIVORCED_OR_SEPARATED",
}

export enum ReasonForChange {
  SLEEP_BETTER = "SLEEP_BETTER",
  SAVE_MONEY = "SAVE_MONEY",
  LOSE_WEIGHT = "LOSE_WEIGHT",
  MENTAL_CLARITY = "MENTAL_CLARITY",
  REDUCE_ANXIETY = "REDUCE_ANXIETY",
  IMPROVE_RELATIONSHIPS = "IMPROVE_RELATIONSHIPS",
  REGAIN_CONTROL = "REGAIN_CONTROL",
  MORE_ENERGY = "MORE_ENERGY",
  PROTECT_HEALTH = "PROTECT_HEALTH",
  BETTER_ROLE_MODEL = "BETTER_ROLE_MODEL",
}

export const ZProfileOnboardSchema = z.object({
  // nativeLanguage: z.string(), // TODO: Uncomment this when we have a way to set the native language. Also remove the default value in the schema.
  learningLanguage: z.string(), // TODO: Add BCP 47 language tag validation
  learningLanguageLevel: z.enum(LearningLanguageLevel),
  drinkingTriggers: z.array(z.enum(DrinkingTrigger)),
  relationshipStatus: z.enum(Relationship),
  reasonsForChange: z.array(z.enum(ReasonForChange)),
})

export type TProfileOnboardSchema = z.infer<typeof ZProfileOnboardSchema>
