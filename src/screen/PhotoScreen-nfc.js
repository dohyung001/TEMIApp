import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  Platform,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as IntentLauncher from "expo-intent-launcher";
import * as FileSystem from "expo-file-system";
import { useTranslation } from "react-i18next";

export default function PhotoScreen({ navigation }) {
  const { t } = useTranslation();

  // 카메라 권한 관리
  const [permission, requestPermission] = useCameraPermissions();

  // 촬영된 사진 URI 저장
  const [photo, setPhoto] = useState(null);

  // 카메라 참조
  const cameraRef = useRef(null);

  // 카메라 방향 (전면/후면)
  const [facing, setFacing] = useState("back");

  // 권한 로딩 중
  if (!permission) {
    return <View />;
  }

  // 권한 없을 때 권한 요청 화면
  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center p-6">
        <Text className="text-xl text-center mb-6">
          카메라 권한이 필요합니다
        </Text>
        <TouchableOpacity
          className="bg-blue-500 py-4 px-8 rounded-2xl"
          onPress={requestPermission}
        >
          <Text className="text-white text-lg font-bold">권한 허용</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  /**
   * 사진 촬영 함수
   * - 카메라로 사진 촬영
   * - URI를 state에 저장
   */
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8, // 화질 (0.0 ~ 1.0)
        });
        setPhoto(photo.uri);
      } catch (error) {
        Alert.alert("오류", "사진 촬영에 실패했습니다.");
        console.error(error);
      }
    }
  };

  /**
   * NFC로 사진 전송
   * - Android Intent 사용
   * - 공유 시트 열어서 사용자가 전송 방법 선택
   */
  const shareViaNFC = async () => {
    // Android만 지원
    if (Platform.OS !== "android") {
      Alert.alert("지원 안 됨", "NFC는 Android에서만 작동합니다.");
      return;
    }

    try {
      console.log("📡 NFC 공유 시작...");
      console.log("Photo URI:", photo);

      // Android 공유 Intent 실행
      await IntentLauncher.startActivityAsync("android.intent.action.SEND", {
        type: "image/jpeg",
        extra: {
          "android.intent.extra.STREAM": photo, // 이미지 파일 URI
        },
        flags: 1, // 읽기 권한 부여
      });

      // 사용자 안내
      Alert.alert(
        "NFC 전송",
        "공유 방법을 선택하고,\n상대방 휴대폰을 TEMI에 가까이 대세요.",
        [{ text: "확인" }]
      );
    } catch (error) {
      console.error("NFC Error:", error);
      Alert.alert(
        "NFC 전송 실패",
        "NFC가 지원되지 않거나 활성화되지 않았습니다.\n\n설정 > 연결 > NFC에서 활성화해주세요."
      );
    }
  };

  /**
   * Android Beam으로 전송 (구형 방식)
   * - Android 9 이하에서만 작동
   * - 두 기기를 등 맞대서 전송
   */
  const shareViaBeam = async () => {
    if (Platform.OS !== "android") {
      Alert.alert("지원 안 됨", "Android Beam은 Android에서만 작동합니다.");
      return;
    }

    try {
      // 사용자에게 사용 방법 안내
      Alert.alert(
        "📡 Android Beam 사용",
        "1. 설정 > 연결 > NFC 활성화\n2. Android Beam 활성화\n3. 두 기기를 등 맞대기\n\n계속하시겠습니까?",
        [
          { text: "취소", style: "cancel" },
          {
            text: "계속",
            onPress: async () => {
              await IntentLauncher.startActivityAsync(
                "android.nfc.action.NDEF_DISCOVERED",
                {
                  type: "image/jpeg",
                  data: photo,
                }
              );
            },
          },
        ]
      );
    } catch (error) {
      console.error("Beam Error:", error);
      Alert.alert("오류", "Android Beam을 사용할 수 없습니다.");
    }
  };

  /**
   * 일반 공유 (대체 방법)
   * - NFC 안 되면 이걸로 공유
   * - Bluetooth, 이메일 등 선택 가능
   */
  const shareFallback = async () => {
    try {
      await IntentLauncher.startActivityAsync("android.intent.action.SEND", {
        type: "image/jpeg",
        extra: {
          "android.intent.extra.STREAM": photo,
        },
        flags: 1,
      });
    } catch (error) {
      Alert.alert("공유 실패", "다시 시도해주세요.");
    }
  };

  /**
   * 카메라 방향 전환 (전면 ⟷ 후면)
   */
  const toggleCamera = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  /**
   * 다시 촬영 (사진 초기화)
   */
  const reset = () => {
    setPhoto(null);
  };

  // ========== 사진 촬영 후 결과 화면 ==========
  if (photo) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 p-5">
          {/* 뒤로가기 */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-xl text-blue-500 font-semibold">
              ← {t("back")}
            </Text>
          </TouchableOpacity>

          <Text className="text-4xl font-bold text-center my-5">
            📸 촬영 완료!
          </Text>

          {/* 사진 미리보기 */}
          <View className="flex-1 bg-gray-100 rounded-3xl overflow-hidden mb-5">
            <Image
              source={{ uri: photo }}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>

          {/* NFC 사용 방법 안내 */}
          <View className="bg-blue-50 p-4 rounded-2xl mb-4">
            <Text className="text-lg font-bold mb-2">📡 NFC 전송 방법</Text>
            <Text className="text-gray-700 leading-6">
              1. 아래 버튼 클릭{"\n"}
              2. 공유 앱 목록에서 선택{"\n"}
              3. 휴대폰을 TEMI에 가까이 대기{"\n"}
              4. "삑" 소리나면 전송 완료!
            </Text>
          </View>

          {/* 전송 버튼들 */}
          <View className="gap-3">
            {/* 1. NFC 전송 (메인) */}
            <TouchableOpacity
              className="bg-purple-500 py-5 rounded-2xl"
              onPress={shareViaNFC}
            >
              <View className="items-center">
                <Text className="text-white text-2xl mb-1">📡</Text>
                <Text className="text-white text-lg font-bold">
                  NFC로 전송하기
                </Text>
                <Text className="text-purple-100 text-sm mt-1">
                  휴대폰을 TEMI에 가까이 대세요
                </Text>
              </View>
            </TouchableOpacity>

            {/* 2. Android Beam (구형 기기용) */}
            <TouchableOpacity
              className="bg-indigo-500 py-4 rounded-2xl"
              onPress={shareViaBeam}
            >
              <Text className="text-white text-center text-lg font-bold">
                📲 Android Beam으로 전송
              </Text>
            </TouchableOpacity>

            {/* 3. 일반 공유 (대체 방법) */}
            <TouchableOpacity
              className="bg-green-500 py-4 rounded-2xl"
              onPress={shareFallback}
            >
              <Text className="text-white text-center text-lg font-bold">
                📤 다른 방법으로 공유
              </Text>
            </TouchableOpacity>

            {/* 4. 다시 촬영 */}
            <TouchableOpacity
              className="bg-gray-200 py-4 rounded-2xl"
              onPress={reset}
            >
              <Text className="text-gray-700 text-center text-lg font-bold">
                🔄 다시 촬영하기
              </Text>
            </TouchableOpacity>
          </View>

          {/* 주의사항 */}
          <View className="mt-4 bg-yellow-50 p-3 rounded-xl">
            <Text className="text-yellow-800 text-xs text-center">
              ⚠️ NFC가 작동하지 않으면 "다른 방법으로 공유"를 이용하세요
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ========== 카메라 화면 ==========
  return (
    <SafeAreaView className="flex-1 bg-black">
      <CameraView ref={cameraRef} className="flex-1" facing={facing}>
        <View className="flex-1 justify-between p-6">
          {/* 상단 버튼 */}
          <View className="flex-row justify-between">
            {/* 뒤로가기 */}
            <TouchableOpacity
              className="bg-black/50 px-4 py-2 rounded-full"
              onPress={() => navigation.goBack()}
            >
              <Text className="text-white text-lg font-semibold">← 뒤로</Text>
            </TouchableOpacity>

            {/* 카메라 전환 */}
            <TouchableOpacity
              className="bg-black/50 px-4 py-2 rounded-full"
              onPress={toggleCamera}
            >
              <Text className="text-white text-lg">🔄 전환</Text>
            </TouchableOpacity>
          </View>

          {/* 하단 촬영 버튼 */}
          <View className="items-center mb-10">
            <TouchableOpacity
              className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 items-center justify-center"
              onPress={takePicture}
            >
              <View className="w-16 h-16 bg-white rounded-full" />
            </TouchableOpacity>
            <Text className="text-white text-lg mt-4 font-semibold">
              사진 촬영
            </Text>
          </View>
        </View>
      </CameraView>
    </SafeAreaView>
  );
}
