import type { ConfigContext, ExpoConfig } from "expo/config"

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "expo",
  slug: "expo",
  scheme: "expo",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#FFFFFF",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  newArchEnabled: true,
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: "com.daybyday.mobile",
    supportsTablet: false,
    usesAppleSignIn: true,
    icon: "./assets/icon.png",
  },
  android: {
    package: "com.daybyday.mobile",
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#FFFFFF",
    },
    edgeToEdgeEnabled: true,
  },
  extra: {
    eas: {
      projectId: "24651605-54b2-4583-a93c-d127cf288d78",
    },
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    "expo-web-browser",
    ["expo-apple-authentication"],
    [
      "expo-splash-screen",
      {
        backgroundColor: "#FFFFFF",
        image: "./assets/splash.png",
        imageWidth: 56,
      },
    ],
    [
      "@react-native-google-signin/google-signin",
      {
        iosUrlScheme: "com.googleusercontent.apps.253659385011-etsd109cgtifr93hapbodc00f73td2b7",
      },
    ],
    [
      "expo-av",
      {
        microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone to speak to our AI.",
      },
    ],
  ],
})
