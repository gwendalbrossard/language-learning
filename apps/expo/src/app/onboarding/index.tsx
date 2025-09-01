import type { FC } from "react"
import { SafeAreaView } from "react-native-safe-area-context"

import Onboarding from "~/components/routes/onboarding/onboarding"

const OnboardingPage: FC = () => {
  return (
    <SafeAreaView edges={["bottom", "top"]} style={{ flex: 1, backgroundColor: "white" }}>
      <Onboarding />
    </SafeAreaView>
  )
}

export default OnboardingPage
