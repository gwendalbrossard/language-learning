import type { FC } from "react"
import { Pressable, Text, View } from "react-native"

import { Checkbox } from "~/ui/checkbox"
import { cn } from "~/utils/utils"

export type CheckboxWithEmojiOption = {
  id: number
  emoji: string
  label: string
}

type Props = {
  emoji: string
  label: string
  description?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

const CheckboxWithEmoji: FC<Props> = ({ emoji, label, description, checked, onCheckedChange }) => {
  const handlePress = () => onCheckedChange(!checked)

  return (
    <Pressable
      onPress={() => onCheckedChange(!checked)}
      className={cn(
        "flex flex-row items-center justify-between gap-3 rounded-xl border-2 px-4 py-1.5",
        !checked && "border-neutral-100",
        checked && "border-primary-600 bg-primary-50",
      )}
    >
      <View className="flex flex-1 flex-row items-center gap-3">
        <Text className="text-[28px] leading-9">{emoji}</Text>
        <View className="flex flex-1 flex-col">
          <Text className="text-base font-medium text-neutral-700">{label}</Text>
          {description && <Text className="text-sm font-normal leading-5 text-neutral-500">{description}</Text>}
        </View>
      </View>
      <Checkbox checked={checked} onCheckedChange={handlePress} size="md" aria-labelledby={`checkbox-${label}`} />
    </Pressable>
  )
}

export default CheckboxWithEmoji
