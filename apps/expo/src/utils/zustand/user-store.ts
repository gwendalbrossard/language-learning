import { create } from "zustand"

interface UserState {
  hasShownPaywall: boolean
  setHasShownPaywall: (hasShownPaywall: boolean) => void
}

export const useUserStore = create<UserState>((set) => ({
  hasShownPaywall: false,
  setHasShownPaywall: (hasShownPaywall: boolean) => set({ hasShownPaywall }),
}))
