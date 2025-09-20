import type { FC } from "react"
import * as RadioGroupPrimitive from "@rn-primitives/radio-group"
import { useFormContext } from "react-hook-form"

import type { TProfileOnboardSchema } from "@acme/validators"
import { ProgressGoal } from "@acme/validators"

import type { StepProps } from "~/components/common/step"
import RadioItemWithEmoji from "~/components/common/radio-item-with-emoji"
import * as Step from "~/components/common/step"
import * as Button from "~/ui/button"

type GoalOption = {
  goal: ProgressGoal
  emoji: string
  label: string
}

const goalOptions: GoalOption[] = [
  { goal: ProgressGoal.TWO_WEEKS, emoji: "🚀", label: "Within 2 weeks" },
  { goal: ProgressGoal.ONE_MONTH, emoji: "📅", label: "1 month" },
  { goal: ProgressGoal.THREE_MONTHS, emoji: "🎯", label: "3 months" },
  { goal: ProgressGoal.OWN_PACE, emoji: "🌱", label: "I'm exploring at my own pace" },
]

const ProgressGoalStep: FC<StepProps> = ({ onContinue, onBack, progress }) => {
  const { setValue, watch } = useFormContext<TProfileOnboardSchema>()
  const progressGoal = watch("progressGoal")

  const handleSelect = (value: string) => {
    setValue("progressGoal", value as ProgressGoal)
  }

  return (
    <Step.Container>
      <Step.Progress onBack={onBack} progress={progress} />

      <Step.Header>
        <Step.HeaderTitle>How soon do you want noticeable progress?</Step.HeaderTitle>
        <Step.HeaderDescription>This helps us set the right intensity for your lessons.</Step.HeaderDescription>
      </Step.Header>

      <Step.Body>
        <RadioGroupPrimitive.Root value={progressGoal} onValueChange={handleSelect} className="flex w-full flex-col gap-2.5">
          {goalOptions.map((option) => (
            <RadioItemWithEmoji
              key={option.goal}
              emoji={option.emoji}
              label={option.label}
              value={option.goal}
              checked={progressGoal === option.goal}
              onCheckedChange={handleSelect}
            />
          ))}
        </RadioGroupPrimitive.Root>
      </Step.Body>

      <Step.Bottom>
        <Button.Root onPress={onContinue} size="lg" variant="primary" className="w-full" disabled={!progressGoal}>
          <Button.Text>Continue</Button.Text>
        </Button.Root>
      </Step.Bottom>
    </Step.Container>
  )
}

export default ProgressGoalStep