import type { FC } from "react"
import { Pressable, View } from "react-native"

import Easy from "~/components/common/svg/filters/difficulties/easy"
import Hard from "~/components/common/svg/filters/difficulties/hard"
import Medium from "~/components/common/svg/filters/difficulties/medium"
import { Text } from "~/ui/text"
import { cn } from "~/utils/utils"

// Shared filter constants and utilities
export const difficulties = [1, 2, 3]

export const getDifficultyName = (difficulty: number): string => {
  const names = {
    1: "Easy",
    2: "Medium",
    3: "Hard",
  }

  const name = names[difficulty as keyof typeof names]
  if (!name) throw new Error(`Unknown difficulty level: ${difficulty}`)
  return name
}

export type DifficultyStarsProps = {
  difficulty: number
  maxStars?: number
}

export const DifficultyIcon: FC<DifficultyStarsProps> = ({ difficulty }) => {
  const getDifficultyIcon = () => {
    switch (difficulty) {
      case 1:
        return <Easy width={16} height={16} />
      case 2:
        return <Medium width={16} height={16} />
      case 3:
        return <Hard width={16} height={16} />
      default:
        throw new Error(`Unknown difficulty level: ${difficulty}`)
    }
  }

  return <View className="flex flex-row items-center">{getDifficultyIcon()}</View>
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
