import type { FC } from "react"
import * as AppleAuthentication from "expo-apple-authentication"
import { CodedError } from "expo-modules-core"
import { router } from "expo-router"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { Alert, Linking, Platform, Text, View } from "react-native"
import Animated, { FadeIn, FadeInRight } from "react-native-reanimated"
import { SafeAreaView } from "react-native-safe-area-context"

import Apple from "~/components/common/svg/apple"
import Google from "~/components/common/svg/google"
import Logo from "~/components/common/svg/logo"
import * as Button from "~/ui/button"
import { queryClient, trpc } from "~/utils/api"
import { authClient } from "~/utils/auth"
import { prefetchMain } from "~/utils/utils"

const SignIn: FC = () => {
  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: "white" }}>
      <View className="flex flex-1 flex-col gap-8">
        {/* Main content */}
        <View className="flex flex-1 flex-col items-center justify-center gap-12">
          {/* Logo and title */}
          <View className="flex flex-col items-center gap-8">
            <Logo width={200} height={48} />
            <View className="flex flex-col items-center gap-3">
              <Animated.Text entering={FadeInRight.duration(600).delay(200)} className="text-center text-3xl font-medium">
                Become a better you
              </Animated.Text>
              <Animated.Text entering={FadeIn.duration(800).delay(800)} className="text-center text-base text-neutral-600">
                Join a thriving community of people who are changing their drinking habits.
              </Animated.Text>
            </View>
          </View>

          {/* Sign in buttons */}
          <View className="w-full">
            <Animated.View entering={FadeIn.duration(800).delay(1400)} className="flex w-full flex-col items-center justify-center gap-3">
              <GoogleSignIn />
              <AppleSignIn />
            </Animated.View>
          </View>
        </View>

        {/* Terms and conditions */}
        <View className="mx-auto w-[75%] items-center">
          <Animated.View entering={FadeIn.duration(800).delay(1400)}>
            <Text className="text-center text-xs text-neutral-500">
              By continuing, you agree to our{" "}
              <Text className="underline" onPress={() => Linking.openURL("https://daybydayapp.com/terms")}>
                Terms of use
              </Text>{" "}
              and our{" "}
              <Text className="underline" onPress={() => Linking.openURL("https://daybydayapp.com/privacy")}>
                Privacy policy
              </Text>
            </Text>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default SignIn

type UserInformation = {
  first_name: string | undefined
  last_name: string | undefined
  timezone: string
}

const handleAuthSuccess = async (userInformation: UserInformation) => {
  const authMe = await queryClient.fetchQuery(
    trpc.auth.me.queryOptions({
      name: userInformation.first_name ?? undefined,
      timezone: userInformation.timezone,
    }),
  )

  if (!authMe.profile) {
    router.push("/create-profile")
  } else if (!authMe.profile.completedOnboarding) {
    await queryClient.prefetchQuery(trpc.profile.me.queryOptions())
    router.push("/onboarding")
  } else {
    await prefetchMain()
    router.replace("/main")
  }
}

const GoogleSignIn: FC = () => {
  void GoogleSignin.configure({
    iosClientId: "253659385011-etsd109cgtifr93hapbodc00f73td2b7.apps.googleusercontent.com",
  })

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()
      if (userInfo.data && userInfo.data.idToken) {
        const { error } = await authClient.signIn.social({
          provider: "google",
          idToken: {
            token: userInfo.data.idToken,
          },
        })

        if (error) {
          throw new Error(error.message)
        }

        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

        const userInformation: UserInformation = {
          first_name: userInfo.data.user.givenName ?? undefined,
          last_name: userInfo.data.user.familyName ?? undefined,
          timezone: timezone,
        }
        await handleAuthSuccess(userInformation)
      } else {
        throw new Error("no ID token present!")
      }
    } catch (error) {
      console.log(error)

      if (error instanceof CodedError) {
        if (error.code === "ERR_REQUEST_CANCELED") {
          // user cancelled the login flow
        } else if (error.code === "ERR_REQUEST_FAILED") {
          // operation (e.g. sign in) is in progress already
        } else if (error.code === "ERR_PLAY_SERVICES_NOT_AVAILABLE") {
          // play services not available or outdated
        } else {
          Alert.alert("Error", "An error occurred. Please try again.")
        }
      } else {
        Alert.alert("Error", "An error occurred. Please try again.")
      }
    }
  }

  return (
    <Button.Root size="lg" variant="secondary" onPress={handleGoogleSignIn} className="w-full">
      <Google width={20} height={20} />
      <Button.Text>Continue with Google</Button.Text>
    </Button.Root>
  )
}

const AppleSignIn: FC = () => {
  if (Platform.OS !== "ios") return null

  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
      })

      if (credential.identityToken) {
        const { error } = await authClient.signIn.social({
          provider: "apple",
          idToken: {
            token: credential.identityToken,
          },
        })

        if (error) {
          throw new Error(error.message)
        }

        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

        const userInformation: UserInformation = {
          first_name: credential.fullName?.givenName ?? undefined,
          last_name: credential.fullName?.familyName ?? undefined,
          timezone: timezone,
        }

        await handleAuthSuccess(userInformation)
      } else {
        throw new Error("No identityToken.")
      }
    } catch (error) {
      if (error instanceof CodedError) {
        if (error.code === "ERR_REQUEST_CANCELED") {
          // handle that the user canceled the sign-in flow
        } else {
          Alert.alert("Error", "An error occurred. Please try again.")
        }
      } else {
        Alert.alert("Error", "An error occurred. Please try again.")
      }
    }
  }

  return (
    <Button.Root size="lg" variant="primary" onPress={handleAppleSignIn} className="w-full">
      <Apple width={20} height={20} />
      <Button.Text>Continue with Apple</Button.Text>
    </Button.Root>
  )
}
