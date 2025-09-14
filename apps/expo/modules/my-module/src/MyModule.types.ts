export interface AudioEventInfo {
  delta: string;
  index?: number;
}

export interface MyModuleType {
  /**
   * Test function to verify module is working
   */
  test(): string;

  /**
   * Play audio from event info containing base64 delta
   * @param eventInfo Object containing delta (base64 audio) and optional index
   */
  playAudio(eventInfo: AudioEventInfo): void;
}