import type { FC } from "react"
import type { ImageSourcePropType } from "react-native"
import { useEffect, useRef, useState } from "react"
import { useAssets } from "expo-asset"
import { Animated, Image } from "react-native"

import type { StepProps } from "~/components/common/step"
import * as Step from "~/components/common/step"
// @ts-expect-error - It's valid
import IntentionsImage from "~/components/routes/landing/images/onboarding/intentions.png"
import * as Button from "~/ui/button"

const Intentions: FC<StepProps> = ({ onContinue, onBack, progress }) => {
  const [assets, _error] = useAssets([IntentionsImage])

  const titleAnimation = useRef(new Animated.Value(0)).current
  const descriptionAnimation = useRef(new Animated.Value(0)).current
  const buttonAnimation = useRef(new Animated.Value(0)).current
  const [isAnimationComplete, setIsAnimationComplete] = useState(false)

  useEffect(() => {
    const animateIn = () => {
      Animated.sequence([
        Animated.timing(titleAnimation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(descriptionAnimation, {
          toValue: 1,
          duration: 800,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.timing(buttonAnimation, {
          toValue: 1,
          duration: 300,
          delay: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsAnimationComplete(true)
      })
    }

    animateIn()
  }, [titleAnimation, descriptionAnimation, buttonAnimation])

  const handleContinue = () => {
    if (!isAnimationComplete) return
    onContinue()
  }

  return (
    <Step.Container>
      <Step.Progress onBack={onBack} progress={progress} />

      <Step.Header className="flex-1 gap-4">
        <Step.HeaderIllustration>
          {assets && assets[0] && <Image source={assets[0] as ImageSourcePropType} className="h-full w-full" resizeMode="contain" />}
        </Step.HeaderIllustration>

        <Animated.View
          style={{
            opacity: titleAnimation,
            transform: [
              {
                translateY: titleAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
        >
          <Step.HeaderTitle className="text-2xl">Set your intentions</Step.HeaderTitle>
        </Animated.View>
        <Animated.View
          style={{
            opacity: descriptionAnimation,
            transform: [
              {
                translateY: descriptionAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
        >
          <Step.HeaderDescription className="text-lg">
            Take a moment to reflect on what truly matters to you. Your intentions will guide your journey to a healthier relationship with alcohol.
          </Step.HeaderDescription>
        </Animated.View>
      </Step.Header>

      <Step.Bottom>
        <Animated.View
          style={{
            opacity: buttonAnimation,
          }}
        >
          <Button.Root onPress={handleContinue} size="lg" variant="primary" className="w-full">
            <Button.Text>Share your reasons</Button.Text>
          </Button.Root>
        </Animated.View>
      </Step.Bottom>
    </Step.Container>
  )
}

export default Intentions
