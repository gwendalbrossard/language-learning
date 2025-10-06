import type { FC } from "react"
import { View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"
import { SafeAreaView } from "react-native-safe-area-context"

import TabsHeader from "~/components/common/tabs/tabs-header"
import Banner from "~/components/routes/(tabs)/roleplays/banner"
import Roleplays from "~/components/routes/(tabs)/roleplays/roleplays"

const RoleplaysTab: FC = () => {
  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-white">
      <KeyboardAwareScrollView enabled>
        <TabsHeader />

        <View className="flex flex-col gap-6 p-4">
          <Banner />
          <Roleplays />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default RoleplaysTab
