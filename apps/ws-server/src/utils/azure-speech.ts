import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk"

import { env } from "~/env.server"

type GetPronunciationScoreProps = {
  audio: {
    pcmData: Int16Array
    sampleRate: number
  }
  learningLanguage: string
}
export const getPronunciationScore = async ({ audio, learningLanguage }: GetPronunciationScoreProps) => {
  // Create pronunciation assessment configuration
  const pronunciationAssessmentConfig = new SpeechSDK.PronunciationAssessmentConfig(
    "", // Empty reference text for unscripted assessment
    SpeechSDK.PronunciationAssessmentGradingSystem.HundredMark,
    SpeechSDK.PronunciationAssessmentGranularity.Phoneme,
    false, // Enables miscue calculation when the pronounced words are compared to the reference text. Enabling miscue is optional. If this value is True, the ErrorType result value can be set to Omission or Insertion based on the comparison. Values are False and True. Default: False. To enable miscue calculation, set the EnableMiscue to True.
  )
  pronunciationAssessmentConfig.enableProsodyAssessment = true

  // Create speech config with Azure Speech Service credentials
  const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(env.AZURE_SPEECH_KEY, env.AZURE_SPEECH_REGION)
  speechConfig.speechRecognitionLanguage = learningLanguage

  // Create audio config using PCM data we already parsed
  // Since we already parsed the WAV file, use the PCM data directly
  const audioFormat = SpeechSDK.AudioStreamFormat.getWaveFormatPCM(audio.sampleRate, 16, 1) // 16-bit, mono

  // Create a push audio input stream
  const pushStream = SpeechSDK.AudioInputStream.createPushStream(audioFormat)

  // Write the PCM data to the stream
  const pcmBuffer = audio.pcmData.buffer.slice(audio.pcmData.byteOffset, audio.pcmData.byteOffset + audio.pcmData.byteLength) as ArrayBuffer
  pushStream.write(pcmBuffer)
  pushStream.close()

  const audioConfig = SpeechSDK.AudioConfig.fromStreamInput(pushStream)

  // Create speech recognizer
  const speechRecognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig)

  // (Optional) get the session ID
  speechRecognizer.sessionStarted = (_, e: SpeechSDK.SessionEventArgs) => {
    console.log(`PRONUNCIATION ASSESSMENT SESSION ID: ${e.sessionId}`)
  }

  // Apply pronunciation assessment configuration
  pronunciationAssessmentConfig.applyTo(speechRecognizer)

  return new Promise<SpeechSDK.PronunciationAssessmentResult>((resolve, reject) => {
    speechRecognizer.recognizeOnceAsync(
      (speechRecognitionResult: SpeechSDK.RecognitionResult) => {
        if (speechRecognitionResult.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
          // The pronunciation assessment result as a Speech SDK object
          const pronunciationAssessmentResult = SpeechSDK.PronunciationAssessmentResult.fromResult(speechRecognitionResult)

          // The pronunciation assessment result as a JSON string
          const pronunciationAssessmentResultJson = speechRecognitionResult.properties.getProperty(
            SpeechSDK.PropertyId.SpeechServiceResponse_JsonResult,
          )

          console.log(pronunciationAssessmentResultJson)
          // It's better to use this I think
          console.log(JSON.stringify(pronunciationAssessmentResult, null, 2))

          resolve(pronunciationAssessmentResult)
        } else {
          console.error("Pronunciation assessment failed:", speechRecognitionResult.reason)
          reject(new Error(`Pronunciation assessment failed: ${speechRecognitionResult.reason}`))
        }

        // Clean up resources
        speechRecognizer.close()
        speechConfig.close()
        audioConfig.close()
      },
      (error: string) => {
        console.error("Pronunciation assessment error:", error)
        // Clean up resources
        speechRecognizer.close()
        speechConfig.close()
        audioConfig.close()
        reject(new Error(`Pronunciation assessment error: ${error}`))
      },
    )
  })
}
