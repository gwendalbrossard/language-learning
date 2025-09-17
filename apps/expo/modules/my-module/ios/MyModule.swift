 import ExpoModulesCore
  import AVFoundation

  // TODO: Explore : https://www.npmjs.com/package/@mykin-ai/expo-audio-stream
  // This is a more advanced module that allows for gapless audio playback and recording
  public class MyModule: Module {
    public func definition() -> ModuleDefinition {
      Name("MyModule")

      Events("onAudioPlaybackComplete")

      Function("processAudioChunk") { (eventInfo: [String: Any]) in
        PlayAudioContinuouslyManager.shared.processAudioChunk(eventInfo: eventInfo)
      }

      Function("lastAudioChunkReceived") { [weak self] in
        PlayAudioContinuouslyManager.shared.lastAudioChunkReceived { [weak self] in
          self?.sendEvent("onAudioPlaybackComplete", [:])
        }
      }

      AsyncFunction("requestRecordingPermissions") { () -> Bool in
        return await AudioRecordingManager.shared.requestRecordingPermissions()
      }

      AsyncFunction("startRecording") { () -> Void in
        AudioRecordingManager.shared.startRecording()
      }

      AsyncFunction("stopRecording") { () -> String? in
        return await AudioRecordingManager.shared.stopRecording()
      }
    }
  }

  // MARK: - PlayAudioContinuouslyManager Implementation

  class PlayAudioContinuouslyManager: NSObject {
      static let shared = PlayAudioContinuouslyManager()

      private var audioEngine: AVAudioEngine!
      private var playerNode: AVAudioPlayerNode!
      private var audioFormat: AVAudioFormat!
      private var isPauseAudio = false
      private var audioQueue = DispatchQueue(label: "audioProcessing", qos: .userInteractive)
      private var isPlaying = false
      private var scheduledBuffersCount = 0
      private var completedBuffersCount = 0
      private var allChunksReceived = false
      private var completionCallback: (() -> Void)?

      private override init() {
          super.init()
          setupAudioEngine()
      }

      private func setupAudioEngine() {
          // Configure audio session to use speaker
          do {
              let audioSession = AVAudioSession.sharedInstance()
              try audioSession.setCategory(.playAndRecord, mode: .default, options: [.defaultToSpeaker, .allowBluetooth])
              try audioSession.overrideOutputAudioPort(.speaker)
              try audioSession.setActive(true)
          } catch {
              print("Failed to configure audio session: \(error)")
          }

          audioEngine = AVAudioEngine()
          playerNode = AVAudioPlayerNode()

          let sampleRate = Double(24000)
          audioFormat = AVAudioFormat(commonFormat: .pcmFormatFloat32, sampleRate: sampleRate, channels: 1, interleaved: false)!

          audioEngine.attach(playerNode)
          audioEngine.connect(playerNode, to: audioEngine.mainMixerNode, format: audioFormat)

          do {
              try audioEngine.start()
              playerNode.play()
              isPlaying = true
          } catch {
              print("Failed to start audio engine: \(error)")
          }
      }

      func processAudioChunk(eventInfo: [String: Any]) {
          guard let base64String = eventInfo["delta"] as? String else { return }

          // Reset state on first chunk
          if scheduledBuffersCount == 0 && completedBuffersCount == 0 {
              allChunksReceived = false
          }

          audioQueue.async { [weak self] in
              self?.processAudioData(base64String)
          }
      }

      func lastAudioChunkReceived(completion: @escaping () -> Void) {
          completionCallback = completion
          allChunksReceived = true

          // If all buffers are already complete, call completion immediately
          if scheduledBuffersCount == completedBuffersCount {
              DispatchQueue.main.async { [weak self] in
                  self?.callCompletion()
              }
          }
      }

      private func processAudioData(_ base64String: String) {
          guard !isPauseAudio,
                let pcmData = Data(base64Encoded: base64String),
                let buffer = createAudioBuffer(from: pcmData) else {
              return
          }

          scheduleBuffer(buffer)
      }

      private func createAudioBuffer(from pcmData: Data) -> AVAudioPCMBuffer? {
          let frameCount = pcmData.count / MemoryLayout<Int16>.size

          guard let buffer = AVAudioPCMBuffer(pcmFormat: audioFormat, frameCapacity: AVAudioFrameCount(frameCount)) else {
              return nil
          }

          buffer.frameLength = AVAudioFrameCount(frameCount)

          pcmData.withUnsafeBytes { rawBufferPointer in
              guard let int16Pointer = rawBufferPointer.baseAddress?.assumingMemoryBound(to: Int16.self),
                    let floatPointer = buffer.floatChannelData?[0] else {
                  return
              }

              for i in 0..<frameCount {
                  floatPointer[i] = Float(int16Pointer[i]) / 32768.0
              }
          }

          return buffer
      }

      private func scheduleBuffer(_ buffer: AVAudioPCMBuffer) {
          DispatchQueue.main.async { [weak self] in
              guard let self = self, self.isPlaying else { return }

              self.scheduledBuffersCount += 1

              self.playerNode.scheduleBuffer(buffer, at: nil, options: [], completionCallbackType: .dataPlayedBack) { [weak self] _ in
                  self?.onBufferCompleted()
              }
          }
      }

      private func onBufferCompleted() {
          DispatchQueue.main.async { [weak self] in
              guard let self = self else { return }

              self.completedBuffersCount += 1

              // If all chunks received and all buffers are complete, call completion
              if self.allChunksReceived && self.completedBuffersCount >= self.scheduledBuffersCount {
                  self.callCompletion()
              }
          }
      }

      private func callCompletion() {
          completionCallback?()
          completionCallback = nil
          // Reset for next session
          scheduledBuffersCount = 0
          completedBuffersCount = 0
      }
  }

  // MARK: - AudioRecordingManager Implementation

  class AudioRecordingManager: NSObject {
      static let shared = AudioRecordingManager()

      private var audioRecorder: AVAudioRecorder?
      private var recordingURL: URL?

      private override init() {
          super.init()
      }

      func requestRecordingPermissions() async -> Bool {
          return await withCheckedContinuation { continuation in
              AVAudioSession.sharedInstance().requestRecordPermission { granted in
                  continuation.resume(returning: granted)
              }
          }
      }

      func startRecording() {
          // Configure audio session for recording
          do {
              let audioSession = AVAudioSession.sharedInstance()
              try audioSession.setCategory(.playAndRecord, mode: .default, options: [.defaultToSpeaker, .allowBluetooth])
              try audioSession.setActive(true)
          } catch {
              print("Failed to configure audio session for recording: \(error)")
              return
          }

          // Create temporary file URL
          let documentsPath = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
          recordingURL = documentsPath.appendingPathComponent("recording_\(Date().timeIntervalSince1970).wav")

          guard let url = recordingURL else { return }

          // Configure recording settings to match the expected format
          let settings: [String: Any] = [
              AVFormatIDKey: Int(kAudioFormatLinearPCM),
              AVSampleRateKey: 24000.0,
              AVNumberOfChannelsKey: 1,
              AVLinearPCMBitDepthKey: 16,
              AVLinearPCMIsBigEndianKey: false,
              AVLinearPCMIsFloatKey: false,
              AVEncoderAudioQualityKey: AVAudioQuality.high.rawValue
          ]

          do {
              audioRecorder = try AVAudioRecorder(url: url, settings: settings)
              audioRecorder?.record()
              print("Started recording to: \(url)")
          } catch {
              print("Failed to start recording: \(error)")
          }
      }

      func stopRecording() async -> String? {
          guard let recorder = audioRecorder, let url = recordingURL else {
              return nil
          }

          recorder.stop()
          audioRecorder = nil

          // Read file and convert to base64
          do {
              let audioData = try Data(contentsOf: url)
              let base64String = audioData.base64EncodedString()

              // Clean up the temporary file
              try FileManager.default.removeItem(at: url)
              recordingURL = nil

              return base64String
          } catch {
              print("Failed to read or convert audio file: \(error)")
              return nil
          }
      }
  }