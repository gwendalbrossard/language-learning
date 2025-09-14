package expo.modules.mymodule

import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioManager
import android.media.AudioTrack
import android.util.Base64
import android.util.Log
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.util.concurrent.LinkedBlockingQueue

class MyModule : Module() {
  private var audioTrack: AudioTrack? = null
  private val audioQueue = LinkedBlockingQueue<ByteArray>()
  private var currentState = "stopped"
  private var isPaused = false
  private val coroutineScope = CoroutineScope(Dispatchers.IO)
  private val stateLock = Any()

  companion object {
    private const val TAG = "MyModule"
    private const val DEFAULT_SAMPLE_RATE = 24000
    private const val DEFAULT_CHANNEL_CONFIG = AudioFormat.CHANNEL_OUT_MONO
    private const val DEFAULT_AUDIO_FORMAT = AudioFormat.ENCODING_PCM_16BIT
  }

  override fun definition() = ModuleDefinition {
    Name("MyModule")

    Events("onStateChange", "onError")

    Function("test") {
      "MyModule Android test successful"
    }

    Function("playAudio") { eventInfo: Map<String, Any> ->
      playAudioChunk(eventInfo)
    }

    // Initialize with optional format
    Function("initialize") { formatMap: Map<String, Any>? ->
      initializeAudioTrack(formatMap)
    }

    // Enqueue base64 PCM audio data
    Function("enqueueBase64") { base64: String ->
      enqueueBase64Audio(base64)
    }

    // Playback controls
    Function("stop") {
      stopPlayback()
    }

    Function("pause") {
      pausePlayback()
    }

    Function("resume") {
      resumePlayback()
    }

    Function("clearQueue") {
      clearAudioQueue()
    }

    // Status functions
    Function("isInitialized") {
      currentState != "stopped" && currentState != "error"
    }

    Function("getState") {
      currentState
    }

    Function("getQueueSize") {
      audioQueue.size
    }
  }

  private fun initializeAudioTrack(formatMap: Map<String, Any>?) {
    try {
      synchronized(stateLock) {
        if (currentState != "stopped") {
          Log.d(TAG, "MyModule already initialized")
          return
        }
        setState("initializing")
      }

      // Parse format or use defaults
      val sampleRate = (formatMap?.get("sampleRate") as? Double)?.toInt() ?: DEFAULT_SAMPLE_RATE
      val channels = (formatMap?.get("channels") as? Double)?.toInt() ?: 1
      val bitDepth = (formatMap?.get("bitDepth") as? Double)?.toInt() ?: 16
      
      val channelConfig = if (channels == 1) AudioFormat.CHANNEL_OUT_MONO else AudioFormat.CHANNEL_OUT_STEREO
      val audioFormat = when (bitDepth) {
        24 -> AudioFormat.ENCODING_PCM_24BIT_PACKED
        32 -> AudioFormat.ENCODING_PCM_32BIT
        else -> AudioFormat.ENCODING_PCM_16BIT
      }
      
      val bufferSize = AudioTrack.getMinBufferSize(
        sampleRate,
        channelConfig,
        audioFormat
      )

      audioTrack = AudioTrack.Builder()
        .setAudioAttributes(
          AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_MEDIA)
            .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
            .build()
        )
        .setAudioFormat(
          AudioFormat.Builder()
            .setSampleRate(sampleRate)
            .setChannelMask(channelConfig)
            .setEncoding(audioFormat)
            .build()
        )
        .setBufferSizeInBytes(bufferSize * 6) // Even larger buffer for smoother playback
        .setTransferMode(AudioTrack.MODE_STREAM)
        .build()

      audioTrack?.play()
      
      // Start audio processing coroutine
      startAudioProcessing()
      
      setState("initialized")
      Log.d(TAG, "MyModule initialized successfully")
    } catch (e: Exception) {
      sendError("Failed to initialize MyModule: ${e.message}")
    }
  }

  private fun playAudioChunk(eventInfo: Map<String, Any>) {
    // Auto-initialize if not already initialized
    if (currentState == "stopped") {
      initializeAudioTrack(null)
    }
    
    val base64String = eventInfo["delta"] as? String ?: ""
    if (base64String.isNotEmpty()) {
      enqueueBase64Audio(base64String)
    }
  }

  private fun enqueueBase64Audio(base64: String) {
    synchronized(stateLock) {
      if (currentState != "initialized" && currentState != "playing" && currentState != "paused") {
        sendError("MyModule not initialized")
        return
      }
    }

    try {
      val audioData = Base64.decode(base64, Base64.DEFAULT)
      audioQueue.offer(audioData)
      
      synchronized(stateLock) {
        if (currentState == "initialized" && !isPaused) {
          setState("playing")
        }
      }
    } catch (e: Exception) {
      sendError("Failed to decode base64 audio data: ${e.message}")
    }
  }

  private fun startAudioProcessing() {
    coroutineScope.launch {
      while (currentState != "stopped" && currentState != "error") {
        try {
          val audioData = audioQueue.take() // Blocks until data is available
          
          // Wait if paused
          while (isPaused && currentState != "stopped") {
            Thread.sleep(50) // Reduced sleep time for more responsive pause/resume
          }
          
          if (currentState != "stopped" && currentState != "error") {
            val bytesWritten = audioTrack?.write(audioData, 0, audioData.size, AudioTrack.WRITE_NON_BLOCKING) ?: 0
            
            // If we couldn't write all data immediately, use blocking write for remainder
            if (bytesWritten < audioData.size && bytesWritten >= 0) {
              audioTrack?.write(audioData, bytesWritten, audioData.size - bytesWritten)
            }
          }
        } catch (e: InterruptedException) {
          Log.d(TAG, "Audio processing interrupted")
          break
        } catch (e: Exception) {
          sendError("Error writing audio data: ${e.message}")
          break
        }
      }
    }
  }

  private fun stopPlayback() {
    synchronized(stateLock) {
      if (currentState == "stopped") return
      
      isPaused = false
      audioQueue.clear()
      
      audioTrack?.let { track ->
        try {
          track.stop()
          track.flush()
          track.play() // Restart for next use
          setState("initialized")
          Log.d(TAG, "MyModule reset for next use")
        } catch (e: Exception) {
          sendError("Failed to reset AudioTrack: ${e.message}")
        }
      }
    }
  }
  
  private fun pausePlayback() {
    synchronized(stateLock) {
      if (currentState != "playing") return
      isPaused = true
      audioTrack?.pause()
      setState("paused")
    }
  }
  
  private fun resumePlayback() {
    synchronized(stateLock) {
      if (currentState != "paused") return
      isPaused = false
      audioTrack?.play()
      setState("playing")
    }
  }
  
  private fun clearAudioQueue() {
    audioQueue.clear()
  }
  
  private fun setState(newState: String) {
    currentState = newState
    sendEvent("onStateChange", mapOf(
      "state" to newState
    ))
  }
  
  private fun sendError(message: String) {
    currentState = "error"
    sendEvent("onError", mapOf(
      "error" to message
    ))
    Log.e(TAG, message)
  }

  override fun onDestroy() {
    super.onDestroy()
    synchronized(stateLock) {
      currentState = "stopped"
      isPaused = false
      audioQueue.clear()
      
      audioTrack?.let { track ->
        try {
          track.stop()
          track.release()
        } catch (e: Exception) {
          Log.e(TAG, "Error releasing AudioTrack: ${e.message}")
        }
      }
      audioTrack = null
    }
  }
}