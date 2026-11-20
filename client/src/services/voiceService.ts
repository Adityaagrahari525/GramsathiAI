export interface VoiceRecognitionOptions {
  language: 'mr' | 'en' | 'hi';
  onStart?: () => void;
  onResult: (transcript: string) => void;
  onError?: (errorMessage: string) => void;
  onEnd?: () => void;
}

export interface VoiceServiceState {
  isSupported: boolean;
  isListening: boolean;
  synthSupported: boolean;
}

export class BrowserVoiceService {
  /**
   * Checks whether the standard Web Speech API (SpeechRecognition) is supported in this browser.
   */
  public static isSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }

  /**
   * Checks whether SpeechSynthesis (Text-to-Speech) is supported.
   */
  public static isSpeechSynthesisSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'speechSynthesis' in window;
  }

  /**
   * Start listening using native Web Speech API without third-party dependencies.
   */
  public static startListening(options: VoiceRecognitionOptions): { stop: () => void } | null {
    if (!this.isSpeechRecognitionSupported()) {
      if (options.onError) {
        options.onError(
          'Browser Speech Recognition is not supported on this browser. Voice controls require Google Chrome or Microsoft Edge.'
        );
      }
      return null;
    }

    try {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionClass();

      // Set language code
      recognition.lang =
        options.language === 'mr'
          ? 'mr-IN'
          : options.language === 'hi'
          ? 'hi-IN'
          : 'en-IN';

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        if (options.onStart) options.onStart();
      };

      recognition.onresult = (event: any) => {
        if (event.results && event.results.length > 0) {
          const transcript = event.results[0][0]?.transcript || '';
          if (transcript.trim()) {
            options.onResult(transcript.trim());
          }
        }
      };

      recognition.onerror = (event: any) => {
        let msg = 'Voice recognition error occurred. Please try speaking again.';
        if (event.error === 'not-allowed') {
          msg = 'Microphone permission was denied. Please allow microphone access in your browser.';
        } else if (event.error === 'no-speech') {
          msg = 'No speech was detected. Please click the mic and speak clearly.';
        } else if (event.error === 'network') {
          msg = 'Network issue with speech recognition service. Please check your connection.';
        }
        if (options.onError) options.onError(msg);
      };

      recognition.onend = () => {
        if (options.onEnd) options.onEnd();
      };

      recognition.start();

      return {
        stop: () => {
          try {
            recognition.stop();
          } catch {
            // Already stopped
          }
        },
      };
    } catch (err: any) {
      if (options.onError) {
        options.onError(err?.message || 'Failed to start speech recognition.');
      }
      return null;
    }
  }

  /**
   * Speak text out loud using native browser SpeechSynthesis.
   */
  public static speak(text: string, language: 'mr' | 'en' | 'hi', onEnd?: () => void): boolean {
    if (!this.isSpeechSynthesisSupported()) return false;

    try {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95; // Slightly slower for clarity
      if (onEnd) {
        utterance.onend = onEnd;
        utterance.onerror = onEnd;
      }
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err) {
      console.warn('Speech synthesis error:', err);
      return false;
    }
  }

  /**
   * Stop any current speech playback.
   */
  public static stopSpeaking(): void {
    if (this.isSpeechSynthesisSupported()) {
      window.speechSynthesis.cancel();
    }
  }
}
