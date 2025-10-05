import type { FC } from "react"
import { MeshGradientView } from "expo-mesh-gradient"
import { router } from "expo-router"
import { View } from "react-native"

import Sparkles from "~/components/common/svg/sparkles"
import * as Button from "~/ui/button"
import { Text } from "~/ui/text"

const Banner: FC = () => {
  return (
    <View className="overflow-hidden rounded-2xl" style={{ boxShadow: "inset 0 0 0 3px rgba(255, 255, 255, 0.1)" }}>
      <MeshGradientView
        style={{ flex: 1 }}
        columns={3}
        rows={3}
        colors={["#9333EA", "#7C3AED", "#A855F7", "#9333EA", "#A855F7", "#A855F7", "#9333EA", "#A855F7", "#7C3AED"]}
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
              <Text className="text-xl font-bold text-white">Roleplay Mode</Text>
              <Text className="text-sm text-white">Play a roleplay and practice it in a conversation.</Text>
            </View>
            <Button.Root variant="secondary" size="xs" className="self-start" onPress={() => router.push("/create-roleplay")}>
              <Button.Text>Create Roleplay</Button.Text>
              <Sparkles width={20} height={20} color="#ad46ff" />
            </Button.Root>
          </View>
          <View className="flex items-center justify-center pr-2">
            <Text className="text-[85px]">🎭</Text>
          </View>
        </View>
      </MeshGradientView>
    </View>
  )
}

export default Banner
