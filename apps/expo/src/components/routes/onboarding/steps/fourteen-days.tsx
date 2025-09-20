import type { FC } from "react"
import { View, Text } from "react-native"

import type { StepProps } from "~/components/common/step"
import * as Step from "~/components/common/step"
import * as Button from "~/ui/button"

const FourteenDays: FC<StepProps> = ({ onContinue, onBack, progress }) => {
  const handleContinue = () => {
    onContinue()
  }

  return (
    <Step.Container>
      <Step.Progress onBack={onBack} progress={progress} />

      <Step.Header className="flex-1 gap-4">
        <Step.HeaderIllustration>
          <Text className="text-center text-lg text-muted-foreground">
            [Progress chart showing 14-day improvements]
          </Text>
        </Step.HeaderIllustration>

        <View>
          <Step.HeaderTitle className="text-2xl">See what 14 days can do</Step.HeaderTitle>
        </View>
        <View className="gap-3">
          <Text className="text-base text-foreground">• Hold short, natural introductions without freezing</Text>
          <Text className="text-base text-foreground">• Finish 10+ guided conversations you can reuse in real life</Text>
          <Text className="text-base text-foreground">• Add 100 practical words you'll actually say out loud</Text>
          <Text className="text-base text-foreground">• Feel fewer pauses and faster responses in daily chats</Text>
        </View>
      </Step.Header>

      <Step.Bottom>
        <Button.Root onPress={handleContinue} size="lg" variant="primary" className="w-full">
          <Button.Text>Continue</Button.Text>
        </Button.Root>
      </Step.Bottom>
    </Step.Container>
  )
}

export default FourteenDays