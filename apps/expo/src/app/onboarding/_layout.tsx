import type { FC } from "react"
import { Stack } from "expo-router"

const OnboardingLayout: FC = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    />
  )
}

export default OnboardingLayout
