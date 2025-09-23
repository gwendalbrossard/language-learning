import type { FC } from "react"
import { useEffect, useRef } from "react"
import { router } from "expo-router"
import { Animated, Image, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import Logo from "~/components/common/svg/logo"
import * as Button from "~/ui/button"
import { Text } from "~/ui/text"

const Landing: FC = () => {
  const logoOpacity = useRef(new Animated.Value(0)).current
  const logoScale = useRef(new Animated.Value(0.9)).current
  const titleOpacity = useRef(new Animated.Value(0)).current
  const titleTranslateY = useRef(new Animated.Value(20)).current
  const subtitleOpacity = useRef(new Animated.Value(0)).current
  const subtitleTranslateY = useRef(new Animated.Value(20)).current
  const buttonOpacity = useRef(new Animated.Value(0)).current

  const onReadyToStart = () => {
    router.push("/auth")
  }

  useEffect(() => {
    // Animate all elements with a smoother sequence
    Animated.sequence([
      // First animate the logo
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Then animate title
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(100), // Small pause before subtitle
      // Then animate subtitle
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleTranslateY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(100), // Small pause before button
      // Finally animate button
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start()
  }, [buttonOpacity, logoOpacity, logoScale, subtitleOpacity, subtitleTranslateY, titleOpacity, titleTranslateY])

  return (
    <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1, padding: 16, paddingBottom: 0, backgroundColor: "white" }}>
      <View className="flex-1 bg-white">
        {/* Illustrations Section */}
        <View className="relative mb-6 h-[40%] w-full">
          <Image source={{ uri: "welcome" }} className="h-full w-full" resizeMode="contain" />
        </View>

        {/* Content Section */}
        <View className="flex-1 items-center">
          <Animated.View
            className="mb-8"
            style={{
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            }}
          >
            <Logo width={200} height={40} />
          </Animated.View>

          <Animated.View
            className="mb-6"
            style={{
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslateY }],
            }}
          >
            <Text className="text-center text-3xl font-medium text-neutral-900">Take Control of{"\n"}Your Drinking</Text>
          </Animated.View>

          <Animated.View
            className="mb-10"
            style={{
              opacity: subtitleOpacity,
              transform: [{ translateY: subtitleTranslateY }],
            }}
          >
            <Text className="text-center text-xl text-neutral-600">We'll help you reduce alcohol step by step—with support, not shame.</Text>
          </Animated.View>
        </View>

        {/* Bottom Section */}
        <View className="pb-6">
          <Animated.View style={{ opacity: buttonOpacity }}>
            <Button.Root variant="primary" size="xl" onPress={onReadyToStart} className="w-full">
              <Button.Text>I'm ready to start</Button.Text>
            </Button.Root>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Landing
