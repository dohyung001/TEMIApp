import { NativeModules, Platform } from "react-native";

class TemiSDKService {
  constructor() {
    this.isAvailable =
      Platform.OS === "android" && global.TemiSDK !== undefined;
  }

  goTo(location) {
    if (this.isAvailable) {
      // 실제 TEMI SDK 호출
      return global.TemiSDK.goTo(location);
    } else {
      console.log(`[DEV] TEMI goTo: ${location}`);
      return Promise.resolve();
    }
  }

  speak(text) {
    if (this.isAvailable) {
      return global.TemiSDK.speak(text);
    } else {
      console.log(`[DEV] TEMI speak: ${text}`);
      return Promise.resolve();
    }
  }

  followUser() {
    if (this.isAvailable) {
      return global.TemiSDK.followUser();
    }
  }

  stopMovement() {
    if (this.isAvailable) {
      return global.TemiSDK.stopMovement();
    }
  }
}

export default new TemiSDKService();
