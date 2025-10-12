import * as Speech from "expo-speech";

class TTSService {
  constructor() {
    this.isSpeaking = false;
  }

  speak(text, language = "ko-KR", options = {}) {
    const defaultOptions = {
      language,
      pitch: 1.0,
      rate: 0.85,
      ...options,
    };

    // 현재 말하고 있으면 중지
    if (this.isSpeaking) {
      this.stop();
    }

    this.isSpeaking = true;

    Speech.speak(text, {
      ...defaultOptions,
      onDone: () => {
        this.isSpeaking = false;
      },
      onError: () => {
        this.isSpeaking = false;
      },
    });
  }

  stop() {
    Speech.stop();
    this.isSpeaking = false;
  }

  // 언어별 음성
  speakKorean(text) {
    this.speak(text, "ko-KR");
  }

  speakEnglish(text) {
    this.speak(text, "en-US");
  }

  speakChinese(text) {
    this.speak(text, "zh-CN");
  }

  // TEMI 연동 (나중에 실제 로봇에서)
  speakOnTemi(text) {
    if (__DEV__) {
      // 개발 환경: expo-speech 사용
      this.speak(text);
    } else {
      // 실제 TEMI: TEMI SDK 사용
      // global.TemiSDK?.speak(text);
    }
  }
}

export default new TTSService();
