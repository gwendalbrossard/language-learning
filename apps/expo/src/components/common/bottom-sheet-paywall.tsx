import { forwardRef, Fragment, useState } from "react"
import { ActivityIndicator, View } from "react-native"
import RevenueCatUI from "react-native-purchases-ui"
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet"
import { usePostHog } from "posthog-react-native"

import { POSTHOG_EVENTS } from "@acme/shared/posthog"

const BottomSheetPaywall = forwardRef<BottomSheetModal, object>((_, ref) => {
  const posthog = usePostHog()

  const refCurrent = ref as React.RefObject<BottomSheetModal>

  const [loading, setLoading] = useState(true)
  /*   const [closeButtonVisible, setCloseButtonVisible] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!loading) {
        setCloseButtonVisible(true)
      }
    }, 2500)

    if (!loading) {
      setCloseButtonVisible(false)
    }

    return () => clearTimeout(timeout)
  }, [loading]) */

  const handleChange = (index: number) => {
    if (index === -1) {
      setLoading(true)
    } else {
      posthog.capture(POSTHOG_EVENTS["paywall presented"])
      setLoading(false)
    }
  }

  /* const handleClose = () => {
    if (!closeButtonVisible) return
    refCurrent.current.dismiss()
  } */

  return (
    <BottomSheetModal
      onChange={handleChange}
      ref={ref}
      snapPoints={["100%"]}
      enablePanDownToClose={false}
      enableHandlePanningGesture={false}
      enableContentPanningGesture={false}
      handleStyle={{ display: "none" }}
      stackBehavior="push"
    >
      <BottomSheetView className="relative flex-1">
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <Fragment>
            {/* <Pressable
              onPress={handleClose}
              className={cn(
                "absolute bottom-0 left-4 top-16 z-50 size-10 items-center justify-center rounded-full bg-neutral-50 transition-all",
                closeButtonVisible ? "opacity-100" : "opacity-0",
              )}
            >
              <XIcon className="text-neutral-400" size={24} />
            </Pressable> */}

            <RevenueCatUI.Paywall
              options={{ displayCloseButton: false }}
              onPurchaseCompleted={() => {
                posthog.capture(POSTHOG_EVENTS["paywall purchase completed"])
                refCurrent.current.dismiss()
              }}
              onPurchaseStarted={() => {
                posthog.capture(POSTHOG_EVENTS["paywall purchase started"])
              }}
              onPurchaseCancelled={() => {
                posthog.capture(POSTHOG_EVENTS["paywall purchase cancelled"])
              }}
              onPurchaseError={() => {
                posthog.capture(POSTHOG_EVENTS["paywall purchase error"])
              }}
              onRestoreCompleted={() => {
                posthog.capture(POSTHOG_EVENTS["paywall restore completed"])
                refCurrent.current.dismiss()
              }}
              onRestoreError={() => {
                posthog.capture(POSTHOG_EVENTS["paywall restore error"])
              }}
              onRestoreStarted={() => {
                posthog.capture(POSTHOG_EVENTS["paywall restore started"])
              }}
            />
          </Fragment>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  )
})

BottomSheetPaywall.displayName = "BottomSheetPaywall"

export default BottomSheetPaywall
