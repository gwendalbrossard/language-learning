import { KeyboardAwareScrollView } from "react-native-keyboard-controller"
import { SafeAreaView } from "react-native-safe-area-context"

import TabsHeader from "~/components/common/tabs/tabs-header"
import Roleplays from "~/components/routes/main/roleplay-scenarios"

export default function RoleplaysTab() {
  return (
    <SafeAreaView edges={["top", "left", "right"]} className="bg-white px-4">
      <TabsHeader />

      <KeyboardAwareScrollView bottomOffset={0} enabled>
        <Roleplays />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}
