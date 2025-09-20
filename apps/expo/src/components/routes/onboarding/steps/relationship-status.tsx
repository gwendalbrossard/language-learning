import type { FC } from "react"
import * as RadioGroupPrimitive from "@rn-primitives/radio-group"
import { useFormContext } from "react-hook-form"

import type { TProfileOnboardSchema } from "@acme/validators"
import { Relationship } from "@acme/validators"

import type { StepProps } from "~/components/common/step"
import RadioItemWithEmoji from "~/components/common/radio-item-with-emoji"
import * as Step from "~/components/common/step"
import * as Button from "~/ui/button"

type Option = {
  status: Relationship
  emoji: string
  label: string
}

const options: Record<Relationship, Option> = {
  [Relationship.IN_RELATIONSHIP]: {
    status: Relationship.IN_RELATIONSHIP,
    emoji: "💑",
    label: "In a relationship",
  },
  [Relationship.MARRIED]: {
    status: Relationship.MARRIED,
    emoji: "💍",
    label: "Married",
  },
  [Relationship.SINGLE]: {
    status: Relationship.SINGLE,
    emoji: "👤",
    label: "Single",
  },
  [Relationship.DIVORCED_OR_SEPARATED]: {
    status: Relationship.DIVORCED_OR_SEPARATED,
    emoji: "💔",
    label: "Divorced or separated",
  },
}

const RelationshipStatus: FC<StepProps> = ({ onContinue, onBack, progress }) => {
  const { setValue, watch } = useFormContext<TProfileOnboardSchema>()
  const relationshipStatus = watch("relationshipStatus")

  const handleSelect = (value: string) => {
    setValue("relationshipStatus", value as Relationship)
  }

  return (
    <Step.Container>
      <Step.Progress onBack={onBack} progress={progress} />

      <Step.Header>
        <Step.HeaderTitle>What's your current relationship status?</Step.HeaderTitle>
        <Step.HeaderDescription>Understanding your relationship context helps us recommend the right support tools.</Step.HeaderDescription>
      </Step.Header>

      <Step.Body>
        <RadioGroupPrimitive.Root value={relationshipStatus} onValueChange={handleSelect} className="flex w-full flex-col gap-2.5">
          {Object.values(options).map((option) => (
            <RadioItemWithEmoji
              key={option.status}
              emoji={option.emoji}
              label={option.label}
              value={option.status}
              checked={relationshipStatus === option.status}
              onCheckedChange={handleSelect}
            />
          ))}
        </RadioGroupPrimitive.Root>
      </Step.Body>

      <Step.Bottom>
        <Button.Root onPress={onContinue} size="lg" variant="primary" className="w-full" disabled={!relationshipStatus}>
          <Button.Text>Continue</Button.Text>
        </Button.Root>
      </Step.Bottom>
    </Step.Container>
  )
}

export default RelationshipStatus
