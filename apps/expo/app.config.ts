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
    bundleIdentifier: "com.studyunfold.mobile",
    supportsTablet: false,
    usesAppleSignIn: true,
    icon: "./assets/icon.png",
    infoPlist: {
      NSMicrophoneUsageDescription: "Allow $(PRODUCT_NAME) to access your microphone to speak to our AI.",
    },
  },
  android: {
    package: "com.studyunfold.mobile",
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#FFFFFF",
    },
    edgeToEdgeEnabled: true,
  },
  extra: {
    eas: {
      projectId: "fd9cb9d3-c56a-48ff-88cb-9e827cf954a4",
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
      "expo-notifications",
      {
        enableBackgroundRemoteNotifications: false,
      },
    ],
    [
      "expo-font",
      {
        fonts: [
          "./assets/fonts/DMSans-Black.ttf",
          "./assets/fonts/DMSans-BlackItalic.ttf",
          "./assets/fonts/DMSans-Bold.ttf",
          "./assets/fonts/DMSans-BoldItalic.ttf",
          "./assets/fonts/DMSans-ExtraBold.ttf",
          "./assets/fonts/DMSans-ExtraBoldItalic.ttf",
          "./assets/fonts/DMSans-ExtraLight.ttf",
          "./assets/fonts/DMSans-ExtraLightItalic.ttf",
          "./assets/fonts/DMSans-Italic.ttf",
          "./assets/fonts/DMSans-Light.ttf",
          "./assets/fonts/DMSans-LightItalic.ttf",
          "./assets/fonts/DMSans-Medium.ttf",
          "./assets/fonts/DMSans-MediumItalic.ttf",
          "./assets/fonts/DMSans-Regular.ttf",
          "./assets/fonts/DMSans-SemiBold.ttf",
          "./assets/fonts/DMSans-SemiBoldItalic.ttf",
          "./assets/fonts/DMSans-Thin.ttf",
          "./assets/fonts/DMSans-ThinItalic.ttf",
          "./assets/fonts/ShantellSans-Bold.ttf",
          "./assets/fonts/ShantellSans-BoldItalic.ttf",
          "./assets/fonts/ShantellSans-ExtraBold.ttf",
          "./assets/fonts/ShantellSans-ExtraBoldItalic.ttf",
          "./assets/fonts/ShantellSans-Italic.ttf",
          "./assets/fonts/ShantellSans-Light.ttf",
          "./assets/fonts/ShantellSans-LightItalic.ttf",
          "./assets/fonts/ShantellSans-Medium.ttf",
          "./assets/fonts/ShantellSans-MediumItalic.ttf",
          "./assets/fonts/ShantellSans-Regular.ttf",
          "./assets/fonts/ShantellSans-SemiBold.ttf",
          "./assets/fonts/ShantellSans-SemiBoldItalic.ttf",
        ],
      },
    ],
  ],
})
