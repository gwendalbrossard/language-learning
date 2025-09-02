import type { FC } from "react"
import { XIcon } from "lucide-react-native"
import { Pressable } from "react-native"

type Props = {
  onPress: () => void
}
export const HeaderRight: FC<Props> = ({ onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <XIcon className="-mr-1 text-neutral-500" />
    </Pressable>
  )
}
