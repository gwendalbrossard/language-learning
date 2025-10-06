import type { FC } from "react"
import { View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"
import { SafeAreaView } from "react-native-safe-area-context"

import TabsHeader from "~/components/common/tabs/tabs-header"
import Lessons from "~/components/routes/(tabs)/lessons"
import Banner from "~/components/routes/(tabs)/lessons/banner"

const LessonsTab: FC = () => {
  return (
    <SafeAreaView edges={["top", "left", "right"]} className="bg-white">
      <KeyboardAwareScrollView enabled>
        <TabsHeader />

        <View className="flex flex-col gap-6 p-4">
          <Banner />
          <Lessons />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default LessonsTab
