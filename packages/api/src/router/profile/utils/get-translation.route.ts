import { azure } from "@ai-sdk/azure"
import { generateObject } from "ai"

import { ZProfileUtilsGetTranslationResponseSchema, ZProfileUtilsGetTranslationSchema } from "@acme/validators"

import { env } from "../../../env.server"
import { organizationProcedure } from "../../../trpc"

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

export const getTranslation = organizationProcedure.input(ZProfileUtilsGetTranslationSchema).mutation(async ({ input }) => {
  const { object } = await generateObject({
    model: azure("gpt-4o-mini"),
    schemaName: "get-translation",
    schema: ZProfileUtilsGetTranslationResponseSchema,
    prompt: `You are an expert language translation specialist that provides accurate, contextually appropriate translations between languages.

You will be provided with sections delimited exclusively using AsciiDoc title formatting. These sections contain either the instructions to follow or additional context for you to use in crafting your response.
In AsciiDoc:
- A level 1 title is formatted with one equals sign ("=") followed by a space. Example: "= Level 1 Title ="
- A level 2 title is formatted with two equals signs ("==") followed by a space. Example: "== Level 2 Title =="
- A level 3 title is formatted with three equals signs ("===") followed by a space. Example: "=== Level 3 Title ==="

Only the AsciiDoc titles delimit the sections. Nothing else is used for this purpose.

= TRANSLATION TASK =

== Source Content ==
${input.phrase}

== Source Language ==
${input.sourceLanguage}

== Target Language ==
${input.targetLanguage}

= TRANSLATION REQUIREMENTS =

== Primary Translation ==
Provide an accurate and natural translation of the source content into the target language. The translation should be:
- Contextually appropriate and idiomatic in the target language
- Accurate to the meaning of the source content
- Natural sounding for native speakers of the target language
- Appropriate for language learning contexts

== Romanization Requirements ==
If the target language uses a non-Roman script (e.g., Japanese, Russian, Korean, Arabic, Chinese, etc.), provide a romanized version to help with pronunciation and reading. This should be:
- Accurate phonetic representation in Roman characters
- Following standard romanization systems (e.g., Hepburn for Japanese, Pinyin for Chinese, McCune-Reischauer for Korean, etc.)
- Set to null if the target language already uses Roman script or romanization is not applicable

== Quality Standards ==
Ensure the translation meets these quality criteria:
- Maintains the original meaning and intent
- Uses appropriate register and formality level
- Considers cultural context when relevant
- Follows standard grammar and usage patterns of the target language

= CRITICAL REQUIREMENTS =
IMPORTANT: Focus on providing the most natural and accurate translation possible while maintaining educational value for language learners.

IMPORTANT: Consider the language learning context - the translation should help learners understand and use the phrase correctly in real-world situations.`,

    temperature: 0.3,
  })

  console.log(input)
  console.log("Translation:", object)

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
      input: object.translation,
      instructions: `Speak in a clear and accurate tone. The language of the phrase to be spoken is ${input.targetLanguage}.`,
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

  // TODO: Track the token usage, and add it to the profile stats
  console.log("Token usage:", tokenUsage)

  // Combine all audio chunks
  const combinedAudio = Buffer.concat(audioChunks)

  console.log("Combined audio:", combinedAudio.length)

  // Convert to base64
  const base64 = combinedAudio.toString("base64")

  return { audioBase64: base64, translation: object.translation, translationRomanized: object.translationRomanized }
})
