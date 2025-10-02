// Helper function to calculate audio duration from PCM16 audio data
export const calculateAudioDuration = (audioBuffer: Int16Array, sampleRate = 24000): number => {
  // PCM16 audio duration = number of samples / sample rate
  const durationSeconds = audioBuffer.length / sampleRate
  return durationSeconds
}

// Helper function to parse WAV header and extract PCM data
export const parseWAVFile = (wavBuffer: ArrayBuffer): { pcmData: Int16Array; sampleRate: number; channels: number; bitsPerSample: number } => {
  const view = new DataView(wavBuffer)

  // Check RIFF header
  const riff = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3))
  if (riff !== "RIFF") {
    console.error("Invalid WAV file: missing RIFF header")
    return { pcmData: new Int16Array(0), sampleRate: 24000, channels: 1, bitsPerSample: 16 }
  }

  // Check WAVE header
  const wave = String.fromCharCode(view.getUint8(8), view.getUint8(9), view.getUint8(10), view.getUint8(11))
  if (wave !== "WAVE") {
    console.error("Invalid WAV file: missing WAVE header")
    return { pcmData: new Int16Array(0), sampleRate: 24000, channels: 1, bitsPerSample: 16 }
  }

  // Find fmt chunk (usually at offset 12)
  let offset = 12
  while (offset < wavBuffer.byteLength - 8) {
    const chunkId = String.fromCharCode(view.getUint8(offset), view.getUint8(offset + 1), view.getUint8(offset + 2), view.getUint8(offset + 3))
    const chunkSize = view.getUint32(offset + 4, true) // little endian

    if (chunkId === "fmt ") {
      // Parse format chunk
      const _audioFormat = view.getUint16(offset + 8, true)
      const channels = view.getUint16(offset + 10, true)
      const sampleRate = view.getUint32(offset + 12, true)
      const bitsPerSample = view.getUint16(offset + 22, true)

      // Find data chunk
      let dataOffset = offset + 8 + chunkSize
      while (dataOffset < wavBuffer.byteLength - 8) {
        const dataChunkId = String.fromCharCode(
          view.getUint8(dataOffset),
          view.getUint8(dataOffset + 1),
          view.getUint8(dataOffset + 2),
          view.getUint8(dataOffset + 3),
        )
        const dataSize = view.getUint32(dataOffset + 4, true)

        if (dataChunkId === "data") {
          // Extract PCM data
          const pcmData = new Int16Array(wavBuffer, dataOffset + 8, dataSize / 2) // divide by 2 for 16-bit samples
          return { pcmData, sampleRate, channels, bitsPerSample }
        }

        dataOffset += 8 + dataSize
      }

      console.error("Data chunk not found in WAV file")
      return { pcmData: new Int16Array(0), sampleRate, channels, bitsPerSample }
    }

    offset += 8 + chunkSize
  }

  console.error("fmt chunk not found in WAV file")
  return { pcmData: new Int16Array(0), sampleRate: 24000, channels: 1, bitsPerSample: 16 }
}
