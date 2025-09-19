import type { FC } from "react"
import * as RadioGroupPrimitive from "@rn-primitives/radio-group"
import { Pressable, Text, View } from "react-native"

import { cn } from "~/utils/utils"

type Props = {
  emoji: string
  label: string
  description?: string
  value: string
  checked: boolean
  onCheckedChange: (value: string) => void
}

const RadioItemWithEmoji: FC<Props> = ({ emoji, label, description, value, checked, onCheckedChange }) => {
  return (
    <Pressable
      onPress={() => onCheckedChange(value)}
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

      <RadioGroupPrimitive.Item
        value={value}
        aria-labelledby={`${value}-label`}
        className={cn(
          "flex size-5 items-center justify-center rounded-full border-2",
          !checked && "border-neutral-100",
          checked && "border-primary-600 bg-primary-600",
        )}
      >
        <RadioGroupPrimitive.Indicator className="size-2.5 rounded-full bg-white" />
      </RadioGroupPrimitive.Item>
    </Pressable>
  )
}

export default RadioItemWithEmoji
