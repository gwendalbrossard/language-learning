import type { FC } from "react"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { View } from "react-native"

import type { TProfileOnboardSchema } from "@acme/validators"
import { SpeakingStruggle } from "@acme/validators"

import type { StepProps } from "~/components/common/step"
import CheckboxWithEmoji from "~/components/common/checkbox-with-emoji"
import * as Step from "~/components/common/step"
import * as Button from "~/ui/button"

type StruggleOption = {
  struggle: SpeakingStruggle
  emoji: string
  label: string
}

const struggleOptions: StruggleOption[] = [
  { struggle: SpeakingStruggle.FINDING_WORDS, emoji: "🤔", label: "Finding the right words quickly" },
  { struggle: SpeakingStruggle.UNDERSTANDING_SPEED, emoji: "⚡", label: "Understanding native speed" },
  { struggle: SpeakingStruggle.BUILDING_SENTENCES, emoji: "🔧", label: "Building sentences without long pauses" },
  { struggle: SpeakingStruggle.PRONUNCIATION, emoji: "🗣️", label: "Pronunciation and accent" },
  { struggle: SpeakingStruggle.REMEMBERING_VOCABULARY, emoji: "💭", label: "Remembering vocabulary during conversation" },
  { struggle: SpeakingStruggle.CONFIDENCE, emoji: "😰", label: "Confidence starting or continuing a chat" },
  { struggle: SpeakingStruggle.GRAMMAR_ACCURACY, emoji: "📝", label: "Grammar accuracy in real time" },
]

const SpeakingStrugglesStep: FC<StepProps> = ({ onContinue, onBack, progress }) => {
  const form = useFormContext<TProfileOnboardSchema>()
  const [selectedStruggles, setSelectedStruggles] = useState<SpeakingStruggle[]>([])

  const handleOptionPress = (struggle: SpeakingStruggle) => {
    if (selectedStruggles.includes(struggle)) {
      setSelectedStruggles((prev) => prev.filter((s) => s !== struggle))
    } else {
      setSelectedStruggles((prev) => [...prev, struggle])
    }
  }

  const handleSubmit = () => {
    form.setValue("speakingStruggles", selectedStruggles)
    onContinue()
  }

  return (
    <Step.Container>
      <Step.Progress onBack={onBack} progress={progress} />
      <Step.Header>
        <Step.HeaderTitle>What do you currently struggle with most when speaking?</Step.HeaderTitle>
        <Step.HeaderDescription>Select all that apply to help us focus on your specific challenges.</Step.HeaderDescription>
      </Step.Header>

      <Step.Body>
        <View className="flex flex-col gap-2.5">
          {struggleOptions.map((option) => (
            <CheckboxWithEmoji
              key={option.struggle}
              emoji={option.emoji}
              label={option.label}
              checked={selectedStruggles.includes(option.struggle)}
              onCheckedChange={() => handleOptionPress(option.struggle)}
            />
          ))}
        </View>
      </Step.Body>

      <Step.Bottom>
        <Button.Root size="lg" variant="primary" onPress={handleSubmit} disabled={selectedStruggles.length === 0}>
          <Button.Text>Continue</Button.Text>
        </Button.Root>
      </Step.Bottom>
    </Step.Container>
  )
}

export default SpeakingStrugglesStep