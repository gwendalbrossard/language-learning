import { forwardRef, useRef } from "react"
import { router } from "expo-router"
import * as StoreReview from "expo-store-review"
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet"
import { useMutation, useQuery } from "@tanstack/react-query"
import { LifeBuoyIcon, LogOutIcon, StarIcon, TrashIcon, ZapIcon } from "lucide-react-native"
import { Alert, Linking, Pressable, View } from "react-native"

import BottomSheetPaywall from "~/components/common/bottom-sheet-paywall"
import { useRevenueCat } from "~/hooks/use-revenuecat"
import { BottomSheetBackdrop } from "~/ui/bottom-sheet"
import * as Button from "~/ui/button"
import { Text } from "~/ui/text"
import { queryClient, trpc } from "~/utils/api"
import { authClient } from "~/utils/auth"

const BottomSheetSettings = forwardRef<BottomSheetModal, object>((_, ref) => {
  const profileMe = useQuery(trpc.profile.me.queryOptions())
  if (!profileMe.data) throw new Error("Failed to fetch profile")
  const profile = profileMe.data

  const refCurrent = ref as React.RefObject<BottomSheetModal>
  const bottomSheetPaywallRef = useRef<BottomSheetModal>(null)

  const { entitlement } = useRevenueCat()

  const userDelete = useMutation(
    trpc.user.delete.mutationOptions({
      onSuccess: async () => {
        Alert.alert("Account deleted", "Your account has been deleted. You will be signed out.")
        router.replace("/auth")
        await authClient.signOut()
        await queryClient.invalidateQueries()
      },
      onError: (error) => {
        console.error(error)
        Alert.alert("Error", error.message || "An error occurred")
      },
    }),
  )

  return (
    <BottomSheetModal ref={ref} backdropComponent={BottomSheetBackdrop} enablePanDownToClose stackBehavior="push">
      <BottomSheetView className="flex-1 px-4 pb-10 pt-2">
        <View className="flex flex-col gap-6">
          <Text className="text-center text-base font-semibold text-neutral-400" numberOfLines={1}>
            <Text className="text-base text-neutral-700">{profile.name}</Text> ({profile.email})
          </Text>

          <View className="flex flex-col gap-3">
            {(!entitlement.loaded || !entitlement.isUnlimited) && (
              <Button.Root
                size="lg"
                variant="secondary"
                disabled={entitlement.isUnlimited}
                onPress={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  bottomSheetPaywallRef.current?.present()
                }}
              >
                <Button.Icon icon={ZapIcon} />
                <Button.Text>Upgrade to unlimited</Button.Text>
              </Button.Root>
            )}

            <Button.Root
              size="lg"
              variant="secondary"
              onPress={async () => {
                if (await StoreReview.hasAction()) {
                  await StoreReview.requestReview()
                }
                refCurrent.current.close()
              }}
            >
              <Button.Icon icon={StarIcon} />
              <Button.Text>Rate us</Button.Text>
            </Button.Root>

            <Button.Root
              size="lg"
              variant="secondary"
              onPress={async () => {
                await Linking.openURL("mailto:support@studyunfold.com")
              }}
            >
              <Button.Icon icon={LifeBuoyIcon} />
              <Button.Text>Contact support</Button.Text>
            </Button.Root>

            <Button.Root
              size="lg"
              variant="secondary"
              loading={userDelete.isPending}
              onPress={() => {
                Alert.alert("Delete account", "Are you sure you want to delete your account? This action is irreversible.", [
                  { text: "Cancel", style: "cancel" },
                  { text: "Delete", onPress: () => userDelete.mutate({}) },
                ])
              }}
            >
              <Button.Icon icon={TrashIcon} />
              <Button.Text>Delete account</Button.Text>
            </Button.Root>

            <Button.Root
              size="lg"
              variant="secondary"
              onPress={async () => {
                router.replace("/auth")
                await authClient.signOut()
                await queryClient.invalidateQueries()
              }}
            >
              <Button.Icon icon={LogOutIcon} />
              <Button.Text>Sign out</Button.Text>
            </Button.Root>
          </View>

          <View className="flex flex-row justify-evenly">
            <Pressable
              onPress={async () => {
                await Linking.openURL("https://studyunfold.com/privacy")
              }}
            >
              <Text className="text-xs font-semibold text-neutral-400">Privacy policy</Text>
            </Pressable>
            <Pressable
              onPress={async () => {
                await Linking.openURL("https://studyunfold.com/terms")
              }}
            >
              <Text className="text-xs font-semibold text-neutral-400">Terms of service</Text>
            </Pressable>
          </View>
        </View>
      </BottomSheetView>

      <BottomSheetPaywall ref={bottomSheetPaywallRef} />
    </BottomSheetModal>
  )
})

BottomSheetSettings.displayName = "BottomSheetSettings"

export default BottomSheetSettings
