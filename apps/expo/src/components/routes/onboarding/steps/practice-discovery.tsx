import type { FC } from "react"
import type { ImageSourcePropType } from "react-native"
import { Image, View } from "react-native"

import type { StepProps } from "~/components/common/step"
import * as Step from "~/components/common/step"
import * as Button from "~/ui/button"
// @ts-expect-error - It's valid
import PracticeDiscoveryImage from "./images/practice-discovery.png"

const PracticeDiscovery: FC<StepProps> = ({ onContinue, onBack, progress }) => {
  const handleContinue = () => {
    onContinue()
  }

  return (
    <Step.Container>
      <Step.Progress onBack={onBack} progress={progress} />

      <Step.Header className="flex-1 gap-4">
        <Step.HeaderIllustration>
          <Image source={PracticeDiscoveryImage as unknown as ImageSourcePropType} className="h-full w-full" resizeMode="contain" />
        </Step.HeaderIllustration>

        <View>
          <Step.HeaderTitle className="text-2xl">Tell us about your current practice</Step.HeaderTitle>
        </View>
        <View>
          <Step.HeaderDescription className="text-lg">
            Tell us how you learn and where you get stuck so your first sessions feel achievable and motivating.
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

export default PracticeDiscovery
