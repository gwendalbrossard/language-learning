import type { FC } from "react"
import type { ImageSourcePropType } from "react-native"
import { useAssets } from "expo-asset"
import { useQuery } from "@tanstack/react-query"
import { Image, View } from "react-native"

import type { StepProps } from "~/components/common/step"
import * as Step from "~/components/common/step"
// @ts-expect-error - It's valid
import GetToKnowYouImage from "~/components/routes/landing/images/onboarding/get-to-know-you.png"
import * as Button from "~/ui/button"
import { trpc } from "~/utils/api"

const GetToKnowYou: FC<StepProps> = ({ onContinue, onBack, progress }) => {
  const [assets, _error] = useAssets([GetToKnowYouImage])

  const profileMe = useQuery(trpc.profile.me.queryOptions())
  if (!profileMe.data) throw new Error("Profile not found")
  const profile = profileMe.data

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
          <Step.HeaderTitle className="text-2xl">Welcome {profile.name}, let's get to know you!</Step.HeaderTitle>
        </View>
        <View>
          <Step.HeaderDescription className="text-lg">We're excited to help you on your journey to better drinking habits.</Step.HeaderDescription>
        </View>
      </Step.Header>

      <Step.Bottom>
        <Button.Root onPress={handleContinue} size="lg" variant="primary" className="w-full">
          <Button.Text>Get Started</Button.Text>
        </Button.Root>
      </Step.Bottom>
    </Step.Container>
  )
}

export default GetToKnowYou
