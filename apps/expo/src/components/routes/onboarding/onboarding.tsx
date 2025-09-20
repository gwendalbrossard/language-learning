import type { FC } from "react"
import { useEffect, useState } from "react"
import { useRouter } from "expo-router"
import { zodResolver } from "@hookform/resolvers/zod"
import { usePostHog } from "posthog-react-native"
import { FormProvider, useForm } from "react-hook-form"

import type { TProfileOnboardSchema } from "@acme/validators"
import { POSTHOG_EVENTS } from "@acme/shared/posthog"
import { ZProfileOnboardSchema } from "@acme/validators"

import type { StepProps } from "~/components/common/step"
import { queryClient } from "~/utils/api"
import { authClient } from "~/utils/auth"
import AlcoholEffects from "./steps/alcohol-effects"
import CreatingCustomPlan from "./steps/creating-custom-plan"
import DrinkingTriggers from "./steps/drinking-triggers"
import ExploreHabits from "./steps/explore-habits"
import FinalCustomPlan from "./steps/final-custom-plan"
import FinalizingCustomPlan from "./steps/finalizing-custom-plan"
import FutureResults from "./steps/future-results"
import GetToKnowYou from "./steps/get-to-know-you"
import Intentions from "./steps/intentions"
import LearningLanguage from "./steps/learning-language"
import LearningLanguageLevel from "./steps/learning-language-level"
import Notifications from "./steps/notifications"
import Rating from "./steps/rating"
import ReasonsForChange from "./steps/reasons-for-change"
import RelationshipStatus from "./steps/relationship-status"
import StruggleToChange from "./steps/struggle-to-change"
import Testimonials from "./steps/testimonials"
import VisualizeYourProgress from "./steps/visualize-your-progress"

export enum OnboardingStep {
  GET_TO_KNOW_YOU = "GET_TO_KNOW_YOU",
  LEARNING_LANGUAGE = "LEARNING_LANGUAGE",
  LEARNING_LANGUAGE_LEVEL = "LEARNING_LANGUAGE_LEVEL",
  EXPLORE_HABITS = "EXPLORE_HABITS",
  STRUGGLE_TO_CHANGE = "STRUGGLE_TO_CHANGE",
  DRINKING_TRIGGERS = "DRINKING_TRIGGERS",
  TESTIMONIALS = "TESTIMONIALS",
  ALCOHOL_EFFECTS = "ALCOHOL_EFFECTS",
  REASONS_FOR_CHANGE = "REASONS_FOR_CHANGE",
  INTENTIONS = "INTENTIONS",
  RELATIONSHIP_STATUS = "RELATIONSHIP_STATUS",
  NOTIFICATIONS = "NOTIFICATIONS",
  FUTURE_RESULTS = "FUTURE_RESULTS",
  RATING = "RATING",
  CREATING_CUSTOM_PLAN = "CREATING_CUSTOM_PLAN",
  VISUALIZE_YOUR_PROGRESS = "VISUALIZE_YOUR_PROGRESS",
  FINALIZING_CUSTOM_PLAN = "FINALIZING_CUSTOM_PLAN",
  FINAL_CUSTOM_PLAN = "FINAL_CUSTOM_PLAN",
}

type StepConfig = {
  component: FC<StepProps>
  nextStep: OnboardingStep | null
}

