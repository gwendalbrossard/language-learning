import type { FC } from "react"
import type { ImageSourcePropType } from "react-native"
import { useAssets } from "expo-asset"
import { Image, View } from "react-native"

import type { StepProps } from "~/components/common/step"
import * as Step from "~/components/common/step"
// @ts-expect-error - It's valid
import IntentionsImage from "~/components/routes/landing/images/onboarding/intentions.png"
import * as Button from "~/ui/button"

const Intentions: FC<StepProps> = ({ onContinue, onBack, progress }) => {
  const [assets, _error] = useAssets([IntentionsImage])

  const handleContinue = () => {
    onContinue()
  }

  return (
    <Step.Container>
      <Step.Progress onBack={onBack} progress={progress} />

      <Step.Header className="flex-1 gap-4">
        <Step.HeaderIllustration>
          {assets && assets[0] && <Image source={assets[0] as ImageSourcePropType} className="h-full w-full" resizeMode="contain" />}
        </Step.HeaderIllustration>

        <View>
          <Step.HeaderTitle className="text-2xl">Set your intentions</Step.HeaderTitle>
        </View>
        <View>
          <Step.HeaderDescription className="text-lg">
            Take a moment to reflect on what truly matters to you. Your intentions will guide your journey to a healthier relationship with alcohol.
          </Step.HeaderDescription>
        </View>
      </Step.Header>

      <Step.Bottom>
        <Button.Root onPress={handleContinue} size="lg" variant="primary" className="w-full">
          <Button.Text>Share your reasons</Button.Text>
        </Button.Root>
      </Step.Bottom>
    </Step.Container>
  )
}

export default Intentions
