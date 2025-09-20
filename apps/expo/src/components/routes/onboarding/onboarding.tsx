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
import BuildMomentum from "./steps/build-momentum"
import CurrentPracticeStep from "./steps/current-practice"
import DailyCommitmentStep from "./steps/daily-commitment"
import DayOne from "./steps/day-one"
import FourteenDays from "./steps/fourteen-days"
import LearningLanguage from "./steps/learning-language"
import LearningLanguageLevel from "./steps/learning-language-level"
import LearningReasonStep from "./steps/learning-reason"
import LockRoutine from "./steps/lock-routine"
import PersonalizingPlan from "./steps/personalizing-plan"
import Notifications from "./steps/notifications"
import ProgressGoalStep from "./steps/progress-goal"
import Rating from "./steps/rating"
import ReadyToStart from "./steps/ready-to-start"
import SpeakingComfortStep from "./steps/speaking-comfort"
import SpeakingStrugglesStep from "./steps/speaking-struggles"

export enum OnboardingStep {
  DAY_ONE = "DAY_ONE",
  LEARNING_LANGUAGE = "LEARNING_LANGUAGE",
  LEARNING_LANGUAGE_LEVEL = "LEARNING_LANGUAGE_LEVEL",
  LEARNING_REASON = "LEARNING_REASON",
  BUILD_MOMENTUM = "BUILD_MOMENTUM",
  CURRENT_PRACTICE = "CURRENT_PRACTICE",
  SPEAKING_STRUGGLES = "SPEAKING_STRUGGLES",
  SPEAKING_COMFORT = "SPEAKING_COMFORT",
  LOCK_ROUTINE = "LOCK_ROUTINE",
  DAILY_COMMITMENT = "DAILY_COMMITMENT",
  NOTIFICATIONS = "NOTIFICATIONS",
  PROGRESS_GOAL = "PROGRESS_GOAL",
  FOURTEEN_DAYS = "FOURTEEN_DAYS",
  RATING = "RATING",
  PERSONALIZING_PLAN = "PERSONALIZING_PLAN",
  READY_TO_START = "READY_TO_START",
}

type StepConfig = {
  component: FC<StepProps>
  nextStep: OnboardingStep | null
}

const onboardingFlow: Record<OnboardingStep, StepConfig> = {
  [OnboardingStep.DAY_ONE]: {
    component: DayOne,
    nextStep: OnboardingStep.LEARNING_LANGUAGE,
  },
  [OnboardingStep.LEARNING_LANGUAGE]: {
    component: LearningLanguage,
    nextStep: OnboardingStep.LEARNING_LANGUAGE_LEVEL,
  },
  [OnboardingStep.LEARNING_LANGUAGE_LEVEL]: {
    component: LearningLanguageLevel,
    nextStep: OnboardingStep.LEARNING_REASON,
  },
  [OnboardingStep.LEARNING_REASON]: {
    component: LearningReasonStep,
    nextStep: OnboardingStep.BUILD_MOMENTUM,
  },
  [OnboardingStep.BUILD_MOMENTUM]: {
    component: BuildMomentum,
    nextStep: OnboardingStep.CURRENT_PRACTICE,
  },
  [OnboardingStep.CURRENT_PRACTICE]: {
    component: CurrentPracticeStep,
    nextStep: OnboardingStep.SPEAKING_STRUGGLES,
  },
  [OnboardingStep.SPEAKING_STRUGGLES]: {
    component: SpeakingStrugglesStep,
    nextStep: OnboardingStep.SPEAKING_COMFORT,
  },
  [OnboardingStep.SPEAKING_COMFORT]: {
    component: SpeakingComfortStep,
    nextStep: OnboardingStep.LOCK_ROUTINE,
  },
  [OnboardingStep.LOCK_ROUTINE]: {
    component: LockRoutine,
    nextStep: OnboardingStep.DAILY_COMMITMENT,
  },
  [OnboardingStep.DAILY_COMMITMENT]: {
    component: DailyCommitmentStep,
    nextStep: OnboardingStep.NOTIFICATIONS,
  },
  [OnboardingStep.NOTIFICATIONS]: {
    component: Notifications,
    nextStep: OnboardingStep.PROGRESS_GOAL,
  },
  [OnboardingStep.PROGRESS_GOAL]: {
    component: ProgressGoalStep,
    nextStep: OnboardingStep.FOURTEEN_DAYS,
  },
  [OnboardingStep.FOURTEEN_DAYS]: {
    component: FourteenDays,
    nextStep: OnboardingStep.RATING,
  },
  [OnboardingStep.RATING]: {
    component: Rating,
    nextStep: OnboardingStep.PERSONALIZING_PLAN,
  },
  [OnboardingStep.PERSONALIZING_PLAN]: {
    component: PersonalizingPlan,
    nextStep: OnboardingStep.READY_TO_START,
  },
  [OnboardingStep.READY_TO_START]: {
    component: ReadyToStart,
    nextStep: null,
  },
}

const Onboarding: FC = () => {
  const [step, setStep] = useState<OnboardingStep>(OnboardingStep.DAY_ONE)
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
    defaultValues: { speakingStruggles: [] },
    mode: "all",
    resolver: zodResolver(ZProfileOnboardSchema),
  })

  const handleBack = async () => {
    if (step === OnboardingStep.DAY_ONE) {
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
