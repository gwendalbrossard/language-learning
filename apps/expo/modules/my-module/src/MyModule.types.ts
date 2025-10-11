import type { EmitterSubscription } from "react-native"

export interface AudioEventInfo {
  delta: string
}

export interface SimpleAudioInfo {
  audio: string
}

export interface LevelUpdateEvent {
  level: number
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
  addListener(eventName: "onAudioPlaybackComplete", listener: () => void): EmitterSubscription

  /**
   * Add listener for recording level updates
   */
  addListener(eventName: "onRecordingLevelUpdate", listener: (event: LevelUpdateEvent) => void): EmitterSubscription

  /**
   * Add listener for playback level updates
   */
  addListener(eventName: "onPlaybackLevelUpdate", listener: (event: LevelUpdateEvent) => void): EmitterSubscription

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

  /**
   * Play a complete audio file directly (no streaming, no level monitoring)
   * @param audioInfo Object containing audio (base64 audio data)
   */
  playAudio(audioInfo: SimpleAudioInfo): void
}
