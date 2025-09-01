import type { FC } from "react"
import { useEffect, useRef, useState } from "react"
import { Animated, Text, View } from "react-native"

import type { StepProps } from "~/components/common/step"
import * as Step from "~/components/common/step"
import * as Button from "~/ui/button"

const FutureResults: FC<StepProps> = ({ onContinue, onBack, progress }) => {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false)
  const titleAnimation = useRef<Animated.Value>(new Animated.Value(0)).current
  const benefitsAnimation = useRef<Animated.Value[]>(
    Array(5)
      .fill(0)
      .map(() => new Animated.Value(0)),
  ).current
  const buttonAnimation = useRef<Animated.Value>(new Animated.Value(0)).current

  useEffect(() => {
    const animateIn = () => {
      Animated.sequence([
        ...benefitsAnimation.map((animation, _index) =>
          Animated.timing(animation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ),
        Animated.timing(buttonAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsAnimationComplete(true)
      })
    }

    animateIn()
  }, [titleAnimation, benefitsAnimation, buttonAnimation])

  const handleContinue = () => {
    if (!isAnimationComplete) return
    onContinue()
  }

  const benefits = [
    {
      emoji: "💰",
      title: "Financial Freedom",
      description: "Save more money, enjoy more freedom, and invest in experiences that matter.",
    },
    {
      emoji: "💪",
      title: "Better Health",
      description: "Protect your health and build a future you'll be proud of.",
    },
    {
      emoji: "✨",
      title: "Confidence Boost",
      description: "Feel lighter, stronger, and more confident in your body.",
    },
    {
      emoji: "🌅",
      title: "Better Sleep",
      description: "Sleep deeper, wake up energized, and feel more focused each day.",
    },
    {
      emoji: "😊",
      title: "Improved Mood",
      description: "Notice your anxiety fade and your mood lift within weeks.",
    },
  ] as const

  return (
    <Step.Container>
      <Step.Progress onBack={onBack} progress={progress} />

      <Step.Header>
        <Step.HeaderTitle>Your future self will thank you</Step.HeaderTitle>
        <Step.HeaderDescription>Here's what you'll gain by reducing your drinking. Each benefit matters.</Step.HeaderDescription>
      </Step.Header>

      <Step.Body>
        <View className="flex w-full flex-col gap-6">
          {benefits.map((benefit, index) => {
            const animation = benefitsAnimation[index]
            if (!animation) return null

            return (
              <Animated.View
                key={index}
                style={{
                  opacity: animation,
                  transform: [
                    {
                      translateY: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                }}
                className="flex flex-row items-start gap-3 rounded-2xl"
              >
                <View className="mt-0.5 flex size-11 items-center justify-center rounded-xl border border-neutral-200">
                  <Text className="text-2xl">{benefit.emoji}</Text>
                </View>
                <View className="flex flex-1 flex-col">
                  <Text className="text-lg font-semibold text-neutral-800">{benefit.title}</Text>
                  <Text className="text-base text-neutral-600">{benefit.description}</Text>
                </View>
              </Animated.View>
            )
          })}
        </View>
      </Step.Body>

      <Step.Bottom>
        <Animated.View
          style={{
            opacity: buttonAnimation,
          }}
        >
          <Button.Root onPress={handleContinue} size="lg" variant="primary" className="w-full">
            <Button.Text>Let's Make It Happen</Button.Text>
          </Button.Root>
        </Animated.View>
      </Step.Bottom>
    </Step.Container>
  )
}

export default FutureResults
