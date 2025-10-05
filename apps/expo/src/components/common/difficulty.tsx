import type { SvgProps } from "react-native-svg"

import Easy from "./svg/filters/difficulties/easy"
import Hard from "./svg/filters/difficulties/hard"
import Medium from "./svg/filters/difficulties/medium"

export type Difficulty = 1 | 2 | 3
export const difficulties: Difficulty[] = [1, 2, 3]

export const getDifficultyName = (difficulty: Difficulty): string => {
  const names = {
    1: "Easy",
    2: "Medium",
    3: "Hard",
  }

  const name = names[difficulty as keyof typeof names]
  if (!name) throw new Error(`Unknown difficulty level: ${difficulty}`)
  return name
}

export const getDifficultyIcon = (difficulty: Difficulty): ((props: SvgProps) => React.JSX.Element) => {
  switch (difficulty) {
    case 1:
      return Easy
    case 2:
      return Medium
    case 3:
      return Hard
  }
}
