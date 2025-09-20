import type { FC } from "react"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { View } from "react-native"

import type { TProfileOnboardSchema } from "@acme/validators"
import { DrinkingTrigger } from "@acme/validators"

import type { StepProps } from "~/components/common/step"
import CheckboxWithEmoji from "~/components/common/checkbox-with-emoji"
import * as Step from "~/components/common/step"
import * as Button from "~/ui/button"

export type Option = {
  trigger: DrinkingTrigger
  emoji: string
  label: string
}

export const options: Record<DrinkingTrigger, Option> = {
  [DrinkingTrigger.STRESS]: {
    trigger: DrinkingTrigger.STRESS,
    emoji: "😰",
    label: "Stress",
  },
  [DrinkingTrigger.SOCIAL_PRESSURE]: {
    trigger: DrinkingTrigger.SOCIAL_PRESSURE,
    emoji: "👥",
    label: "Social Pressure",
  },
  [DrinkingTrigger.TROUBLE_SLEEPING]: {
    trigger: DrinkingTrigger.TROUBLE_SLEEPING,
    emoji: "😴",
    label: "Trouble Sleeping",
  },
  [DrinkingTrigger.BOREDOM]: {
    trigger: DrinkingTrigger.BOREDOM,
    emoji: "😫",
    label: "Boredom",
  },
  [DrinkingTrigger.HABIT]: {
    trigger: DrinkingTrigger.HABIT,
    emoji: "🔄",
    label: "Habit",
  },
  [DrinkingTrigger.CELEBRATION]: {
    trigger: DrinkingTrigger.CELEBRATION,
    emoji: "🎉",
    label: "Celebration",
  },
  [DrinkingTrigger.SADNESS]: {
    trigger: DrinkingTrigger.SADNESS,
    emoji: "😔",
    label: "Sadness",
  },
  [DrinkingTrigger.ANGER]: {
    trigger: DrinkingTrigger.ANGER,
    emoji: "😡",
    label: "Anger",
  },
  [DrinkingTrigger.RELAXATION]: {
    trigger: DrinkingTrigger.RELAXATION,
    emoji: "😌",
    label: "Relaxation",
  },
}

const DrinkingTriggers: FC<StepProps> = ({ onContinue, onBack, progress }) => {
  const form = useFormContext<TProfileOnboardSchema>()
  const [selectedTriggers, setSelectedTriggers] = useState<DrinkingTrigger[]>([])

  const handleOptionPress = (trigger: DrinkingTrigger) => {
    if (selectedTriggers.includes(trigger)) {
      setSelectedTriggers((prev) => prev.filter((t) => t !== trigger))
    } else {
      setSelectedTriggers((prev) => [...prev, trigger])
    }
  }

  const handleSubmit = () => {
    form.setValue("drinkingTriggers", selectedTriggers)
    onContinue()
  }

  return (
    <Step.Container>
      <Step.Progress onBack={onBack} progress={progress} />
      <Step.Header>
        <Step.HeaderTitle>What triggers you to drink?</Step.HeaderTitle>
        <Step.HeaderDescription>Select the situations or emotions that typically lead you to drink alcohol</Step.HeaderDescription>
      </Step.Header>

      <Step.Body>
        <View className="flex flex-col gap-2.5">
          {Object.values(options).map((option) => (
            <CheckboxWithEmoji
              key={option.trigger}
              emoji={option.emoji}
              label={option.label}
              checked={selectedTriggers.includes(option.trigger)}
              onCheckedChange={() => handleOptionPress(option.trigger)}
            />
          ))}
        </View>
      </Step.Body>

      <Step.Bottom>
        <Button.Root size="lg" variant="primary" onPress={handleSubmit} disabled={selectedTriggers.length === 0}>
          <Button.Text>Continue</Button.Text>
        </Button.Root>
      </Step.Bottom>
    </Step.Container>
  )
}

export default DrinkingTriggers
