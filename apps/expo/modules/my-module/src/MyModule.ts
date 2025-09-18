import type { EmitterSubscription } from "react-native"
import { NativeModule, requireNativeModule } from "expo"

import type { AudioEventInfo, LevelUpdateEvent, MyModuleType } from "./MyModule.types"

declare class MyModule extends NativeModule implements MyModuleType {
  processAudioChunk(eventInfo: AudioEventInfo): void
  lastAudioChunkReceived(): void
  addListener(eventName: "onAudioPlaybackComplete", listener: () => void): EmitterSubscription
  addListener(eventName: "onRecordingLevelUpdate", listener: (event: LevelUpdateEvent) => void): EmitterSubscription
  addListener(eventName: "onPlaybackLevelUpdate", listener: (event: LevelUpdateEvent) => void): EmitterSubscription
  requestRecordingPermissions(): Promise<boolean>
  startRecording(): Promise<void>
  stopRecording(): Promise<string | null>
}

// This call loads the native module object from the JSI.
export default requireNativeModule<MyModule>("MyModule")
