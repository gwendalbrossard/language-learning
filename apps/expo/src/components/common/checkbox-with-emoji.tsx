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
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

const CheckboxWithEmoji: FC<Props> = ({ emoji, label, checked, onCheckedChange }) => {
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
        <Text className="flex-1 flex-wrap text-base font-medium text-neutral-700">{label}</Text>
      </View>
      <Checkbox checked={checked} onCheckedChange={handlePress} size="md" aria-labelledby={`checkbox-${label}`} />
    </Pressable>
  )
}

export default CheckboxWithEmoji
