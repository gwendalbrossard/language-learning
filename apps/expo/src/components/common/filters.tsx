import type { FC } from "react"
import { Star } from "lucide-react-native"
import { Pressable, View } from "react-native"

import { Text } from "~/ui/text"
import { cn } from "~/utils/utils"

export type DifficultyStarsProps = {
  difficulty: number
  maxStars?: number
}

export const DifficultyStars: FC<DifficultyStarsProps> = ({ difficulty, maxStars = 3 }) => {
  const stars = []

  for (let i = 1; i <= maxStars; i++) {
    const isFilled = i <= difficulty
    stars.push(<Star key={i} size={14} fill={isFilled ? "#F59E0B" : "transparent"} color={isFilled ? "#F59E0B" : "#D1D5DB"} strokeWidth={1.5} />)
  }

  return <View className="flex flex-row items-center gap-0.5">{stars}</View>
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
