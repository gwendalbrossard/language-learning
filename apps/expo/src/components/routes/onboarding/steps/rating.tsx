import type { FC } from "react"
import type { ImageSourcePropType } from "react-native"
import { useState } from "react"
import * as StoreReview from "expo-store-review"
import { usePostHog } from "posthog-react-native"
import { Image } from "react-native"

import { POSTHOG_EVENTS } from "@acme/shared/posthog"

import type { StepProps } from "~/components/common/step"
import * as Step from "~/components/common/step"
import * as Button from "~/ui/button"
// @ts-expect-error - It's valid
import RatingImage from "./images/rating.png"

const Rating: FC<StepProps> = ({ onContinue, onBack, progress }) => {
  const [isRequestingReview, setIsRequestingReview] = useState(false)
  const posthog = usePostHog()

  const handleRating = async () => {
    posthog.capture(POSTHOG_EVENTS["onboarding rating completed"], { result: "requested" })
    setIsRequestingReview(true)

    // Trigger the review request
    if (await StoreReview.hasAction()) {
      await StoreReview.requestReview()
    }

    // Set a 2 seconds timeout before changing the button text
    setTimeout(() => {
      setIsRequestingReview(false)
      onContinue()
    }, 2000)
  }

  const handleSkip = () => {
    posthog.capture(POSTHOG_EVENTS["onboarding rating completed"], { result: "skipped" })
    onContinue()
  }

  return (
    <Step.Container>
      <Step.Progress onBack={onBack} progress={progress} />

      <Step.Header>
        <Step.HeaderTitle>Give us a rating</Step.HeaderTitle>
        <Step.HeaderDescription>We're a small team doing our best to build the best app to help you learn languages!</Step.HeaderDescription>
      </Step.Header>

      <Step.Body className="items-center justify-center">
        <Image source={RatingImage as unknown as ImageSourcePropType} className="h-[70%] w-full" resizeMode="contain" />
      </Step.Body>

      <Step.Bottom>
        <Button.Root size="md" variant="ghost" onPress={handleSkip} disabled={isRequestingReview} className="w-full opacity-50">
          <Button.Text>Skip rating</Button.Text>
        </Button.Root>

        <Button.Root size="lg" variant="primary" onPress={handleRating} loading={isRequestingReview} disabled={isRequestingReview} className="w-full">
          <Button.Text>Give us a rating</Button.Text>
        </Button.Root>
      </Step.Bottom>
    </Step.Container>
  )
}

export default Rating
