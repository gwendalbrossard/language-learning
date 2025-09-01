import type { ImageSourcePropType } from "react-native"
import { useEffect, useRef, useState } from "react"
import { useAssets } from "expo-asset"
import { Animated, Dimensions, Image, View } from "react-native"

import type { StepProps } from "~/components/common/step"
import * as Step from "~/components/common/step"
// @ts-expect-error - It's valid
import StruggleToChangeImage from "~/components/routes/landing/images/struggle-to-change.png"
import * as Button from "~/ui/button"
import { Text } from "~/ui/text"

const StruggleToChange: React.FC<StepProps> = ({ onContinue, onBack, progress }) => {
  const [assets, _error] = useAssets([StruggleToChangeImage])
  const [isAnimationComplete, setIsAnimationComplete] = useState(false)
  const buttonOpacity = useRef(new Animated.Value(0)).current
  const imageOpacity = useRef(new Animated.Value(0)).current
  const textOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const animateIn = (): void => {
      Animated.sequence([
        Animated.timing(imageOpacity, {
          toValue: 1,
          duration: 800,
          delay: 300,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsAnimationComplete(true)
      })
    }

    animateIn()
  }, [imageOpacity, textOpacity, buttonOpacity])

  const handleContinue = () => {
    if (!isAnimationComplete) return
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
          <Animated.View
            className="-mx-4 w-full"
            style={{
              maxHeight: width * 0.8,
              opacity: imageOpacity,
              transform: [
                {
                  translateY: imageOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            }}
          >
            {assets && assets[0] && <Image source={assets[0] as ImageSourcePropType} className="h-full w-full" resizeMode="contain" />}
          </Animated.View>

          <Animated.View
            style={{
              opacity: textOpacity,
              transform: [
                {
                  translateY: textOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            }}
          >
            <Text className="mx-auto max-w-[90%] text-center text-sm font-medium text-neutral-600">
              People using DayByDay are 4× more likely to reach their goals.
            </Text>
          </Animated.View>
        </View>
      </Step.Body>

      <Step.Bottom>
        <Animated.View style={{ opacity: buttonOpacity }}>
          <Button.Root size="lg" variant="primary" onPress={handleContinue} className="w-full">
            <Button.Text>I'm Ready to Change</Button.Text>
          </Button.Root>
        </Animated.View>
      </Step.Bottom>
    </Step.Container>
  )
}

export default StruggleToChange
