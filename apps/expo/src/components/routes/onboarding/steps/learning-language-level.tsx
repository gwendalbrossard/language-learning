import type { FC } from "react"
import * as RadioGroupPrimitive from "@rn-primitives/radio-group"
import { useFormContext } from "react-hook-form"

import type { TProfileOnboardSchema } from "@acme/validators"
import { LearningLanguageLevel as LearningLanguageLevelEnum } from "@acme/shared/db"

import type { StepProps } from "~/components/common/step"
import RadioItemWithEmoji from "~/components/common/radio-item-with-emoji"
import * as Step from "~/components/common/step"
import * as Button from "~/ui/button"

type LevelOption = {
  level: LearningLanguageLevelEnum
  emoji: string
  label: string
  description?: string
}

const levelOptions: LevelOption[] = [
  {
    level: LearningLanguageLevelEnum.BEGINNER,
    emoji: "🌱",
    label: "Beginner",
    description: "Just starting out with basic vocabulary and simple everyday phrases",
  },
  {
    level: LearningLanguageLevelEnum.INTERMEDIATE,
    emoji: "📚",
    label: "Intermediate",
    description: "Can handle basic conversations but still learning grammar and vocabulary",
  },
  {
    level: LearningLanguageLevelEnum.ADVANCED,
    emoji: "🎯",
    label: "Advanced",
    description: "Can discuss familiar topics but struggle with complex or abstract ideas",
  },
  {
    level: LearningLanguageLevelEnum.PROFICIENT,
    emoji: "🏆",
    label: "Proficient",
    description: "Can communicate effectively in most situations with good accuracy",
  },
  {
    level: LearningLanguageLevelEnum.FLUENT,
    emoji: "⭐",
    label: "Fluent",
    description: "Can express ideas clearly and naturally with minimal hesitation",
  },
]

const LearningLanguageLevel: FC<StepProps> = ({ onContinue, onBack, progress }) => {
  const { setValue, watch } = useFormContext<TProfileOnboardSchema>()
  const learningLanguageLevel = watch("learningLanguageLevel")

  const handleSelect = (value: string) => {
    setValue("learningLanguageLevel", value as LearningLanguageLevelEnum)
  }

  return (
    <Step.Container>
      <Step.Progress onBack={onBack} progress={progress} />

      <Step.Header>
        <Step.HeaderTitle>What's your current level?</Step.HeaderTitle>
        <Step.HeaderDescription>Help us customize lessons to match your proficiency level.</Step.HeaderDescription>
      </Step.Header>

      <Step.Body>
        <RadioGroupPrimitive.Root value={learningLanguageLevel} onValueChange={handleSelect} className="flex w-full flex-col gap-2.5">
          {levelOptions.map((option) => (
            <RadioItemWithEmoji
              key={option.level}
              emoji={option.emoji}
              label={option.label}
              description={option.description}
              value={option.level}
              checked={learningLanguageLevel === option.level}
              onCheckedChange={handleSelect}
            />
          ))}
        </RadioGroupPrimitive.Root>
      </Step.Body>

      <Step.Bottom>
        <Button.Root onPress={onContinue} size="lg" variant="primary" className="w-full" disabled={!learningLanguageLevel}>
          <Button.Text>Continue</Button.Text>
        </Button.Root>
      </Step.Bottom>
    </Step.Container>
  )
}

export default LearningLanguageLevel
