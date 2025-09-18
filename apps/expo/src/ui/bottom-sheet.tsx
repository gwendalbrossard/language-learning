import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet"
import { BottomSheetBackdrop as BottomSheetBackdropPrimitive } from "@gorhom/bottom-sheet"

export const BottomSheetBackdrop = (props: BottomSheetBackdropProps) => (
  <BottomSheetBackdropPrimitive {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
)
