import type { FC } from "react"
import { View } from "react-native"

import type { StepProps } from "~/components/common/step"
import * as Step from "~/components/common/step"
import * as Button from "~/ui/button"
import * as Table from "~/ui/table"
import { Text } from "~/ui/text"

type Effect = {
  title: string
  description: string
}

const EFFECTS: Effect[] = [
  {
    title: "🗣️ Speaking Fluency",
    description: "Daily practice helps you find words faster and speak more smoothly without long pauses or hesitation",
  },
  {
    title: "📚 Active Vocabulary",
    description: "Learning new words every day means you'll know 200+ more words that you can actually use in conversations",
  },
  {
    title: "💪 Speaking Confidence",
    description: "Regular practice makes you 60% less nervous about speaking, so you feel comfortable starting conversations",
  },
  {
    title: "👂 Listening Skills",
    description: "Daily listening practice trains your ear to understand speech better and catch what people are really saying",
  },
  {
    title: "🧠 Thinking in the Language",
    description: "With daily practice, you'll start thinking directly in your new language instead of translating everything in your head",
  },
]

const FourteenDays: FC<StepProps> = ({ onContinue, onBack, progress }) => {
  const handleContinue = () => {
    onContinue()
  }

  return (
    <Step.Container>
      <Step.Progress onBack={onBack} progress={progress} />

      <Step.Header>
        <Step.HeaderTitle>What 14 days of training can do</Step.HeaderTitle>
        <Step.HeaderDescription>Discover how 14 days of daily training transforms your speaking confidence and fluency</Step.HeaderDescription>
      </Step.Header>

      <Step.Body>
        <View className="flex flex-col gap-4">
          {EFFECTS.map((effect) => (
            <Table.Root key={effect.title} className="w-full">
              <Table.Header>
                <Table.RowHeader className="py-2">
                  <Table.Head className="flex-1">
                    <Text>{effect.title}</Text>
                  </Table.Head>
                </Table.RowHeader>
              </Table.Header>
              <Table.Body>
                <Table.RowBody isLast>
                  <Table.Cell>
                    <Text className="text-sm text-neutral-600">{effect.description}</Text>
                  </Table.Cell>
                </Table.RowBody>
              </Table.Body>
            </Table.Root>
          ))}
        </View>
      </Step.Body>

      <Step.Bottom>
        <Button.Root onPress={handleContinue} size="lg" variant="primary" className="w-full">
          <Button.Text>Continue</Button.Text>
        </Button.Root>
      </Step.Bottom>
    </Step.Container>
  )
}

export default FourteenDays
