import type { ImageSourcePropType } from "react-native"
import { Image, View } from "react-native"

import type { StepProps } from "~/components/common/step"
import * as Step from "~/components/common/step"
import * as Button from "~/ui/button"
import { Text } from "~/ui/text"
// @ts-expect-error - It's valid
import ExpectedResultsImage from "./images/expected-results.png"

const ExpectedResults: React.FC<StepProps> = ({ onContinue, onBack, progress }) => {
  const handleContinue = () => {
    onContinue()
  }

  return (
    <Step.Container>
      <Step.Progress onBack={onBack} progress={progress} />

      <Step.Header>
        <Step.HeaderTitle>You'll speak confidently in weeks, not years</Step.HeaderTitle>
        <Step.HeaderDescription>Transform from nervous to confident with our proven method.</Step.HeaderDescription>
      </Step.Header>

      <Step.Body>
        <View className="flex flex-col gap-10">
          <Image source={ExpectedResultsImage as unknown as ImageSourcePropType} className="h-[70%] w-full" resizeMode="contain" />

          <Text className="mx-auto max-w-[90%] text-center text-sm font-medium text-neutral-600">3× faster results than traditional methods.</Text>
        </View>
      </Step.Body>

      <Step.Bottom>
        <Button.Root size="lg" variant="primary" onPress={handleContinue} className="w-full">
          <Button.Text>Continue</Button.Text>
        </Button.Root>
      </Step.Bottom>
    </Step.Container>
  )
}

export default ExpectedResults
