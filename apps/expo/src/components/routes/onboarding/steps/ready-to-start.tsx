import type { FC } from "react"
import type { ImageSourcePropType } from "react-native"
import { router } from "expo-router"
import { useMutation, useQuery } from "@tanstack/react-query"
import { usePostHog } from "posthog-react-native"
import { useFormContext } from "react-hook-form"
import { Image, View } from "react-native"

import type { TProfileOnboardSchema } from "@acme/validators"
import { POSTHOG_EVENTS } from "@acme/shared/posthog"

import type { StepProps } from "~/components/common/step"
import * as Step from "~/components/common/step"
import * as Button from "~/ui/button"
import { trpc } from "~/utils/api"
import { prefetchMain } from "~/utils/utils"
// @ts-expect-error - It's valid
import ReadyToStartImage from "./images/ready-to-start.png"

const ReadyToStart: FC<StepProps> = ({ onBack, progress }) => {
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
        router.replace("/(tabs)/lessons")
      },
    }),
  )

  const handleSubmit = async () => {
    const {
      learningLanguage,
      learningLanguageLevel,
      learningReason,
      currentPractice,
      speakingStruggles,
      speakingComfort,
      dailyCommitment,
      progressGoal,
    } = form.getValues()

    await profileOnboard.mutateAsync({
      learningLanguage,
      learningLanguageLevel,
      learningReason,
      currentPractice,
      speakingStruggles,
      speakingComfort,
      dailyCommitment,
      progressGoal,
    })
  }

  const handleContinue = () => {
    void handleSubmit()
  }

  return (
    <Step.Container>
      <Step.Progress onBack={onBack} progress={progress} />

      <Step.Header className="flex-1 gap-4">
        <Step.HeaderIllustration>
          <Image source={ReadyToStartImage as unknown as ImageSourcePropType} className="h-full w-full" resizeMode="contain" />
        </Step.HeaderIllustration>

        <View>
          <Step.HeaderTitle className="text-2xl">{profile.name}, you're ready to start!</Step.HeaderTitle>
        </View>
        <View>
          <Step.HeaderDescription className="text-lg">
            Your first 10‑minute conversation is queued. Start now to lock in Day 1 and feel your first win today.
          </Step.HeaderDescription>
        </View>
      </Step.Header>

      <Step.Bottom>
        <Button.Root onPress={handleContinue} size="lg" variant="primary" className="w-full" loading={profileOnboard.isPending}>
          <Button.Text>Start My First Conversation</Button.Text>
        </Button.Root>
      </Step.Bottom>
    </Step.Container>
  )
}

export default ReadyToStart
