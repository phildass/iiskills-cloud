/**
 * Voice Utilities - Web Speech API helpers
 * Handles speech recognition (STT) and speech synthesis (TTS)
 */

export class VoiceManager {
  constructor() {
    this.recognition = null;
    this.synthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.isListening = false;
    this.isSpeaking = false;
    this.onResult = null;
    this.onError = null;
    this.onStart = null;
    this.onEnd = null;
    this.currentLanguage = 'en-US';
    this.selectedVoice = null;
  }

  // Initialize Speech Recognition
  initRecognition(language = 'en-US') {
    if (typeof window === 'undefined') {
      console.error('Speech Recognition only available in browser');
      return false;
    }
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech Recognition not supported');
      return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = language;
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.onStart) this.onStart();
    };

    this.recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const transcript = event.results[last][0].transcript;
      const isFinal = event.results[last].isFinal;
      
      if (this.onResult) {
        this.onResult(transcript, isFinal);
      }
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      if (this.onError) {
        this.onError(event.error);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onEnd) this.onEnd();
    };

    return true;
  }

  // Start listening
  startListening() {
    if (!this.recognition) {
      this.initRecognition(this.currentLanguage);
    }
    
    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
        return true;
      } catch (error) {
        console.error('Error starting recognition:', error);
        return false;
      }
    }
    return false;
  }

  // Stop listening
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  // Set language for recognition
  setLanguage(languageCode) {
    this.currentLanguage = this.getFullLanguageCode(languageCode);
    if (this.recognition) {
      this.recognition.lang = this.currentLanguage;
    }
  }

  // Convert short language codes to full codes
  getFullLanguageCode(code) {
    const languageMap = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'kn': 'kn-IN',
      'ml': 'ml-IN',
      'mr': 'mr-IN',
      'bn': 'bn-IN',
      'gu': 'gu-IN',
      'pa': 'pa-IN',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'ja': 'ja-JP',
      'zh': 'zh-CN'
    };
    return languageMap[code] || code;
  }

  // Get available voices
  getAvailableVoices() {
    return new Promise((resolve) => {
      let voices = this.synthesis.getVoices();
      
      if (voices.length > 0) {
        resolve(voices);
      } else {
        this.synthesis.onvoiceschanged = () => {
          voices = this.synthesis.getVoices();
          resolve(voices);
        };
      }
    });
  }

  // Find best voice for language and gender
  async selectVoice(languageCode, gender = 'neutral') {
    const voices = await this.getAvailableVoices();
    const fullLangCode = this.getFullLanguageCode(languageCode);
    
    // First try to find voice matching language and gender
    let voice = voices.find(v => 
      v.lang.startsWith(fullLangCode.substring(0, 2)) && 
      (gender === 'neutral' || v.name.toLowerCase().includes(gender))
    );

    // Fallback to any voice matching language
    if (!voice) {
      voice = voices.find(v => v.lang.startsWith(fullLangCode.substring(0, 2)));
    }

    // Final fallback to default
    if (!voice) {
      voice = voices[0];
    }

    this.selectedVoice = voice;
    return voice;
  }

  // Speak text
  async speak(text, options = {}) {
    if (!this.synthesis) {
      console.error('Speech Synthesis not supported');
      return false;
    }

    // Stop any ongoing speech
    this.stopSpeaking();

    const {
      languageCode = 'en',
      gender = 'neutral',
      rate = 1.0,
      pitch = 1.0,
      volume = 1.0
    } = options;

    // Select appropriate voice
    await this.selectVoice(languageCode, gender);

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    
    utterance.lang = this.getFullLanguageCode(languageCode);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      this.isSpeaking = false;
    };

    this.synthesis.speak(utterance);
    return true;
  }

  // Stop speaking
  stopSpeaking() {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.cancel();
      this.isSpeaking = false;
    }
  }

  // Check if browser supports speech recognition
  static isSpeechRecognitionSupported() {
    return typeof window !== 'undefined' && (('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window));
  }

  // Check if browser supports speech synthesis
  static isSpeechSynthesisSupported() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  // Get recommended voices for each language
  static getRecommendedVoices() {
    return {
      'en-US': ['Google US English', 'Microsoft David', 'Samantha'],
      'en-GB': ['Google UK English', 'Microsoft Hazel', 'Daniel'],
      'hi-IN': ['Google हिन्दी', 'Microsoft Hemant'],
      'ta-IN': ['Google தமிழ்', 'Microsoft Heera'],
      'te-IN': ['Google తెలుగు'],
      'kn-IN': ['Google ಕನ್ನಡ'],
      'ml-IN': ['Google മലയാളം'],
      'mr-IN': ['Google मराठी'],
      'bn-IN': ['Google বাংলা'],
      'gu-IN': ['Google ગુજરાતી'],
      'pa-IN': ['Google ਪੰਜਾਬੀ'],
      'es-ES': ['Google español', 'Microsoft Helena'],
      'fr-FR': ['Google français', 'Microsoft Hortense'],
      'de-DE': ['Google Deutsch', 'Microsoft Hedda'],
      'ja-JP': ['Google 日本語', 'Microsoft Haruka'],
      'zh-CN': ['Google 中文', 'Microsoft Huihui']
    };
  }
}

export default VoiceManager;
