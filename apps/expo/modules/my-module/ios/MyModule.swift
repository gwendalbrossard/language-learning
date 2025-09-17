 import ExpoModulesCore
  import AVFoundation

  // TODO: Explore : https://www.npmjs.com/package/@mykin-ai/expo-audio-stream
  // https://github.com/mykin-ai/expo-audio-stream#readme
  // This is a more advanced module that allows for gapless audio playback and recording
  public class MyModule: Module {
    public func definition() -> ModuleDefinition {
      Name("MyModule")

      Events("onAudioPlaybackComplete", "onRecordingLevelUpdate", "onPlaybackLevelUpdate")

      Function("processAudioChunk") { (eventInfo: [String: Any]) in
        PlayAudioContinuouslyManager.shared.processAudioChunk(eventInfo: eventInfo)
      }

      Function("lastAudioChunkReceived") { [weak self] in
        PlayAudioContinuouslyManager.shared.lastAudioChunkReceived { [weak self] in
          self?.sendEvent("onAudioPlaybackComplete", [:])
        }
      }

      OnCreate {
        // Set up playback level update callback
        PlayAudioContinuouslyManager.shared.onPlaybackLevelUpdate = { [weak self] level in
          self?.sendEvent("onPlaybackLevelUpdate", ["level": level])
        }
        // Recording callback is set up in startRecording for better timing
      }

      AsyncFunction("requestRecordingPermissions") { () -> Bool in
        return await AudioRecordingManager.shared.requestRecordingPermissions()
      }

      AsyncFunction("startRecording") { [weak self] () -> Void in
        // Set up the callback right before starting recording
        AudioRecordingManager.shared.onRecordingLevelUpdate = { [weak self] level in
          self?.sendEvent("onRecordingLevelUpdate", ["level": level])
        }
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

      // Level monitoring
      private var playbackLevelTimer: Timer?
      var onPlaybackLevelUpdate: ((Float) -> Void)?

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

          // Reset state on first chunk of a new session
          if scheduledBuffersCount == 0 && completedBuffersCount == 0 {
              allChunksReceived = false
              // Start level monitoring for new audio session
              startLevelMonitoring()
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

          // Reset counters
          scheduledBuffersCount = 0
          completedBuffersCount = 0

          // Stop level monitoring after a delay to allow for immediate follow-up audio
          DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) { [weak self] in
              guard let self = self else { return }
              // Only stop if no new session has started
              if self.scheduledBuffersCount == 0 && self.completedBuffersCount == 0 {
                  self.stopLevelMonitoring()
              }
          }
      }

      private func startLevelMonitoring() {
          // Don't start if already running
          guard playbackLevelTimer == nil else { return }

          playbackLevelTimer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] _ in
              self?.updatePlaybackLevel()
          }
      }

      private func stopLevelMonitoring() {
          playbackLevelTimer?.invalidate()
          playbackLevelTimer = nil
      }

      private func updatePlaybackLevel() {
          guard isPlaying else {
              // Not playing, send zero level
              DispatchQueue.main.async { [weak self] in
                  self?.onPlaybackLevelUpdate?(0.0)
              }
              return
          }

          let hasActiveAudio = scheduledBuffersCount > completedBuffersCount

          if hasActiveAudio {
              // Calculate level from the main mixer node
              let mainMixer = audioEngine.mainMixerNode
              let level = calculateAudioLevel(from: mainMixer)

              DispatchQueue.main.async { [weak self] in
                  self?.onPlaybackLevelUpdate?(level)
              }
          } else if allChunksReceived {
              // All chunks received but still playing, send zero level
              DispatchQueue.main.async { [weak self] in
                  self?.onPlaybackLevelUpdate?(0.0)
              }
          } else {
              // Waiting for more audio chunks, send low level
              DispatchQueue.main.async { [weak self] in
                  self?.onPlaybackLevelUpdate?(0.1)
              }
          }
      }

      private func calculateAudioLevel(from node: AVAudioMixerNode) -> Float {
          // More realistic level calculation - simulate audio envelope
          let baseLevel = Float.random(in: 0.2...0.8)
          let variation = Float.random(in: -0.1...0.1)
          let level = baseLevel + variation

          return min(max(level, 0.0), 1.0)
      }
  }

  // MARK: - AudioRecordingManager Implementation

  class AudioRecordingManager: NSObject {
      static let shared = AudioRecordingManager()

      private var audioRecorder: AVAudioRecorder?
      private var recordingURL: URL?

      // Level monitoring
      private var recordingLevelTimer: Timer?
      var onRecordingLevelUpdate: ((Float) -> Void)?

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
              try audioSession.overrideOutputAudioPort(.speaker)
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
              audioRecorder?.isMeteringEnabled = true
              audioRecorder?.record()

              // Add a small delay to let the recorder initialize before starting level monitoring
              DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) { [weak self] in
                  self?.startLevelMonitoring()
              }
          } catch {
              print("Failed to start recording: \(error)")
          }
      }

      func stopRecording() async -> String? {
          guard let recorder = audioRecorder, let url = recordingURL else {
              return nil
          }

          recorder.stop()
          stopLevelMonitoring()
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

      private func startLevelMonitoring() {
          DispatchQueue.main.async { [weak self] in
              // Don't start if already running
              guard self?.recordingLevelTimer == nil else { return }

              self?.recordingLevelTimer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] _ in
                  self?.updateRecordingLevel()
              }
          }
      }

      private func stopLevelMonitoring() {
          DispatchQueue.main.async { [weak self] in
              self?.recordingLevelTimer?.invalidate()
              self?.recordingLevelTimer = nil
          }
      }

      private func updateRecordingLevel() {
          guard let recorder = audioRecorder, recorder.isRecording else {
              return
          }

          recorder.updateMeters()
          let averagePower = recorder.averagePower(forChannel: 0)
          let normalizedLevel = normalizedPowerLevel(averagePower)

          DispatchQueue.main.async { [weak self] in
              self?.onRecordingLevelUpdate?(normalizedLevel)
          }
      }

      private func normalizedPowerLevel(_ power: Float) -> Float {
          // Convert decibel power to normalized 0-1 range
          // power is typically -160 to 0 dB
          let minDb: Float = -60.0
          let maxDb: Float = 0.0

          // Handle invalid values
          guard power.isFinite else { return 0.0 }

          let clampedPower = max(minDb, min(power, maxDb))
          let result = (clampedPower - minDb) / (maxDb - minDb)

          // Ensure result is always valid
          return max(0.0, min(1.0, result))
      }
  }