const onboardingFlow: Record<OnboardingStep, StepConfig> = {
  // Who are you?
  [OnboardingStep.GET_TO_KNOW_YOU]: {
    component: GetToKnowYou,
    nextStep: OnboardingStep.LEARNING_LANGUAGE,
  },
  [OnboardingStep.LEARNING_LANGUAGE]: {
    component: LearningLanguage,
    nextStep: OnboardingStep.LEARNING_LANGUAGE_LEVEL,
  },
  [OnboardingStep.LEARNING_LANGUAGE_LEVEL]: {
    component: LearningLanguageLevel,
    nextStep: OnboardingStep.RELATIONSHIP_STATUS,
  },
  [OnboardingStep.RELATIONSHIP_STATUS]: {
    component: RelationshipStatus,
    nextStep: OnboardingStep.EXPLORE_HABITS,
  },
  // Explore habits
  [OnboardingStep.EXPLORE_HABITS]: {
    component: ExploreHabits,
    nextStep: OnboardingStep.DRINKING_TRIGGERS,
  },
  [OnboardingStep.DRINKING_TRIGGERS]: {
    component: DrinkingTriggers,
    nextStep: OnboardingStep.ALCOHOL_EFFECTS,
  },
  [OnboardingStep.ALCOHOL_EFFECTS]: {
    component: AlcoholEffects,
    nextStep: OnboardingStep.CREATING_CUSTOM_PLAN,
  },
  [OnboardingStep.CREATING_CUSTOM_PLAN]: {
    component: CreatingCustomPlan,
    nextStep: OnboardingStep.INTENTIONS,
  },
  // Intentions
  [OnboardingStep.INTENTIONS]: {
    component: Intentions,
    nextStep: OnboardingStep.REASONS_FOR_CHANGE,
  },
  [OnboardingStep.REASONS_FOR_CHANGE]: {
    component: ReasonsForChange,
    nextStep: OnboardingStep.VISUALIZE_YOUR_PROGRESS,
  },
  // Visualize your progress
  [OnboardingStep.VISUALIZE_YOUR_PROGRESS]: {
    component: VisualizeYourProgress,
    nextStep: OnboardingStep.FUTURE_RESULTS,
  },
  [OnboardingStep.FUTURE_RESULTS]: {
    component: FutureResults,
    nextStep: OnboardingStep.TESTIMONIALS,
  },
  [OnboardingStep.TESTIMONIALS]: {
    component: Testimonials,
    nextStep: OnboardingStep.STRUGGLE_TO_CHANGE,
  },
  [OnboardingStep.STRUGGLE_TO_CHANGE]: {
    component: StruggleToChange,
    nextStep: OnboardingStep.FINALIZING_CUSTOM_PLAN,
  },
  [OnboardingStep.FINALIZING_CUSTOM_PLAN]: {
    component: FinalizingCustomPlan,
    nextStep: OnboardingStep.FINAL_CUSTOM_PLAN,
  },
  [OnboardingStep.FINAL_CUSTOM_PLAN]: {
    component: FinalCustomPlan,
    nextStep: null,
  },
  // Other
  [OnboardingStep.NOTIFICATIONS]: {
    component: Notifications,
    nextStep: OnboardingStep.RATING,
  },
  [OnboardingStep.RATING]: {
    component: Rating,
    nextStep: null,
  },
}

const Onboarding: FC = () => {
  const [step, setStep] = useState<OnboardingStep>(OnboardingStep.GET_TO_KNOW_YOU)
  const [progress, setProgress] = useState(0)

  const router = useRouter()
  const posthog = usePostHog()

  useEffect(() => {
    posthog.capture(POSTHOG_EVENTS["onboarding started"])
  }, [posthog])

  // Calculate non-linear progress
  useEffect(() => {
    const totalSteps = Object.keys(onboardingFlow).length
    const currentStepIndex = Object.keys(onboardingFlow).indexOf(step)

    // Use a cubic easing function to make progress faster at the beginning
    // and slower at the end
    const rawProgress = currentStepIndex / (totalSteps - 1)
    const easedProgress = Math.pow(rawProgress, 0.7) // 0.7 makes it accelerate at the start

    setProgress(easedProgress * 100)
  }, [step])

  const form = useForm<TProfileOnboardSchema>({
    defaultValues: { reasonsForChange: [], drinkingTriggers: [] },
    mode: "all",
    resolver: zodResolver(ZProfileOnboardSchema),
  })

  const handleBack = async () => {
    if (step === OnboardingStep.GET_TO_KNOW_YOU) {
      posthog.capture(POSTHOG_EVENTS["onboarding abandoned"], {
        step,
      })
      await queryClient.invalidateQueries()
      await authClient.signOut()
      router.replace("/signin")
    } else {
      const currentStepIndex = Object.keys(onboardingFlow).indexOf(step)
      const previousStep = Object.keys(onboardingFlow)[currentStepIndex - 1] as OnboardingStep
      setStep(previousStep)
    }
  }

  const currentStepConfig = onboardingFlow[step]
  const StepComponent = currentStepConfig.component

  return (
    <FormProvider {...form}>
      <StepComponent
        onBack={handleBack}
        progress={progress}
        onContinue={() => {
          if (currentStepConfig.nextStep !== null) {
            setStep(currentStepConfig.nextStep)
          } else {
            throw new Error("No next step")
          }
        }}
      />
    </FormProvider>
  )
}

export default Onboarding
