import type { FC } from "react"
import * as RadioGroupPrimitive from "@rn-primitives/radio-group"
import { useFormContext } from "react-hook-form"

import type { TProfileOnboardSchema } from "@acme/validators"
import { DailyCommitment } from "@acme/validators"

import type { StepProps } from "~/components/common/step"
import RadioItemWithEmoji from "~/components/common/radio-item-with-emoji"
import * as Step from "~/components/common/step"
import * as Button from "~/ui/button"

type CommitmentOption = {
  commitment: DailyCommitment
  emoji: string
  label: string
}

const commitmentOptions: CommitmentOption[] = [
  { commitment: DailyCommitment.FIVE_MIN, emoji: "⚡", label: "5 min" },
  { commitment: DailyCommitment.TEN_MIN, emoji: "⏰", label: "10 min" },
  { commitment: DailyCommitment.FIFTEEN_MIN, emoji: "📖", label: "15 min" },
  { commitment: DailyCommitment.TWENTY_MIN, emoji: "💪", label: "20 min" },
  { commitment: DailyCommitment.THIRTY_MIN, emoji: "🏆", label: "30 min" },
]

const DailyCommitmentStep: FC<StepProps> = ({ onContinue, onBack, progress }) => {
  const { setValue, watch } = useFormContext<TProfileOnboardSchema>()
  const dailyCommitment = watch("dailyCommitment")

  const handleSelect = (value: string) => {
    setValue("dailyCommitment", value as DailyCommitment)
  }

  return (
    <Step.Container>
      <Step.Progress onBack={onBack} progress={progress} />

      <Step.Header>
        <Step.HeaderTitle>How much time will you commit daily?</Step.HeaderTitle>
        <Step.HeaderDescription>Choose a realistic amount that you can stick to consistently.</Step.HeaderDescription>
      </Step.Header>

      <Step.Body>
        <RadioGroupPrimitive.Root value={dailyCommitment} onValueChange={handleSelect} className="flex w-full flex-col gap-2.5">
          {commitmentOptions.map((option) => (
            <RadioItemWithEmoji
              key={option.commitment}
              emoji={option.emoji}
              label={option.label}
              value={option.commitment}
              checked={dailyCommitment === option.commitment}
              onCheckedChange={handleSelect}
            />
          ))}
        </RadioGroupPrimitive.Root>
      </Step.Body>

      <Step.Bottom>
        <Button.Root onPress={onContinue} size="lg" variant="primary" className="w-full" disabled={!dailyCommitment}>
          <Button.Text>Continue</Button.Text>
        </Button.Root>
      </Step.Bottom>
    </Step.Container>
  )
}

export default DailyCommitmentStep