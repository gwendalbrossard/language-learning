import { registerWebModule, NativeModule } from 'expo';

import type { MyModuleEvents, AudioFormat } from './MyModule.types';

class MyModule extends NativeModule<MyModuleEvents> {
  private audioContext: AudioContext | null = null;
  private currentState: 'initialized' | 'playing' | 'paused' | 'stopped' | 'error' = 'stopped';
  private audioQueue: ArrayBuffer[] = [];
  
  initialize(format?: AudioFormat): void {
    // Format parameter acknowledged but not used in web implementation
    try {
      if (this.currentState !== 'stopped') {
        console.warn('MyModule already initialized');
        return;
      }

      // Web Audio API initialization (stored for future use)
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.currentState = 'initialized';
      
      this.emit('onStateChange', { state: 'initialized' });
      console.log('Web MyModule initialized');
    } catch (error) {
      this.currentState = 'error';
      this.emit('onError', { error: `Failed to initialize: ${error}` });
    }
  }

  enqueueBase64(base64: string): void {
    if (this.currentState !== 'initialized' && this.currentState !== 'playing') {
      this.emit('onError', { error: 'MyModule not initialized' });
      return;
    }

    try {
      // In a real implementation, you'd decode base64 to ArrayBuffer and queue it
      // For web, this is a placeholder that logs the operation
      console.log(`Web: Enqueuing ${base64.length} characters of base64 audio data`);
      
      if (this.currentState === 'initialized') {
        this.currentState = 'playing';
        this.emit('onStateChange', { state: 'playing' });
      }
    } catch (error) {
      this.emit('onError', { error: `Failed to enqueue audio: ${error}` });
    }
  }

  stop(): void {
    this.currentState = 'initialized';
    this.audioQueue = [];
    this.emit('onStateChange', { state: 'initialized' });
  }

  pause(): void {
    if (this.currentState === 'playing') {
      this.currentState = 'paused';
      this.emit('onStateChange', { state: 'paused' });
    }
  }

  resume(): void {
    if (this.currentState === 'paused') {
      this.currentState = 'playing';
      this.emit('onStateChange', { state: 'playing' });
    }
  }

  clearQueue(): void {
    this.audioQueue = [];
  }

  isInitialized(): boolean {
    return this.currentState !== 'stopped' && this.currentState !== 'error';
  }

  getState(): 'initialized' | 'playing' | 'paused' | 'stopped' | 'error' {
    return this.currentState;
  }

  getQueueSize(): number {
    return this.audioQueue.length;
  }
}

export default registerWebModule(MyModule, 'MyModule');