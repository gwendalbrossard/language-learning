import type { FC } from "react"
import { router } from "expo-router"
import { useMutation, useQuery } from "@tanstack/react-query"
import { usePostHog } from "posthog-react-native"
import { useFormContext } from "react-hook-form"
import { Text, View } from "react-native"

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
                return (
                  <View
                    key={index}
                    className="flex flex-row items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3"
                  >
                    <Text className="text-2xl">{feature.emoji}</Text>
                    <View className="flex-1">
                      <Text className="font-medium text-neutral-900">{feature.title}</Text>
                      <Text className="text-neutral-600">{feature.description}</Text>
                    </View>
                  </View>
                )
              })}
            </View>
          </View>

          {/* Benefits Section */}
          <View className="flex flex-col gap-4">
            <View>
              <Text className="text-xl font-medium text-neutral-900">The Life You'll Unlock</Text>
            </View>
            {benefits.map((benefit, index) => {
              return (
                <View
                  key={index}
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
                </View>
              )
            })}
          </View>
        </View>
      </Step.Body>

      <Step.Bottom>
        <Button.Root onPress={handleContinue} size="lg" variant="primary" className="w-full" loading={profileOnboard.isPending}>
          <Button.Text>I'm Ready to Change</Button.Text>
        </Button.Root>
      </Step.Bottom>
    </Step.Container>
  )
}

export default FinalCustomPlan
