import type { Organization } from "@acme/db"

export const isUnlimited = (organization: Organization): boolean => {
  if (!organization.revenueCatCustomer) return false

  const customer = organization.revenueCatCustomer as Customer
  return customer.active_entitlements.items.some((entitlement) => entitlement.entitlement_id === "entlefdcd3a564")
}

type ActiveEntitlement = {
  object: string
  expires_at: number
  entitlement_id: string
}

type ActiveEntitlements = {
  url: string
  items: ActiveEntitlement[]
  object: string
  next_page: string | null
}

type Customer = {
  id: string
  object: string
  experiment: unknown
  project_id: string
  last_seen_at: number
  first_seen_at: number
  active_entitlements: ActiveEntitlements
}
