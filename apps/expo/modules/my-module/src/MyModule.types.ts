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

  /**
   * Request recording permissions from the user
   * @returns Promise that resolves to true if granted, false otherwise
   */
  requestRecordingPermissions(): Promise<boolean>

  /**
   * Start audio recording
   */
  startRecording(): Promise<void>

  /**
   * Stop audio recording and return base64 encoded audio data
   * @returns Promise that resolves to base64 audio string or null if failed
   */
  stopRecording(): Promise<string | null>
}
