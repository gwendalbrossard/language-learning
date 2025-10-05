import type { FC } from "react"
import { View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"
import { SafeAreaView } from "react-native-safe-area-context"

import TabsHeader from "~/components/common/tabs/tabs-header"
import Streak from "~/components/routes/(tabs)/progress/streak"
import { Text } from "~/ui/text"

const ProgressTab: FC = () => {
  return (
    <SafeAreaView edges={["top", "left", "right"]} className="bg-white px-4">
      <KeyboardAwareScrollView enabled>
        <TabsHeader />

        <View className="flex flex-row items-center justify-between rounded-lg border border-neutral-200 px-4 py-3">
          <View className="flex flex-col gap-0.5">
            <Text className="text-lg font-semibold text-neutral-900">Progress</Text>
            <Text className="text-sm text-neutral-600">Track your progress and stay motivated.</Text>
          </View>
        </View>

        <Streak />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default ProgressTab
