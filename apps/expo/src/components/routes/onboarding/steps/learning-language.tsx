import type { FC } from "react"
import * as RadioGroupPrimitive from "@rn-primitives/radio-group"
import { useFormContext } from "react-hook-form"

import type { TProfileOnboardSchema } from "@acme/validators"

import type { StepProps } from "~/components/common/step"
import { languageOptions } from "~/components/common/language"
import RadioItemWithEmoji from "~/components/common/radio-item-with-emoji"
import * as Step from "~/components/common/step"
import * as Button from "~/ui/button"

const LearningLanguage: FC<StepProps> = ({ onContinue, onBack, progress }) => {
  const { setValue, watch } = useFormContext<TProfileOnboardSchema>()
  const learningLanguage = watch("learningLanguage")

  const handleSelect = (value: string) => {
    setValue("learningLanguage", value)
  }

  return (
    <Step.Container>
      <Step.Progress onBack={onBack} progress={progress} />

      <Step.Header>
        <Step.HeaderTitle>Which language do you want to learn?</Step.HeaderTitle>
        <Step.HeaderDescription>Choose the language you'd like to focus on.</Step.HeaderDescription>
      </Step.Header>

      <Step.Body>
        <RadioGroupPrimitive.Root value={learningLanguage} onValueChange={handleSelect} className="flex w-full flex-col gap-2.5">
          {languageOptions.map((option) => (
            <RadioItemWithEmoji
              key={option.code}
              emoji={option.emoji}
              label={option.label}
              value={option.code}
              checked={learningLanguage === option.code}
              onCheckedChange={handleSelect}
            />
          ))}
        </RadioGroupPrimitive.Root>
      </Step.Body>

      <Step.Bottom>
        <Button.Root onPress={onContinue} size="lg" variant="primary" className="w-full" disabled={!learningLanguage}>
          <Button.Text>Continue</Button.Text>
        </Button.Root>
      </Step.Bottom>
    </Step.Container>
  )
}

export default LearningLanguage
