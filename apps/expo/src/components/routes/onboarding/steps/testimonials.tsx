import type { Asset } from "expo-asset"
import type { FC } from "react"
import type { ImageSourcePropType } from "react-native"
import { useAssets } from "expo-asset"
import { Image, Text, View } from "react-native"

import type { StepProps } from "~/components/common/step"
import * as Step from "~/components/common/step"
// @ts-expect-error - It's valid
import Man1 from "~/components/routes/landing/images/testimonials/man-1.png"
// @ts-expect-error - It's valid
import Woman1 from "~/components/routes/landing/images/testimonials/woman-1.png"
// @ts-expect-error - It's valid
import Woman4 from "~/components/routes/landing/images/testimonials/woman-4.png"
import * as Button from "~/ui/button"

type Testimonial = {
  id: number
  title: string
  text: string
  user: {
    name: string
    avatar: Asset
    age: number
  }
  rating: number
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    title: "From stress drinking to better sleep",
    text: "I used to drink to unwind after work, but it left me foggy and unproductive. I've cut back to just weekends and my focus at work has never been better. The morning clarity is amazing!",
    user: {
      name: "Samantha",
      avatar: Woman1 as Asset,
      age: 31,
    },
    rating: 5,
  },
  {
    id: 2,
    title: "Saved $500 monthly from drinking",
    text: "After tracking my drinking for a month, I realized I was spending over $500 a month on alcohol. I've cut my drinking in half and saved enough for a vacation. The community support is amazing!",
    user: {
      name: "David",
      avatar: Man1 as Asset,
      age: 42,
    },
    rating: 5,
  },
  {
    id: 3,
    title: "Lost 8 pounds, found my energy",
    text: "I never thought I could change my drinking habits. But the daily check-ins made it so much easier. I've lost 8 pounds and feel more energetic than I have in years.",
    user: {
      name: "Emily",
      avatar: Woman4 as Asset,
      age: 28,
    },
    rating: 5,
  },
]

const Testimonials: FC<StepProps> = ({ onContinue, onBack, progress }) => {
  const [assets, _error] = useAssets([Man1, Woman1, Woman4])

  const handleContinue = () => {
    onContinue()
  }

  console.log(assets)
  if (!assets || !assets[0] || !assets[1] || !assets[2]) return null

  return (
    <Step.Container>
      <Step.Progress onBack={onBack} progress={progress} />

      <Step.Header>
        <Step.HeaderTitle>Real Stories, Real Results</Step.HeaderTitle>
        <Step.HeaderDescription>See how others have transformed their relationship with alcohol with DayByDay</Step.HeaderDescription>
      </Step.Header>

      <Step.Body>
        <View className="flex flex-col gap-6">
          {testimonials.map((t) => {
            return (
              <View key={t.id}>
                <View className="rounded-3xl border border-neutral-100 p-2">
                  <View className="relative flex flex-col gap-5 rounded-2xl border border-neutral-200 p-5">
                    {/* Used only to create a shadow */}
                    <View className="absolute bottom-0 left-0 right-0 top-0 rounded-2xl bg-white shadow-xs" />

                    <View className="flex flex-col gap-1.5">
                      <Text className="text-base font-semibold text-primary-600">{t.title}</Text>
                      <Text className="text-base text-neutral-800">{t.text}</Text>
                    </View>

                    <View className="flex flex-row items-center">
                      <View className="size-10 overflow-hidden rounded-full">
                        <Image source={t.user.avatar as ImageSourcePropType} alt={t.user.name} className="h-full w-full" resizeMode="contain" />
                      </View>

                      <View className="ml-2">
                        <Text className="text-sm font-medium text-neutral-700">{t.user.name}</Text>
                        <Text className="text-sm text-neutral-500">{t.user.age} years old</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )
          })}
        </View>
      </Step.Body>

      <Step.Bottom>
        <Button.Root onPress={handleContinue} size="lg" variant="primary" className="w-full">
          <Button.Text>Start my journey</Button.Text>
        </Button.Root>
      </Step.Bottom>
    </Step.Container>
  )
}

export default Testimonials
