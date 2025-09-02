import { useCallback, useEffect, useRef, useState } from "react"
import Constants from "expo-constants"
import * as Device from "expo-device"
import * as ExpoNotifications from "expo-notifications"
import { Alert, Platform } from "react-native"

import type { RouterOutputs } from "@acme/api"

export enum NotificationType {
  STREAK = "streak",
}

export type ScheduleNotificationProps = {
  title: string
  body: string
  triggerDate: Date
  profile: RouterOutputs["profile"]["me"]
  type: NotificationType
}

export interface PushNotificationState {
  expoPushToken?: ExpoNotifications.ExpoPushToken
  notification?: ExpoNotifications.Notification
  scheduleNotification: (props: ScheduleNotificationProps) => Promise<string>
}

export const usePushNotifications = (): PushNotificationState => {
  const [expoPushToken, setExpoPushToken] = useState<ExpoNotifications.ExpoPushToken | undefined>(undefined)
  const [notification, setNotification] = useState<ExpoNotifications.Notification | undefined>(undefined)
  const notificationListener = useRef<ExpoNotifications.EventSubscription>(null)
  const responseListener = useRef<ExpoNotifications.EventSubscription>(null)

  ExpoNotifications.setNotificationHandler({
    handleNotification: async () => {
      return Promise.resolve({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: false,
        shouldShowList: false,
      })
    },
  })

  const handleRegistrationError = (errorMessage: string) => {
    Alert.alert(errorMessage)
    throw new Error(errorMessage)
  }

  const registerForPushNotificationsAsync = useCallback(async () => {
    if (Platform.OS === "android") {
      await ExpoNotifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: ExpoNotifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      })
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await ExpoNotifications.getPermissionsAsync()
      let finalStatus = existingStatus
      if (existingStatus !== ExpoNotifications.PermissionStatus.GRANTED) {
        const { status } = await ExpoNotifications.requestPermissionsAsync()
        finalStatus = status
      }
      if (finalStatus !== ExpoNotifications.PermissionStatus.GRANTED) {
        console.error("Permission not granted to get push token for push notification!")
        return
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
      const projectId: string | undefined = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId

      if (!projectId) {
        handleRegistrationError("Project ID not found")
      }

      try {
        const pushToken = await ExpoNotifications.getExpoPushTokenAsync({
          projectId: projectId,
        })

        console.log(pushToken)
        return pushToken
      } catch (e: unknown) {
        handleRegistrationError(`${e as string}`)
      }
    } else {
      handleRegistrationError("Must use physical device for push notifications")
    }
  }, [])

  const scheduleNotification = useCallback(async (props: ScheduleNotificationProps): Promise<string> => {
    const { title, body, triggerDate, profile } = props

    const identifier = await ExpoNotifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: { type: props.type },
      },
      trigger: {
        type: ExpoNotifications.SchedulableTriggerInputTypes.CALENDAR,
        channelId: Platform.OS === "android" ? "default" : undefined,
        timezone: profile.timezone,
        year: triggerDate.getFullYear(),
        month: triggerDate.getMonth() + 1,
        day: triggerDate.getDate(),
        hour: triggerDate.getHours(),
        minute: triggerDate.getMinutes(),
        second: triggerDate.getSeconds(),
      },
    })

    return identifier
  }, [])

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? undefined))
      .catch((_error: unknown) => setExpoPushToken(undefined))

    notificationListener.current = ExpoNotifications.addNotificationReceivedListener((notification) => {
      setNotification(notification)
    })

    responseListener.current = ExpoNotifications.addNotificationResponseReceivedListener((response) => {
      console.log(response)
    })

    return () => {
      if (notificationListener.current) {
        ExpoNotifications.removeNotificationSubscription(notificationListener.current)
      }
      if (responseListener.current) {
        ExpoNotifications.removeNotificationSubscription(responseListener.current)
      }
    }
  }, [registerForPushNotificationsAsync])

  return {
    expoPushToken,
    notification,
    scheduleNotification,
  }
}
