import type { FC } from "react"
import { MoveRightIcon } from "lucide-react-native"
import { useFormContext } from "react-hook-form"
import { View } from "react-native"

import type { TProfileOnboardSchema } from "@acme/validators"
import { ReasonForChange } from "@acme/validators"

import type { StepProps } from "~/components/common/step"
import * as Step from "~/components/common/step"
import * as Button from "~/ui/button"
import CheckboxWithEmoji from "../../../common/checkbox-with-emoji"

export type Option = {
  reason: ReasonForChange
  emoji: string
  label: string
}

export const options: Record<ReasonForChange, Option> = {
  [ReasonForChange.PROTECT_HEALTH]: {
    reason: ReasonForChange.PROTECT_HEALTH,
    emoji: "🛡️",
    label: "Protect my long-term health",
  },

  [ReasonForChange.SAVE_MONEY]: {
    reason: ReasonForChange.SAVE_MONEY,
    emoji: "💰",
    label: "Save money",
  },
  [ReasonForChange.LOSE_WEIGHT]: {
    reason: ReasonForChange.LOSE_WEIGHT,
    emoji: "⚖️",
    label: "Lose weight and feel healthier",
  },
  [ReasonForChange.SLEEP_BETTER]: {
    reason: ReasonForChange.SLEEP_BETTER,
    emoji: "😴",
    label: "Sleep better and feel more rested",
  },
  [ReasonForChange.MENTAL_CLARITY]: {
    reason: ReasonForChange.MENTAL_CLARITY,
    emoji: "🧠",
    label: "Boost mental clarity and focus",
  },
  [ReasonForChange.REDUCE_ANXIETY]: {
    reason: ReasonForChange.REDUCE_ANXIETY,
    emoji: "😌",
    label: "Reduce anxiety or depression",
  },
  [ReasonForChange.IMPROVE_RELATIONSHIPS]: {
    reason: ReasonForChange.IMPROVE_RELATIONSHIPS,
    emoji: "❤️",
    label: "Improve relationships with loved ones",
  },
  [ReasonForChange.REGAIN_CONTROL]: {
    reason: ReasonForChange.REGAIN_CONTROL,
    emoji: "🎯",
    label: "Regain a sense of control over my life",
  },
  [ReasonForChange.MORE_ENERGY]: {
    reason: ReasonForChange.MORE_ENERGY,
    emoji: "⚡",
    label: "Feel more energetic and motivated",
  },

  [ReasonForChange.BETTER_ROLE_MODEL]: {
    reason: ReasonForChange.BETTER_ROLE_MODEL,
    emoji: "👨‍👩‍👧‍👦",
    label: "Be a better role model for my kids / family",
  },
}

const ReasonsForChange: FC<StepProps> = ({ onContinue, onBack, progress }) => {
  const { setValue, watch } = useFormContext<TProfileOnboardSchema>()
  const reasons = watch("reasonsForChange")

  const handleSelect = (reason: ReasonForChange) => {
    const newReasons = reasons.includes(reason) ? reasons.filter((r) => r !== reason) : [...reasons, reason]
    setValue("reasonsForChange", newReasons)
  }

  return (
    <Step.Container>
      <Step.Progress onBack={onBack} progress={progress} />

      <Step.Header>
        <Step.HeaderTitle>Your reasons for change</Step.HeaderTitle>
        <Step.HeaderDescription>Choosing your reasons helps you stay motivated. These are the benefits you'll work toward.</Step.HeaderDescription>
      </Step.Header>

      <Step.Body>
        <View className="flex w-full flex-col gap-2.5">
          {Object.values(options).map((option) => (
            <CheckboxWithEmoji
              key={option.reason}
              emoji={option.emoji}
              label={option.label}
              checked={reasons.includes(option.reason)}
              onCheckedChange={() => handleSelect(option.reason)}
            />
          ))}
        </View>
      </Step.Body>

      <Step.Bottom>
        <Button.Root onPress={onContinue} size="lg" variant="primary" className="w-full" disabled={reasons.length === 0}>
          <Button.Text>Continue</Button.Text>
        </Button.Root>
      </Step.Bottom>
    </Step.Container>
  )
}

export default ReasonsForChange
