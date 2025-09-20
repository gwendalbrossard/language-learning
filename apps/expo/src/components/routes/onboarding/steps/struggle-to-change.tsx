import type { ImageSourcePropType } from "react-native"
import { useAssets } from "expo-asset"
import { Dimensions, Image, View } from "react-native"

import type { StepProps } from "~/components/common/step"
import * as Step from "~/components/common/step"
// @ts-expect-error - It's valid
import StruggleToChangeImage from "~/components/routes/landing/images/struggle-to-change.png"
import * as Button from "~/ui/button"
import { Text } from "~/ui/text"

const StruggleToChange: React.FC<StepProps> = ({ onContinue, onBack, progress }) => {
  const [assets, _error] = useAssets([StruggleToChangeImage])

  const handleContinue = () => {
    onContinue()
  }

  const width = Dimensions.get("window").width

  return (
    <Step.Container>
      <Step.Progress onBack={onBack} progress={progress} />

      <Step.Header>
        <Step.HeaderTitle>Most People Struggle to Change Alone</Step.HeaderTitle>
        <Step.HeaderDescription>With DayBayDay, your odds of success are dramatically better</Step.HeaderDescription>
      </Step.Header>

      <Step.Body>
        <View className="flex flex-col gap-10">
          <View
            className="-mx-4 w-full"
            style={{
              maxHeight: width * 0.8,
            }}
          >
            {assets && assets[0] && <Image source={assets[0] as ImageSourcePropType} className="h-full w-full" resizeMode="contain" />}
          </View>

          <View>
            <Text className="mx-auto max-w-[90%] text-center text-sm font-medium text-neutral-600">
              People using DayByDay are 4× more likely to reach their goals.
            </Text>
          </View>
        </View>
      </Step.Body>

      <Step.Bottom>
        <Button.Root size="lg" variant="primary" onPress={handleContinue} className="w-full">
          <Button.Text>I'm Ready to Change</Button.Text>
        </Button.Root>
      </Step.Bottom>
    </Step.Container>
  )
}

export default StruggleToChange
