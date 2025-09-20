import type { FC } from "react"
import type { ImageSourcePropType } from "react-native"
import { useAssets } from "expo-asset"
import { Image, View } from "react-native"

import type { StepProps } from "~/components/common/step"
import * as Step from "~/components/common/step"
// @ts-expect-error - It's valid
import VisualizeYourProgressImage from "~/components/routes/landing/images/onboarding/visualize-your-progress.png"
import * as Button from "~/ui/button"

const VisualizeYourProgress: FC<StepProps> = ({ onContinue, onBack, progress }) => {
  const [assets, _error] = useAssets([VisualizeYourProgressImage])

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
          <Step.HeaderTitle className="text-2xl">Your future starts here</Step.HeaderTitle>
        </View>
        <View>
          <Step.HeaderDescription className="text-lg">
            Picture yourself thriving in a life with less alcohol. See how others transformed their journey and discover what's possible for you.
          </Step.HeaderDescription>
        </View>
      </Step.Header>

      <Step.Bottom>
        <Button.Root onPress={handleContinue} size="lg" variant="primary" className="w-full">
          <Button.Text>Start my transformation</Button.Text>
        </Button.Root>
      </Step.Bottom>
    </Step.Container>
  )
}

export default VisualizeYourProgress
