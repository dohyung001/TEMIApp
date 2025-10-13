import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import * as IntentLauncher from "expo-intent-launcher";
import * as Speech from "expo-speech";

export default function NavigationScreen({ navigation }) {
  const [selectedLocation, setSelectedLocation] = useState(null);

  // TEMI에 저장된 위치들 (TEMI 설정에서 미리 등록해야 함)
  const locations = [
    { id: 1, name: "입구", temiName: "entrance" },
    { id: 2, name: "부스 A", temiName: "booth_a" },
    { id: 3, name: "화장실", temiName: "restroom" },
  ];

  /**
   * 방법 1: Intent로 TEMI 이동 명령
   */
  const goToWithIntent = async (location) => {
    try {
      // TEMI에게 이동 명령
      await IntentLauncher.startActivityAsync("com.robotemi.sdk.action.GOTO", {
        extra: {
          location: location.temiName,
        },
      });

      // 음성 안내
      Speech.speak(`${location.name}으로 안내하겠습니다`);
    } catch (error) {
      Alert.alert("오류", "TEMI 명령을 실행할 수 없습니다.");
    }
  };

  /**
   * 방법 2: TEMI 지도 앱 열기
   */
  const openTemiNavigation = async (location) => {
    try {
      // TEMI 내장 지도 앱 열기
      const url = `temi://goto?location=${location.temiName}`;
      const canOpen = await Linking.canOpenURL(url);

      if (canOpen) {
        await Linking.openURL(url);
        Speech.speak(`${location.name}으로 이동합니다`);
      } else {
        Alert.alert("알림", "TEMI 지도 앱을 찾을 수 없습니다.");
      }
    } catch (error) {
      Alert.alert("오류", error.message);
    }
  };

  /**
   * 방법 3: 음성으로 TEMI 제어 (가장 간단!)
   */
  const controlWithVoice = (location) => {
    // TEMI는 자체 음성인식이 있음
    // "Hey TEMI, 부스 A로 가줘" 같은 명령을 음성으로 트리거
    Speech.speak(`테미야, ${location.name}으로 가줘`, {
      language: "ko-KR",
      // TEMI가 이 음성을 듣고 자동으로 이동함
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-5">
        <Text className="text-4xl font-bold mb-5">🧭 길 안내</Text>

        {/* 목적지 목록 */}
        <ScrollView className="flex-1">
          {locations.map((loc) => (
            <TouchableOpacity
              key={loc.id}
              className="bg-blue-50 p-4 rounded-2xl mb-3"
              onPress={() => setSelectedLocation(loc)}
            >
              <Text className="text-xl font-bold">{loc.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 선택된 목적지 */}
        {selectedLocation && (
          <View className="gap-3 pt-4 border-t border-gray-200">
            <Text className="text-lg font-bold text-center">
              선택: {selectedLocation.name}
            </Text>

            {/* 방법 1: Intent */}
            <TouchableOpacity
              className="bg-blue-500 py-4 rounded-2xl"
              onPress={() => goToWithIntent(selectedLocation)}
            >
              <Text className="text-white text-center font-bold">
                🤖 TEMI 이동 시작 (Intent)
              </Text>
            </TouchableOpacity>

            {/* 방법 2: TEMI 앱 */}
            <TouchableOpacity
              className="bg-green-500 py-4 rounded-2xl"
              onPress={() => openTemiNavigation(selectedLocation)}
            >
              <Text className="text-white text-center font-bold">
                🗺️ TEMI 지도 열기
              </Text>
            </TouchableOpacity>

            {/* 방법 3: 음성 */}
            <TouchableOpacity
              className="bg-purple-500 py-4 rounded-2xl"
              onPress={() => controlWithVoice(selectedLocation)}
            >
              <Text className="text-white text-center font-bold">
                🔊 음성으로 명령
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
