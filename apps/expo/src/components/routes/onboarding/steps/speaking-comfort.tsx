import type { FC } from "react"
import * as RadioGroupPrimitive from "@rn-primitives/radio-group"
import { useFormContext } from "react-hook-form"

import type { TProfileOnboardSchema } from "@acme/validators"
import { SpeakingComfort } from "@acme/validators"

import type { StepProps } from "~/components/common/step"
import RadioItemWithEmoji from "~/components/common/radio-item-with-emoji"
import * as Step from "~/components/common/step"
import * as Button from "~/ui/button"

type ComfortOption = {
  comfort: SpeakingComfort
  emoji: string
  label: string
}

const comfortOptions: ComfortOption[] = [
  { comfort: SpeakingComfort.VERY_UNCOMFORTABLE, emoji: "😰", label: "Very uncomfortable" },
  { comfort: SpeakingComfort.SOMEWHAT_UNCOMFORTABLE, emoji: "😬", label: "Somewhat uncomfortable" },
  { comfort: SpeakingComfort.NEUTRAL, emoji: "😐", label: "Neutral" },
  { comfort: SpeakingComfort.SOMEWHAT_COMFORTABLE, emoji: "🙂", label: "Somewhat comfortable" },
  { comfort: SpeakingComfort.VERY_COMFORTABLE, emoji: "😊", label: "Very comfortable" },
]

const SpeakingComfortStep: FC<StepProps> = ({ onContinue, onBack, progress }) => {
  const { setValue, watch } = useFormContext<TProfileOnboardSchema>()
  const speakingComfort = watch("speakingComfort")

  const handleSelect = (value: string) => {
    setValue("speakingComfort", value as SpeakingComfort)
  }

  return (
    <Step.Container>
      <Step.Progress onBack={onBack} progress={progress} />

      <Step.Header>
        <Step.HeaderTitle>How comfortable do you feel speaking aloud right now?</Step.HeaderTitle>
        <Step.HeaderDescription>This helps us adjust the pace and difficulty of your first conversations.</Step.HeaderDescription>
      </Step.Header>

      <Step.Body>
        <RadioGroupPrimitive.Root value={speakingComfort} onValueChange={handleSelect} className="flex w-full flex-col gap-2.5">
          {comfortOptions.map((option) => (
            <RadioItemWithEmoji
              key={option.comfort}
              emoji={option.emoji}
              label={option.label}
              value={option.comfort}
              checked={speakingComfort === option.comfort}
              onCheckedChange={handleSelect}
            />
          ))}
        </RadioGroupPrimitive.Root>
      </Step.Body>

      <Step.Bottom>
        <Button.Root onPress={onContinue} size="lg" variant="primary" className="w-full" disabled={!speakingComfort}>
          <Button.Text>Continue</Button.Text>
        </Button.Root>
      </Step.Bottom>
    </Step.Container>
  )
}

export default SpeakingComfortStep