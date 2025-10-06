import type { FC } from "react"
import { View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"
import { SafeAreaView } from "react-native-safe-area-context"

import TabsHeader from "~/components/common/tabs/tabs-header"
import Banner from "~/components/routes/(tabs)/progress/banner"
import Progress from "~/components/routes/(tabs)/progress/progress"
import Streak from "~/components/routes/(tabs)/progress/streak"

const ProgressTab: FC = () => {
  return (
    <SafeAreaView edges={["top", "left", "right"]} className="bg-white">
      <KeyboardAwareScrollView enabled>
        <TabsHeader />

        <View className="flex flex-col gap-6 p-4">
          <Banner />
          <Streak />
          <Progress />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default ProgressTab
