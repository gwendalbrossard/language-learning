import type { FC } from "react"
import { useEffect, useRef, useState } from "react"
import { router } from "expo-router"
import { useMutation, useQuery } from "@tanstack/react-query"
import { usePostHog } from "posthog-react-native"
import { useFormContext } from "react-hook-form"
import { Animated, Text, View } from "react-native"

import type { TProfileOnboardSchema } from "@acme/validators"
import { POSTHOG_EVENTS } from "@acme/shared/posthog"

import type { StepProps } from "~/components/common/step"
import * as Step from "~/components/common/step"
import * as Button from "~/ui/button"
import { trpc } from "~/utils/api"
import { prefetchMain } from "~/utils/utils"

const FinalCustomPlan: FC<StepProps> = ({ onBack, progress }) => {
  const form = useFormContext<TProfileOnboardSchema>()
  const posthog = usePostHog()

  const profileMe = useQuery(trpc.profile.me.queryOptions())
  if (!profileMe.data) throw new Error("Profile not found")
  const profile = profileMe.data

  const [isAnimationComplete, setIsAnimationComplete] = useState(false)

  // Animations for roadmap features
  const roadmapAnimations = useRef<Animated.Value[]>(
    Array(4)
      .fill(0)
      .map(() => new Animated.Value(0)),
  ).current

  // Animations for benefit blocks
  const benefitAnimations = useRef<Animated.Value[]>(
    Array(3)
      .fill(0)
      .map(() => new Animated.Value(0)),
  ).current

  const benefitsTitleAnimation = useRef<Animated.Value>(new Animated.Value(0)).current
  const buttonAnimation = useRef<Animated.Value>(new Animated.Value(0)).current

  useEffect(() => {
    const animateIn = () => {
      // Animate roadmap features
      const roadmapSequence = roadmapAnimations.map((animation, index) =>
        Animated.timing(animation, {
          toValue: 1,
          duration: 800,
          delay: index * 200,
          useNativeDriver: true,
        }),
      )

      // Animate benefits title
      const benefitsTitleTiming = Animated.timing(benefitsTitleAnimation, {
        toValue: 1,
        duration: 800,
        delay: 1000,
        useNativeDriver: true,
      })

      // Animate benefit blocks with a longer delay after roadmap
      const benefitSequence = benefitAnimations.map((animation, index) =>
        Animated.timing(animation, {
          toValue: 1,
          duration: 800,
          delay: 1000 + index * 300,
          useNativeDriver: true,
        }),
      )

      // Animate button after benefits
      const buttonTiming = Animated.timing(buttonAnimation, {
        toValue: 1,
        duration: 300,
        delay: 2000,
        useNativeDriver: true,
      })

      // Start all animations in parallel
      Animated.parallel([...roadmapSequence, benefitsTitleTiming, ...benefitSequence, buttonTiming]).start(() => {
        setIsAnimationComplete(true)
      })
    }

    animateIn()
  }, [roadmapAnimations, benefitAnimations, benefitsTitleAnimation, buttonAnimation])

  const profileOnboard = useMutation(
    trpc.profile.onboard.mutationOptions({
      onSuccess: async () => {
        posthog.capture(POSTHOG_EVENTS["onboarding completed"])
        await prefetchMain()
        router.replace("/main")
      },
    }),
  )

  const handleSubmit = async () => {
    const { drinkingTriggers, relationshipStatus, reasonsForChange, learningLanguage, learningLanguageLevel } = form.getValues()

    await profileOnboard.mutateAsync({
      learningLanguage,
      learningLanguageLevel,
      drinkingTriggers,
      relationshipStatus,
      reasonsForChange,
    })
  }

  const handleContinue = () => {
    if (!isAnimationComplete) return
    void handleSubmit()
  }

  const roadmapFeatures = [
    {
      emoji: "📈",
      title: "Daily tracking & accountability",
      description: "To keep you on course",
    },
    {
      emoji: "💵",
      title: "See your money saved",
      description: "And health improvements at a glance",
    },
    {
      emoji: "🧠",
      title: "Craving-management tools",
      description: "To stay strong when it matters",
    },
    {
      emoji: "🤝",
      title: "Support from our private community",
      description: "To lift you up",
    },
  ] as const

  const benefits = [
    {
      emoji: "🏋️‍♂️",
      title: "Feel Better, Look Better",
      points: ["Sleep deeper and wake up energized", "Boost your energy and physical fitness", "Strengthen your immune system"],
      testimonial: {
        text: "I've never felt this good in years. I have more energy, my skin looks better, and my sleep is incredible.",
        author: "Alex, 34",
      },
    },
    {
      emoji: "💵",
      title: "Save Big, Spend Smarter",
      points: ["Save thousands each year", "Invest more in experiences you love", "Build financial freedom faster"],
      testimonial: {
        text: "In just two months, I saved enough to book a weekend getaway. Cutting back was the best money decision I've made.",
        author: "Jordan, 29",
      },
    },
    {
      emoji: "🧘‍♂️",
      title: "Find Your Calm and Focus",
      points: ["Reduce anxiety and feel more relaxed", "Sharpen your focus, memory, and clarity", "Boost your confidence and mood"],
      testimonial: {
        text: "My anxiety has dropped so much. I feel clearer, calmer, and actually excited about the future again.",
        author: "Casey, 41",
      },
    },
  ] as const

  return (
    <Step.Container>
      <Step.Progress onBack={onBack} progress={progress} />

      <Step.Header>
        <Step.HeaderTitle>{profile.name}, your custom plan is ready!</Step.HeaderTitle>
        <Step.HeaderDescription>Here's what's waiting for you inside your personalized journey.</Step.HeaderDescription>
      </Step.Header>

      <Step.Body>
        <View className="flex w-full flex-col gap-8 p-2">
          {/* Success Roadmap Section */}
          <View className="flex flex-col gap-4">
            <Text className="text-xl font-medium text-neutral-900">Your Success Roadmap</Text>
            <View className="flex flex-col gap-3">
              {roadmapFeatures.map((feature, index) => {
                const animation = roadmapAnimations[index]
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
                    className="flex flex-row items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3"
                  >
                    <Text className="text-2xl">{feature.emoji}</Text>
                    <View className="flex-1">
                      <Text className="font-medium text-neutral-900">{feature.title}</Text>
                      <Text className="text-neutral-600">{feature.description}</Text>
                    </View>
                  </Animated.View>
                )
              })}
            </View>
          </View>

          {/* Benefits Section */}
          <View className="flex flex-col gap-4">
            <Animated.View
              style={{
                opacity: benefitsTitleAnimation,
                transform: [
                  {
                    translateY: benefitsTitleAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
              <Text className="text-xl font-medium text-neutral-900">The Life You'll Unlock</Text>
            </Animated.View>
            {benefits.map((benefit, index) => {
              const animation = benefitAnimations[index]
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
                  className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
                >
                  {/* Title */}
                  <View className="flex flex-row items-center gap-2">
                    <Text className="text-2xl">{benefit.emoji}</Text>
                    <Text className="text-lg font-medium text-neutral-900">{benefit.title}</Text>
                  </View>

                  {/* Points */}
                  <View className="flex flex-col gap-2">
                    {benefit.points.map((point, pointIndex) => (
                      <Text key={pointIndex} className="text-base text-neutral-600">
                        • {point}
                      </Text>
                    ))}
                  </View>

                  {/* Testimonials */}
                  <View className="mt-2 rounded-lg bg-neutral-200/50 p-3">
                    <Text className="italic text-neutral-700">"{benefit.testimonial.text}"</Text>
                    <Text className="mt-1 text-right font-medium text-neutral-900">— {benefit.testimonial.author}</Text>
                  </View>
                </Animated.View>
              )
            })}
          </View>
        </View>
      </Step.Body>

      <Step.Bottom>
        <Animated.View
          style={{
            opacity: buttonAnimation,
          }}
        >
          <Button.Root onPress={handleContinue} size="lg" variant="primary" className="w-full" loading={profileOnboard.isPending}>
            <Button.Text>I'm Ready to Change</Button.Text>
          </Button.Root>
        </Animated.View>
      </Step.Bottom>
    </Step.Container>
  )
}

export default FinalCustomPlan
