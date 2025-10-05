import { forwardRef } from "react"
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet"
import { LightbulbIcon, NotepadTextIcon } from "lucide-react-native"
import { View } from "react-native"

import { BottomSheetBackdrop } from "~/ui/bottom-sheet"
import * as Button from "~/ui/button"

type Props = {
  isResponseSuggestionsLoading: boolean
  onOpenTranscript: () => void
  onOpenResponseSuggestions: () => void
}
const BottomSheetSettings = forwardRef<BottomSheetModal, Props>(
  ({ isResponseSuggestionsLoading, onOpenTranscript, onOpenResponseSuggestions }, ref) => {
    return (
      <BottomSheetModal ref={ref} backdropComponent={BottomSheetBackdrop} enablePanDownToClose stackBehavior="push">
        <BottomSheetView className="flex-1 px-4 pb-10 pt-2">
          <View className="flex flex-col gap-3">
            <Button.Root size="md" variant="secondary" onPress={onOpenTranscript} loading={true}>
              <Button.Icon icon={NotepadTextIcon} />
              <Button.Text>Transcript</Button.Text>
            </Button.Root>

            <Button.Root size="md" variant="secondary" onPress={onOpenResponseSuggestions} loading={isResponseSuggestionsLoading}>
              <Button.Icon icon={LightbulbIcon} />
              <Button.Text>Response suggestions</Button.Text>
            </Button.Root>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    )
  },
)

BottomSheetSettings.displayName = "BottomSheetSettings"

export default BottomSheetSettings
