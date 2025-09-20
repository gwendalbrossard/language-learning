import type { FC } from "react"
import * as ExpoNotifications from "expo-notifications"
import { usePostHog } from "posthog-react-native"
import { Text } from "react-native"

import { POSTHOG_EVENTS } from "@acme/shared/posthog"

import type { StepProps } from "~/components/common/step"
import * as Step from "~/components/common/step"
import * as Button from "~/ui/button"

const Notifications: FC<StepProps> = ({ onContinue, onBack, progress }) => {
  const posthog = usePostHog()

  const handleEnableNotifications = async () => {
    const { status: existingStatus } = await ExpoNotifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== ExpoNotifications.PermissionStatus.GRANTED) {
      const { status } = await ExpoNotifications.requestPermissionsAsync()
      finalStatus = status
    }

    posthog.capture(POSTHOG_EVENTS["onboarding notifications completed"], {
      result: finalStatus === ExpoNotifications.PermissionStatus.GRANTED ? "enabled" : "disabled",
    })

    onContinue()
  }

  const handleSkip = () => {
    posthog.capture(POSTHOG_EVENTS["onboarding notifications completed"], { result: "skipped" })
    onContinue()
  }

  return (
    <Step.Container>
      <Step.Progress onBack={onBack} progress={progress} />

      <Step.Header>
        <Step.HeaderTitle>Never lose momentum</Step.HeaderTitle>
        <Step.HeaderDescription>Get gentle reminders for your daily practice sessions. Consistency is the key to fluency.</Step.HeaderDescription>
      </Step.Header>

      <Step.Body className="items-center justify-center">
        <Text className="text-center text-lg text-muted-foreground">
          [Bell notification animation]
        </Text>
      </Step.Body>

      <Step.Bottom>
        <Button.Root size="md" variant="ghost" onPress={handleSkip} className="w-full opacity-50">
          <Button.Text>Skip notifications</Button.Text>
        </Button.Root>
        <Button.Root size="lg" variant="primary" onPress={handleEnableNotifications} className="w-full">
          <Button.Text>Enable notifications</Button.Text>
        </Button.Root>
      </Step.Bottom>
    </Step.Container>
  )
}

export default Notifications