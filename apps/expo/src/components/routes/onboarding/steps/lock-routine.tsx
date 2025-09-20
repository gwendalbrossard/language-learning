import type { FC } from "react"
import { View, Text } from "react-native"

import type { StepProps } from "~/components/common/step"
import * as Step from "~/components/common/step"
import * as Button from "~/ui/button"

const LockRoutine: FC<StepProps> = ({ onContinue, onBack, progress }) => {
  const handleContinue = () => {
    onContinue()
  }

  return (
    <Step.Container>
      <Step.Progress onBack={onBack} progress={progress} />

      <Step.Header className="flex-1 gap-4">
        <Step.HeaderIllustration>
          <Text className="text-center text-lg text-muted-foreground">
            [Illustration showing daily routine and consistency]
          </Text>
        </Step.HeaderIllustration>

        <View>
          <Step.HeaderTitle className="text-2xl">Lock in a routine that sticks</Step.HeaderTitle>
        </View>
        <View>
          <Step.HeaderDescription className="text-lg">
            Short daily sessions beat long study plans. Choose a rhythm you can keep—your first conversation is minutes away.
          </Step.HeaderDescription>
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

export default LockRoutine