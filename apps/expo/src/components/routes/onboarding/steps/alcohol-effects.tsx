import type { FC } from "react"
import { useEffect, useRef, useState } from "react"
import { Animated, Text, View } from "react-native"

import type { StepProps } from "~/components/common/step"
import * as Step from "~/components/common/step"
import * as Button from "~/ui/button"
import * as Table from "~/ui/table"

type Effect = {
  title: string
  description: string
}

const EFFECTS: Effect[] = [
  {
    title: "😴 Sleep Quality",
    description:
      "Alcohol reduces REM sleep by up to 39%, leading to poor sleep quality, daytime fatigue, and impaired cognitive function the next day",
  },
  {
    title: "😰 Mental Health",
    description:
      "Regular alcohol use increases anxiety and depression risk by 40-60%, while also impairing emotional regulation and stress management",
  },
  {
    title: "🦠 Cancer Risk",
    description: "Alcohol is classified as a Group 1 carcinogen, directly linked to 7+ cancers including breast, liver, and esophageal cancer",
  },
  {
    title: "⚖️ Weight & Metabolism",
    description: "Alcohol contains 7 calories per gram, slows metabolism by 73%, and increases fat storage, particularly around the abdomen",
  },
  {
    title: "🧠 Brain Function",
    description: "Chronic alcohol use shrinks brain volume, impairs memory formation, and reduces cognitive abilities by up to 20%",
  },
]

const AlcoholEffects: FC<StepProps> = ({ onContinue, onBack, progress }) => {
  const animations = useRef<Animated.Value[]>(EFFECTS.map(() => new Animated.Value(0))).current
  const [isAnimationComplete, setIsAnimationComplete] = useState(false)
  const buttonOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const animateIn = (): void => {
      const animationSequence = EFFECTS.map((_, index) => {
        const animation = animations[index]
        if (!animation) return null
        return Animated.timing(animation, {
          toValue: 1,
          duration: 500,
          delay: 600 + index * 500,
          useNativeDriver: true,
        })
      }).filter((animation): animation is Animated.CompositeAnimation => animation !== null)

      Animated.sequence([
        Animated.stagger(500, animationSequence),
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsAnimationComplete(true)
      })
    }

    animateIn()
  }, [animations, buttonOpacity])

  const handleContinue = () => {
    if (!isAnimationComplete) return
    onContinue()
  }

  return (
    <Step.Container>
      <Step.Progress onBack={onBack} progress={progress} />

      <Step.Header>
        <Step.HeaderTitle>The Impacts of Alcohol</Step.HeaderTitle>
        <Step.HeaderDescription>Drinking alcohol has negative impacts on your body and mind.</Step.HeaderDescription>
      </Step.Header>

      <Step.Body>
        <View className="flex flex-col gap-4">
          {EFFECTS.map((effect, index) => {
            const animation = animations[index]
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
              >
                <Table.Root className="w-full">
                  <Table.Header>
                    <Table.RowHeader className="py-2">
                      <Table.Head className="flex-1">
                        <Text>{effect.title}</Text>
                      </Table.Head>
                    </Table.RowHeader>
                  </Table.Header>
                  <Table.Body>
                    <Table.RowBody isLast>
                      <Table.Cell>
                        <Text className="text-sm text-neutral-600">{effect.description}</Text>
                      </Table.Cell>
                    </Table.RowBody>
                  </Table.Body>
                </Table.Root>
              </Animated.View>
            )
          })}
        </View>
      </Step.Body>

      <Step.Bottom>
        <Animated.View style={{ opacity: buttonOpacity }}>
          <Button.Root onPress={handleContinue} size="lg" variant="primary" className="w-full">
            <Button.Text>Get my reduction plan</Button.Text>
          </Button.Root>
        </Animated.View>
      </Step.Bottom>
    </Step.Container>
  )
}

export default AlcoholEffects
