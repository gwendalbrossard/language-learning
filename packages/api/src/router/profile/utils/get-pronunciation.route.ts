import { ZProfileUtilsGetPronunciationSchema } from "@acme/validators"

import { env } from "../../../env.server"
import { organizationProcedure } from "../../../trpc"
import { incrementProfileStats } from "../../../utils/profile"

interface SpeechAudioDelta {
  type: "speech.audio.delta"
  audio: string
}

interface SpeechAudioDone {
  type: "speech.audio.done"
  usage: {
    input_tokens: number
    output_tokens: number
    total_tokens: number
  }
}

type SpeechSSEEvent = SpeechAudioDelta | SpeechAudioDone

export const getPronunciation = organizationProcedure.input(ZProfileUtilsGetPronunciationSchema).mutation(async ({ ctx, input }) => {
  // Make raw HTTP request to get SSE stream with token usage
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: input.phrase,
      instructions: `Speak in a clear and accurate tone. The language of the phrase to be spoken is ${input.language}.`,
      stream_format: "sse",
      response_format: "mp3",
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
  }

  const audioChunks: Buffer[] = []
  let tokenUsage: SpeechAudioDone["usage"] | undefined

  // Parse SSE stream manually
  const reader = response.body?.getReader()
  const decoder = new TextDecoder()

  if (!reader) {
    throw new Error("Failed to get response stream reader")
  }

  try {
    let buffer = ""
    while (true) {
      const result = await reader.read()
      if (result.done) break

      const chunk = decoder.decode(result.value as Uint8Array, { stream: true })
      buffer += chunk
      const lines = buffer.split("\n")
      buffer = lines.pop() ?? "" // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const dataStr = line.slice(6).trim()

            if (dataStr === "[DONE]") {
              continue
            }

            const data = JSON.parse(dataStr) as SpeechSSEEvent

            switch (data.type) {
              case "speech.audio.delta": {
                const audioData = Buffer.from(data.audio, "base64")
                audioChunks.push(audioData)
                break
              }
              case "speech.audio.done": {
                tokenUsage = data.usage
                break
              }
              default: {
                throw new Error(`Unknown speech SSE event type`)
              }
            }
          } catch (parseError) {
            // Skip invalid JSON lines
            console.warn("Failed to parse SSE data:", parseError)
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }

  await incrementProfileStats({
    profileId: ctx.profile.id,
    tokensPronunciationInput: tokenUsage?.input_tokens ?? 0,
    tokensPronunciationOutput: tokenUsage?.output_tokens ?? 0,
  })

  // Combine all audio chunks
  const combinedAudio = Buffer.concat(audioChunks)

  console.log("Combined audio:", combinedAudio.length)

  // Convert to base64
  const base64 = combinedAudio.toString("base64")

  return { audioBase64: base64 }
})
