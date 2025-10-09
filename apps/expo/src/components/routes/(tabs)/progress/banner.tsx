import type { FC } from "react"
import { MeshGradientView } from "expo-mesh-gradient"
import { View } from "react-native"

import Share from "~/components/common/svg/share"
import * as Button from "~/ui/button"
import { Text } from "~/ui/text"

interface BannerProps {
  onShare: () => Promise<void>
}

const Banner: FC<BannerProps> = ({ onShare }) => {
  return (
    <View className="overflow-hidden rounded-2xl" style={{ boxShadow: "inset 0 0 0 3px rgba(255, 255, 255, 0.1)" }}>
      <MeshGradientView
        style={{ flex: 1 }}
        columns={3}
        rows={3}
        colors={["#00A025", "#46C867", "#00B544", "#008A06", "#46C867", "#00B544", "#007400", "#00A025", "#46C867"]}
        points={[
          [0.0, 0.0],
          [0.5, 0.0],
          [1.0, 0.0],
          [0.0, 0.5],
          [0.5, 0.5],
          [1.0, 0.5],
          [0.0, 1.0],
          [0.5, 1.0],
          [1.0, 1.0],
        ]}
      >
        <View className="flex flex-row justify-between gap-2">
          <View className="flex flex-1 flex-col gap-2 py-3 pl-4">
            <View>
              <Text className="text-xl font-bold text-white">Progress</Text>
              <Text className="text-sm text-white">Track your progress and stay motivated.</Text>
            </View>
            <Button.Root
              variant="secondary"
              size="xs"
              style={{ boxShadow: "inset 0 0 0 3px rgba(255, 255, 255, 0.1)" }}
              className="self-start"
              onPress={onShare}
            >
              <Button.Text>Share Progress</Button.Text>
              <Share width={20} height={20} color="#00A025" />
            </Button.Root>
          </View>
          <View className="flex items-center justify-center pr-2">
            <Text className="text-[85px]">🏆</Text>
          </View>
        </View>
      </MeshGradientView>
    </View>
  )
}

export default Banner
