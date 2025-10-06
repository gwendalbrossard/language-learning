import type { FC } from "react"
import { useRef } from "react"
import { View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"
import { SafeAreaView } from "react-native-safe-area-context"

import type { ProgressRef } from "~/components/routes/(tabs)/progress/progress"
import TabsHeader from "~/components/common/tabs/tabs-header"
import Banner from "~/components/routes/(tabs)/progress/banner"
import Progress from "~/components/routes/(tabs)/progress/progress"
import Streak from "~/components/routes/(tabs)/progress/streak"

const ProgressTab: FC = () => {
  const progressRef = useRef<ProgressRef>(null)

  const handleShareProgress = async () => {
    await progressRef.current?.shareStats()
  }

  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-white">
      <KeyboardAwareScrollView enabled>
        <TabsHeader />

        <View className="flex flex-col gap-6 p-4">
          <Banner onShare={handleShareProgress} />
          <Streak />
          <Progress ref={progressRef} />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default ProgressTab
