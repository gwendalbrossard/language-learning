export interface AudioEventInfo {
  delta: string
}

export interface MyModuleType {
  /**
   * Play audio from event info containing base64 delta
   * @param eventInfo Object containing delta (base64 audio) and optional index
   */
  playAudio(eventInfo: AudioEventInfo): void
}
