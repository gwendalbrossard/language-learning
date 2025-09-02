import { useEffect, useState } from "react"
import Purchases from "react-native-purchases"

type Entitlement = { loaded: boolean; isUnlimited: boolean }

export const useRevenueCat = () => {
  const [entitlement, setEntitlement] = useState<Entitlement>({ loaded: false, isUnlimited: false })

  const checkIsUnlimited = async () => {
    // For testing - Free user check
    // setEntitlement({ loaded: true, isUnlimited: true })
    // return

    const customerInfo = await Purchases.getCustomerInfo()

    const hasActiveUnlimitedEntitlement = Object.entries(customerInfo.entitlements.active).some(
      ([key, entitlement]) => key === "Unlimited" && entitlement.isActive,
    )
    setEntitlement({ loaded: true, isUnlimited: hasActiveUnlimitedEntitlement })
  }

  Purchases.addCustomerInfoUpdateListener((_customerInfo) => {
    void checkIsUnlimited()
  })

  useEffect(() => {
    void checkIsUnlimited()
  }, [])

  return { entitlement }
}
