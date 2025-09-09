import * as SecureStore from "expo-secure-store"

const key = "bearer_token"
export const getBearerToken = () => SecureStore.getItem(key)
export const deleteBearerToken = () => SecureStore.deleteItemAsync(key)
export const setBearerToken = (v: string) => SecureStore.setItem(key, v)
