import { createContext, useContext, useRef } from "react"
import { createStore, useStore } from "zustand"
import { persist } from "zustand/middleware"

import type { RouterOutputs } from "@acme/api"

type DashboardProps = {
  currentOrganizationId: string
  organizations: RouterOutputs["organization"]["me"]
}

type DashboardState = DashboardProps & {
  updateCurrentOrganizationId: (currentOrganizationId: string) => void
}

type DashboardStore = ReturnType<typeof createDashboardStore>

const createDashboardStore = (initProps: DashboardProps) => {
  return createStore<DashboardState>()(
    persist(
      (set) => ({
        ...initProps,
        updateCurrentOrganizationId: (currentOrganizationId) => set((state) => ({ ...state, currentOrganizationId })),
      }),
      {
        name: "dashboard-storage",
        onRehydrateStorage: (_state) => {
          return (state, error) => {
            if (error) {
              console.error("Error rehydrating dashboard store:", error)
            } else if (state) {
              // Check if the persisted currentOrganizationId is valid
              const isValidOrganization = initProps.organizations.some((w) => w.id === state.currentOrganizationId)
              if (!isValidOrganization) {
                // If not valid, use the first organization from the provided list
                state.currentOrganizationId = initProps.organizations[0]?.id ?? ""
              }
            }
          }
        },
      },
    ),
  )
}

export const DashboardContext = createContext<DashboardStore | null>(null)

type DashboardProviderProps = React.PropsWithChildren<DashboardProps>

function DashboardProvider({ children, ...props }: DashboardProviderProps) {
  const storeRef = useRef<DashboardStore>(undefined)
  storeRef.current ??= createDashboardStore(props)

  return <DashboardContext.Provider value={storeRef.current}>{children}</DashboardContext.Provider>
}

function useDashboardContext<T>(selector: (state: DashboardState) => T): T {
  const store = useContext(DashboardContext)
  if (!store) throw new Error("Missing DashboardContext.Provider in the tree")
  return useStore(store, selector)
}

export { DashboardProvider, useDashboardContext, type DashboardProps }
