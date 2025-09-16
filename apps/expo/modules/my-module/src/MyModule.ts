import { NativeModule, requireNativeModule } from "expo"
import type { EmitterSubscription } from "react-native"

import type { AudioEventInfo, MyModuleType } from "./MyModule.types"

declare class MyModule extends NativeModule implements MyModuleType {
  processAudioChunk(eventInfo: AudioEventInfo): void
  lastAudioChunkReceived(): void
  addListener(eventName: 'onAudioPlaybackComplete', listener: () => void): EmitterSubscription
}

// This call loads the native module object from the JSI.
export default requireNativeModule<MyModule>("MyModule")
