// web/src/services/temiBridge.js

class TemiBridgeService {
  constructor() {
    this.listeners = new Map();
    this.assetCache = new Map();

    window.onTemiLocationStatus = (data) => {
      this.emit("locationStatus", data);
    };

    // ✅ Web Speech API 초기화
    this.webSpeechRecognition = null;
    this.initWebSpeech();
  }

  // ========== Web Speech API 초기화 ==========

  initWebSpeech() {
    // Temi 환경이 아니고 Web Speech API가 지원되는 경우
    if (
      !window.Temi &&
      ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      this.webSpeechRecognition = new SpeechRecognition();
      this.webSpeechRecognition.lang = "ko-KR";
      this.webSpeechRecognition.continuous = false;
      this.webSpeechRecognition.interimResults = false;
      this.webSpeechRecognition.maxAlternatives = 1;

      // 이벤트 리스너 등록
      this.webSpeechRecognition.onstart = () => {
        console.log("✅ [Web Speech] 음성 인식 시작됨");
        if (window.onSpeechReady) window.onSpeechReady();
        if (window.onSpeechStart) window.onSpeechStart();
      };

      this.webSpeechRecognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        console.log("✅ [Web Speech] 인식 결과:", result);
        if (window.onSpeechResult) window.onSpeechResult(result);
      };

      this.webSpeechRecognition.onerror = (event) => {
        console.error("❌ [Web Speech] 오류:", event.error);

        let errorType = "unknown";
        switch (event.error) {
          case "no-speech":
            errorType = "no_speech";
            break;
          case "audio-capture":
            errorType = "no_permission";
            break;
          case "not-allowed":
            errorType = "no_permission";
            break;
          case "network":
            errorType = "network";
            break;
          case "aborted":
            errorType = "busy";
            break;
          default:
            errorType = event.error;
        }

        if (window.onSpeechError) window.onSpeechError(errorType);
      };

      this.webSpeechRecognition.onend = () => {
        console.log("🛑 [Web Speech] 음성 인식 종료됨");
        if (window.onSpeechEnd) window.onSpeechEnd();
      };

      console.log("✅ [Web Speech] API 초기화 완료");
    }
  }

  // ========== Asset 로딩 ==========

  loadAsset(path) {
    if (this.assetCache.has(path)) {
      return Promise.resolve(this.assetCache.get(path));
    }

    return new Promise((resolve, reject) => {
      if (window.Temi && window.Temi.loadAssetAsBase64) {
        try {
          const base64Data = window.Temi.loadAssetAsBase64(path);
          if (base64Data) {
            this.assetCache.set(path, base64Data);
            resolve(base64Data);
          } else {
            reject(new Error(`Failed to load asset: ${path}`));
          }
        } catch (error) {
          reject(error);
        }
      } else {
        resolve(`/${path}`);
      }
    });
  }

  loadImage(filename) {
    const cacheKey = `img/${filename}`;
    if (this.assetCache.has(cacheKey)) {
      return Promise.resolve(this.assetCache.get(cacheKey));
    }

    return new Promise((resolve, reject) => {
      if (window.Temi && window.Temi.loadImageAsBase64) {
        try {
          const base64Data = window.Temi.loadImageAsBase64(filename);
          if (base64Data) {
            this.assetCache.set(cacheKey, base64Data);
            resolve(base64Data);
          } else {
            reject(new Error(`Failed to load image: ${filename}`));
          }
        } catch (error) {
          reject(error);
        }
      } else {
        resolve(`/img/${filename}`);
      }
    });
  }

  checkAssetExists(path) {
    if (window.Temi && window.Temi.checkAssetExists) {
      return window.Temi.checkAssetExists(path);
    }
    return true;
  }

  // ========== 권한 확인 ==========

  hasPermission(permission) {
    if (window.Temi && window.Temi.hasPermission) {
      return window.Temi.hasPermission(permission);
    }
    return true;
  }

  // ========== 음성 (Speech) ==========

  speak(text) {
    if (window.Temi) {
      window.Temi.speak(text);
    } else if (window.speechSynthesis) {
      // ✅ 웹 환경: Web Speech Synthesis API 사용
      console.log("[Web Speech] TTS:", text);

      window.speechSynthesis.cancel(); // 기존 발화 중지

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ko-KR";
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      window.speechSynthesis.speak(utterance);
    } else {
      console.log("[Dev] speak:", text);
    }
  }

  // ========== 음성 인식 (Native + Web Speech API) ==========

  startSpeechRecognition() {
    if (window.Temi) {
      // ✅ Temi 환경
      window.Temi.startSpeechRecognition();
    } else if (this.webSpeechRecognition) {
      // ✅ 웹 환경: Web Speech API 사용
      console.log("[Web Speech] 음성 인식 시작");
      try {
        this.webSpeechRecognition.start();
      } catch (error) {
        console.error("[Web Speech] 시작 실패:", error);
        if (window.onSpeechError) {
          window.onSpeechError("busy");
        }
      }
    } else {
      // ✅ 개발 테스트용: 더미 데이터
      console.log("[Dev] startSpeechRecognition - 더미 모드 시작");

      setTimeout(() => {
        console.log("[Dev] onSpeechReady 호출");
        if (window.onSpeechReady) window.onSpeechReady();
        if (window.onSpeechStart) window.onSpeechStart();
      }, 100);

      setTimeout(() => {
        console.log("[Dev] onSpeechEnd 호출");
        if (window.onSpeechEnd) window.onSpeechEnd();
      }, 2000);

      setTimeout(() => {
        const dummyTexts = [
          "행사는 언제 시작하나요?",
          "화장실은 어디에 있나요?",
          "입장료가 얼마인가요?",
          "주차장은 어디인가요?",
        ];
        const randomText =
          dummyTexts[Math.floor(Math.random() * dummyTexts.length)];
        console.log("[Dev] onSpeechResult 호출:", randomText);
        if (window.onSpeechResult) window.onSpeechResult(randomText);
      }, 2500);
    }
  }

  stopSpeechRecognition() {
    if (window.Temi) {
      window.Temi.stopSpeechRecognition();
    } else if (this.webSpeechRecognition) {
      console.log("[Web Speech] 음성 인식 중지");
      try {
        this.webSpeechRecognition.stop();
      } catch (error) {
        console.error("[Web Speech] 중지 실패:", error);
      }
    } else {
      console.log("[Dev] stopSpeechRecognition");
    }
  }

  // ========== 커스터마이징 ==========

  setCustomization(settings) {
    if (window.Temi) {
      window.Temi.setCustomization(JSON.stringify(settings));
    } else {
      console.log("[Dev] setCustomization:", settings);
    }
  }

  getCustomization() {
    if (window.Temi) {
      const result = window.Temi.getCustomization();
      return JSON.parse(result);
    }
    return null;
  }

  // ========== 이동 (Navigation) ==========

  goTo(location) {
    if (window.Temi) {
      window.Temi.goTo(location);
    } else {
      console.log("[Dev] goTo:", location);
    }
  }

  getLocations() {
    if (window.Temi) {
      const result = window.Temi.getLocations();
      return JSON.parse(result);
    }
    return ["Home", "Kitchen", "Living Room", "Bedroom"];
  }

  saveLocation(name) {
    if (window.Temi) {
      return window.Temi.saveLocation(name);
    } else {
      console.log("[Dev] saveLocation:", name);
      return true;
    }
  }

  deleteLocation(name) {
    if (window.Temi) {
      return window.Temi.deleteLocation(name);
    } else {
      console.log("[Dev] deleteLocation:", name);
      return true;
    }
  }

  // ========== Follow Mode ==========

  followMe() {
    if (window.Temi) {
      window.Temi.followMe();
    } else {
      console.log("[Dev] followMe");
    }
  }

  constraintBeWith() {
    if (window.Temi) {
      window.Temi.constraintBeWith();
    } else {
      console.log("[Dev] constraintBeWith");
    }
  }

  // ========== Movement ==========

  stopMovement() {
    if (window.Temi) {
      window.Temi.stopMovement();
    } else {
      console.log("[Dev] stopMovement");
    }
  }

  turnBy(degrees, speed = 1.0) {
    if (window.Temi) {
      window.Temi.turnBy(degrees, speed);
    } else {
      console.log("[Dev] turnBy:", degrees, speed);
    }
  }

  skidJoy(x, y) {
    if (window.Temi) {
      window.Temi.skidJoy(x, y);
    } else {
      console.log("[Dev] skidJoy:", x, y);
    }
  }

  // ========== 머리 제어 (Head Control) ==========

  tiltHead(angle) {
    if (window.Temi) {
      window.Temi.tiltHead(angle);
    } else {
      console.log("[Dev] tiltHead:", angle);
    }
  }

  tiltBy(degrees, speed) {
    if (window.Temi) {
      window.Temi.tiltBy(degrees, speed);
    } else {
      console.log("[Dev] tiltBy:", degrees, speed);
    }
  }

  // ========== 정보 조회 ==========

  getBatteryLevel() {
    if (window.Temi) {
      const result = window.Temi.getBatteryLevel();
      return JSON.parse(result);
    }
    return { level: 85, isCharging: false };
  }

  getRobotInfo() {
    if (window.Temi) {
      const result = window.Temi.getRobotInfo();
      return JSON.parse(result);
    }
    return { serialNumber: "DEV-0000", version: "1.0.0" };
  }

  // ========== 유틸 ==========

  showToast(message) {
    if (window.Temi) {
      window.Temi.showToast(message);
    } else {
      console.log("[Dev] toast:", message);
      alert(message); // ✅ 웹에서 간단히 표시
    }
  }

  // ========== 이벤트 시스템 ==========

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => callback(data));
    }
  }

  isNativeAvailable() {
    return typeof window.Temi !== "undefined";
  }

  // ========== 캐시 관리 ==========

  clearAssetCache() {
    this.assetCache.clear();
  }
}

export const TemiBridge = new TemiBridgeService();
