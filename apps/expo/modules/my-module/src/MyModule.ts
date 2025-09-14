import { NativeModule, requireNativeModule } from "expo"

import type { AudioEventInfo, MyModuleType } from "./MyModule.types"

declare class MyModule extends NativeModule implements MyModuleType {
  test(): string
  playAudio(eventInfo: AudioEventInfo): void
}

// This call loads the native module object from the JSI.
export default requireNativeModule<MyModule>("MyModule")