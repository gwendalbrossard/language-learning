import type { FC } from "react"
import { View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"
import { SafeAreaView } from "react-native-safe-area-context"

import TabsHeader from "~/components/common/tabs/tabs-header"
import Lessons from "~/components/routes/(tabs)/lessons"
import { Text } from "~/ui/text"

const LessonsTab: FC = () => {
  return (
    <SafeAreaView edges={["top", "left", "right"]} className="bg-white px-4">
      <KeyboardAwareScrollView enabled>
        <TabsHeader />

        <View className="flex flex-row items-center justify-between rounded-lg border border-neutral-200 px-4 py-3">
          <View className="flex flex-col gap-0.5">
            <Text className="text-lg font-semibold text-neutral-900">Lesson Mode</Text>
            <Text className="text-sm text-neutral-600">Learn new vocabulary and practice it in a conversation.</Text>
          </View>
        </View>

        <Lessons />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default LessonsTab
