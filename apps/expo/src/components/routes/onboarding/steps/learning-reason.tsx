import type { FC } from "react"
import * as RadioGroupPrimitive from "@rn-primitives/radio-group"
import { useFormContext } from "react-hook-form"

import type { TProfileOnboardSchema } from "@acme/validators"
import { LearningReason } from "@acme/validators"

import type { StepProps } from "~/components/common/step"
import RadioItemWithEmoji from "~/components/common/radio-item-with-emoji"
import * as Step from "~/components/common/step"
import * as Button from "~/ui/button"

type ReasonOption = {
  reason: LearningReason
  emoji: string
  label: string
}

const reasonOptions: ReasonOption[] = [
  { reason: LearningReason.CAREER_GROWTH, emoji: "📈", label: "Career growth or new job" },
  { reason: LearningReason.TRAVEL, emoji: "✈️", label: "Travel and exploring the world" },
  { reason: LearningReason.STUDY_EXAMS, emoji: "📚", label: "Study or exams" },
  { reason: LearningReason.MOVING_ABROAD, emoji: "🏠", label: "Moving or living abroad" },
  { reason: LearningReason.RELATIONSHIPS, emoji: "❤️", label: "Friends, family, or relationships" },
  { reason: LearningReason.CULTURE_MEDIA, emoji: "🎭", label: "Culture, movies, and music" },
  { reason: LearningReason.PERSONAL_CHALLENGE, emoji: "💪", label: "Personal challenge and self‑improvement" },
]

const LearningReasonStep: FC<StepProps> = ({ onContinue, onBack, progress }) => {
  const { setValue, watch } = useFormContext<TProfileOnboardSchema>()
  const learningReason = watch("learningReason")

  const handleSelect = (value: string) => {
    setValue("learningReason", value as LearningReason)
  }

  return (
    <Step.Container>
      <Step.Progress onBack={onBack} progress={progress} />

      <Step.Header>
        <Step.HeaderTitle>What's the main reason you're learning this language right now?</Step.HeaderTitle>
        <Step.HeaderDescription>This helps us tailor your experience to your goals.</Step.HeaderDescription>
      </Step.Header>

      <Step.Body>
        <RadioGroupPrimitive.Root value={learningReason} onValueChange={handleSelect} className="flex w-full flex-col gap-2.5">
          {reasonOptions.map((option) => (
            <RadioItemWithEmoji
              key={option.reason}
              emoji={option.emoji}
              label={option.label}
              value={option.reason}
              checked={learningReason === option.reason}
              onCheckedChange={handleSelect}
            />
          ))}
        </RadioGroupPrimitive.Root>
      </Step.Body>

      <Step.Bottom>
        <Button.Root onPress={onContinue} size="lg" variant="primary" className="w-full" disabled={!learningReason}>
          <Button.Text>Continue</Button.Text>
        </Button.Root>
      </Step.Bottom>
    </Step.Container>
  )
}

export default LearningReasonStep