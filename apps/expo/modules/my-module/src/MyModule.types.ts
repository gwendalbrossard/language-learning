import type { EmitterSubscription } from "react-native"

export interface AudioEventInfo {
  delta: string
}

export interface MyModuleType {
  /**
   * Process an audio chunk from event info containing base64 delta
   * @param eventInfo Object containing delta (base64 audio chunk)
   */
  processAudioChunk(eventInfo: AudioEventInfo): void

  /**
   * Signal that the last audio chunk has been received
   */
  lastAudioChunkReceived(): void

  /**
   * Add listener for audio playback completion event
   */
  addListener(eventName: 'onAudioPlaybackComplete', listener: () => void): EmitterSubscription
}
