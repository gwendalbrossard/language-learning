import type { FC } from "react"
import { useState } from "react"
import * as StoreReview from "expo-store-review"
import { HeartIcon, MoveRightIcon, StarIcon } from "lucide-react-native"
import { usePostHog } from "posthog-react-native"
import { Text, View } from "react-native"

import { POSTHOG_EVENTS } from "@acme/shared/posthog"

import type { StepProps } from "~/components/common/step"
import * as Step from "~/components/common/step"
import Icon from "~/components/common/svg/icon"
import * as Button from "~/ui/button"

const Rating: FC<StepProps> = ({ onContinue, onBack, progress }) => {
  const [isRequestingReview, setIsRequestingReview] = useState(false)
  const [reviewCompleted, setReviewCompleted] = useState(false)
  const posthog = usePostHog()

  const handleRating = async () => {
    setIsRequestingReview(true)

    // Trigger the review request
    if (await StoreReview.hasAction()) {
      await StoreReview.requestReview()
    }

    // Set a 1 second timeout before changing the button text
    setTimeout(() => {
      setIsRequestingReview(false)
      setReviewCompleted(true)
    }, 1000)
  }

  const handleSkip = () => {
    posthog.capture(POSTHOG_EVENTS["onboarding rating completed"], { result: "skipped" })
    onContinue()
  }

  const handleContinue = () => {
    posthog.capture(POSTHOG_EVENTS["onboarding rating completed"], { result: "requested" })
    onContinue()
  }

  return (
    <Step.Container>
      <Step.Progress onBack={onBack} progress={progress} />

      {/* Top */}
      <Step.Header>
        <Step.HeaderTitle>Give us a rating</Step.HeaderTitle>
        <Step.HeaderDescription>We're a small team doing our best to build the best app to help you study!</Step.HeaderDescription>
      </Step.Header>

      <Step.Body>
        <View className="flex flex-col items-center gap-6">
          <Icon width={192} height={192} />

          <View className="flex flex-col items-center gap-2">
            <View className="flex flex-row gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon size={32} key={star} className="fill-yellow-400 text-yellow-400" />
              ))}
            </View>
            <Text className="text-sm text-neutral-500">Thousands of students love us</Text>
          </View>
        </View>
      </Step.Body>

      {/* Bottom - Stacked Buttons */}
      <Step.Bottom>
        {!reviewCompleted && (
          <Button.Root size="md" variant="ghost" onPress={handleSkip} disabled={isRequestingReview} className="w-full opacity-50">
            <Button.Text>Skip rating</Button.Text>
          </Button.Root>
        )}
        <Button.Root
          size="lg"
          variant="primary"
          onPress={reviewCompleted ? handleContinue : handleRating}
          loading={isRequestingReview}
          disabled={isRequestingReview}
          className="w-full"
        >
          <Button.Text>{reviewCompleted ? "Continue" : "Give us a rating"}</Button.Text>
          {reviewCompleted ? <Button.Icon icon={MoveRightIcon} /> : <HeartIcon className="fill-white text-white" size={24} />}
        </Button.Root>
      </Step.Bottom>
    </Step.Container>
  )
}

export default Rating
