import { create } from "zustand"

interface UserState {
  hasShownPaywall: boolean
  updateHasShownPaywall: (hasShownPaywall: boolean) => void
  currentOrganizationId: string | null
  updateCurrentOrganizationId: (currentOrganizationId: string | null) => void
}

export const useUserStore = create<UserState>((set) => ({
  hasShownPaywall: false,
  updateHasShownPaywall: (hasShownPaywall: boolean) => set({ hasShownPaywall }),
  currentOrganizationId: null,
  updateCurrentOrganizationId: (currentOrganizationId: string | null) => set({ currentOrganizationId }),
}))
