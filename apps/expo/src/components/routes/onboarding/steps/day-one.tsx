import type { FC } from "react"
import { View, Text } from "react-native"

import type { StepProps } from "~/components/common/step"
import * as Step from "~/components/common/step"
import * as Button from "~/ui/button"

const DayOne: FC<StepProps> = ({ onContinue, onBack, progress }) => {
  const handleContinue = () => {
    onContinue()
  }

  return (
    <Step.Container>
      <Step.Progress onBack={onBack} progress={progress} />

      <Step.Header className="flex-1 gap-4">
        <Step.HeaderIllustration>
          <Text className="text-center text-lg text-muted-foreground">
            [Motivational illustration showing person starting their language learning journey]
          </Text>
        </Step.HeaderIllustration>

        <View>
          <Step.HeaderTitle className="text-2xl">Make today your Day 1</Step.HeaderTitle>
        </View>
        <View>
          <Step.HeaderDescription className="text-lg">
            Set your language and level in under a minute. Learners who start now speak more this week than those who wait.
          </Step.HeaderDescription>
        </View>
      </Step.Header>

      <Step.Bottom>
        <Button.Root onPress={handleContinue} size="lg" variant="primary" className="w-full">
          <Button.Text>Get Started</Button.Text>
        </Button.Root>
      </Step.Bottom>
    </Step.Container>
  )
}

export default DayOne