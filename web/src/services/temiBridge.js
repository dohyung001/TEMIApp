class TemiBridgeService {
  constructor() {
    this.listeners = new Map();

    // 네이티브 이벤트 리스너 설정
    window.onTemiLocationStatus = (data) => {
      this.emit("locationStatus", data);
    };
  }

  // Temi 명령
  speak(text) {
    if (window.Temi) {
      window.Temi.speak(text);
    } else {
      console.log("[Dev] speak:", text);
    }
  }

  goTo(location) {
    if (window.Temi) {
      window.Temi.goTo(location);
    } else {
      console.log("[Dev] goTo:", location);
    }
  }

  followMe() {
    if (window.Temi) {
      window.Temi.followMe();
    } else {
      console.log("[Dev] followMe");
    }
  }

  stopMovement() {
    if (window.Temi) {
      window.Temi.stopMovement();
    } else {
      console.log("[Dev] stopMovement");
    }
  }

  getLocations() {
    if (window.Temi) {
      const result = window.Temi.getLocations();
      return JSON.parse(result);
    }
    // 개발 모드 더미 데이터
    return ["Home", "Kitchen", "Living Room", "Bedroom"];
  }

  tiltHead(angle) {
    if (window.Temi) {
      window.Temi.tiltHead(angle);
    } else {
      console.log("[Dev] tiltHead:", angle);
    }
  }

  showToast(message) {
    if (window.Temi) {
      window.Temi.showToast(message);
    } else {
      console.log("[Dev] toast:", message);
    }
  }

  // 이벤트 시스템
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

  // 네이티브 환경 체크
  isNativeAvailable() {
    return typeof window.Temi !== "undefined";
  }
}

export const TemiBridge = new TemiBridgeService();
