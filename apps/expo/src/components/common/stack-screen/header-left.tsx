import type { FC, ReactNode } from "react"
import { ChevronLeftIcon } from "lucide-react-native"
import { Pressable } from "react-native"

import { TextClassContext } from "~/ui/text"

type Props = {
  onPress: () => void
  children?: ReactNode
}
export const HeaderLeft: FC<Props> = ({ onPress, children }) => {
  return (
    <TextClassContext.Provider value="text-neutral-600">
      <Pressable onPress={onPress} className="flex flex-row items-center gap-1">
        <ChevronLeftIcon className="-ml-1 text-neutral-600" />
        {children}
      </Pressable>
    </TextClassContext.Provider>
  )
}
