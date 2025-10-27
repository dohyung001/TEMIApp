class TemiBridgeService {
  constructor() {
    this.listeners = new Map();

    window.onTemiLocationStatus = (data) => {
      this.emit("locationStatus", data);
    };
  }

  // ========== 음성 (Speech) ==========

  speak(text) {
    if (window.Temi) {
      window.Temi.speak(text);
    } else {
      console.log("[Dev] speak:", text);
    }
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
}

export const TemiBridge = new TemiBridgeService();
