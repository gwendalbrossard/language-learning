import type { FC } from "react"
import * as RadioGroupPrimitive from "@rn-primitives/radio-group"
import { useFormContext } from "react-hook-form"

import type { TProfileOnboardSchema } from "@acme/validators"
import { CurrentPractice } from "@acme/validators"

import type { StepProps } from "~/components/common/step"
import RadioItemWithEmoji from "~/components/common/radio-item-with-emoji"
import * as Step from "~/components/common/step"
import * as Button from "~/ui/button"

type PracticeOption = {
  practice: CurrentPractice
  emoji: string
  label: string
}

const practiceOptions: PracticeOption[] = [
  { practice: CurrentPractice.NOT_STARTED, emoji: "🌱", label: "I haven't started yet" },
  { practice: CurrentPractice.APPS_FLASHCARDS, emoji: "📱", label: "Apps or flashcards" },
  { practice: CurrentPractice.CLASSES_TUTOR, emoji: "👨‍🏫", label: "Classes or a tutor" },
  { practice: CurrentPractice.PODCASTS_VIDEOS, emoji: "🎧", label: "Podcasts or videos" },
  { practice: CurrentPractice.SPEAKING_FRIENDS, emoji: "💬", label: "Speaking with friends or coworkers" },
  { practice: CurrentPractice.MIXED_APPROACH, emoji: "🔄", label: "Mixed approach" },
]

const CurrentPracticeStep: FC<StepProps> = ({ onContinue, onBack, progress }) => {
  const { setValue, watch } = useFormContext<TProfileOnboardSchema>()
  const currentPractice = watch("currentPractice")

  const handleSelect = (value: string) => {
    setValue("currentPractice", value as CurrentPractice)
  }

  return (
    <Step.Container>
      <Step.Progress onBack={onBack} progress={progress} />

      <Step.Header>
        <Step.HeaderTitle>How are you practicing today?</Step.HeaderTitle>
        <Step.HeaderDescription>Tell us about your current learning approach.</Step.HeaderDescription>
      </Step.Header>

      <Step.Body>
        <RadioGroupPrimitive.Root value={currentPractice} onValueChange={handleSelect} className="flex w-full flex-col gap-2.5">
          {practiceOptions.map((option) => (
            <RadioItemWithEmoji
              key={option.practice}
              emoji={option.emoji}
              label={option.label}
              value={option.practice}
              checked={currentPractice === option.practice}
              onCheckedChange={handleSelect}
            />
          ))}
        </RadioGroupPrimitive.Root>
      </Step.Body>

      <Step.Bottom>
        <Button.Root onPress={onContinue} size="lg" variant="primary" className="w-full" disabled={!currentPractice}>
          <Button.Text>Continue</Button.Text>
        </Button.Root>
      </Step.Bottom>
    </Step.Container>
  )
}

export default CurrentPracticeStep