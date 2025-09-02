import type { BottomSheetModal } from "@gorhom/bottom-sheet"
import type { RefObject } from "react"
import { create } from "zustand"

export type BottomSheetJournalUpsertProps = {
  date: Date
}

export type BottomSheetDrinkUpsertProps = {
  date: Date
}

export type BottomSheetPledgeUpsertProps = {
  date: Date
}

interface BottomSheetsState {
  bottomSheetStreakRef: RefObject<BottomSheetModal | null> | null
  setBottomSheetStreakRef: (ref: RefObject<BottomSheetModal | null>) => void
}

export const useBottomSheetsStore = create<BottomSheetsState>((set) => ({
  bottomSheetStreakRef: null,
  setBottomSheetStreakRef: (ref) => set({ bottomSheetStreakRef: ref }),
}))
