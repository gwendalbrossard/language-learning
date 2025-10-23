import type { FC } from "react"
import { Stack } from "expo-router"

const CreateRoleplayLayout: FC = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    />
  )
}

export default CreateRoleplayLayout
