import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { PostHogProvider } from "posthog-react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { KeyboardProvider } from "react-native-keyboard-controller"

import { queryClient } from "~/utils/api"

import "../styles.css"

import { QueryClientProvider } from "@tanstack/react-query"

import { posthogConfig } from "@acme/shared/posthog"

import { interopAllLucideIcons } from "~/utils/utils"

export default function RootLayout() {
  interopAllLucideIcons()
  return (
    <QueryClientProvider client={queryClient}>
      <PostHogProvider
        apiKey={posthogConfig.token}
        options={{
          host: posthogConfig.host,
        }}
      >
        <GestureHandlerRootView>
          <KeyboardProvider>
            <BottomSheetModalProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: {
                    backgroundColor: "#FFFFFF",
                  },
                }}
              />
              <StatusBar />
            </BottomSheetModalProvider>
          </KeyboardProvider>
        </GestureHandlerRootView>
      </PostHogProvider>
    </QueryClientProvider>
  )
}
