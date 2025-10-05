import type { FC } from "react"
import { Pressable, View } from "react-native"

import type { Difficulty } from "./difficulty"
import { Text } from "~/ui/text"
import { cn } from "~/utils/utils"
import { getDifficultyIcon } from "./difficulty"

export type DifficultyIconProps = {
  difficulty: Difficulty
}

export const DifficultyIcon: FC<DifficultyIconProps> = ({ difficulty }) => {
  const Icon = getDifficultyIcon(difficulty)
  return <Icon width={16} height={16} />
}

export type FilterOptionProps = {
  title: string
  isSelected: boolean
  onPress: () => void
  leftElement?: React.ReactNode
  rightElement?: React.ReactNode
}

export const FilterOption: FC<FilterOptionProps> = ({ title, isSelected, onPress, leftElement, rightElement }) => {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "flex flex-row items-center justify-between gap-1.5 rounded-xl border-2 px-3 py-2",
        !isSelected && "border-neutral-100",
        isSelected && "border-primary-600 bg-primary-50",
      )}
    >
      {leftElement}
      <Text className={cn("text-sm font-medium", isSelected ? "text-primary-700" : "text-neutral-700")}>{title}</Text>
      {rightElement}
    </Pressable>
  )
}

export type FilterSectionProps = {
  title: string
  children: React.ReactNode
}

export const FilterSection: FC<FilterSectionProps> = ({ title, children }) => {
  return (
    <View className="flex flex-col gap-3">
      <Text className="text-base font-semibold text-neutral-900">{title}</Text>
      <View className="flex flex-row flex-wrap gap-2">{children}</View>
    </View>
  )
}
