import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import QRCode from "react-native-qrcode-svg";
import { useTranslation } from "react-i18next";

export default function PhotoScreen({ navigation }) {
  const { t } = useTranslation();
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const cameraRef = useRef(null);
  const [facing, setFacing] = useState("back"); // 'front' or 'back'

  // 권한 체크
  if (!permission) {
    return <View />;
  }

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

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });

        setPhoto(photo.uri);

        // 실제 서버 업로드 시뮬레이션 (나중에 실제 서버로 변경)
        // 지금은 로컬 URI를 그대로 사용
        const fileName = photo.uri.split("/").pop();
        const mockServerUrl = `https://temi-photos.com/${fileName}`;
        setPhotoUrl(mockServerUrl);
      } catch (error) {
        Alert.alert("오류", "사진 촬영에 실패했습니다.");
        console.error(error);
      }
    }
  };

  const toggleCamera = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const reset = () => {
    setPhoto(null);
    setPhotoUrl(null);
  };

  // 사진 촬영 후 결과 화면
  if (photo) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 p-5">
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

          {/* QR 코드 */}
          <View className="items-center bg-blue-50 p-6 rounded-3xl mb-4">
            <Text className="text-lg font-semibold mb-4">
              📱 스마트폰으로 사진 받기
            </Text>
            <View className="bg-white p-4 rounded-2xl">
              <QRCode
                value={photoUrl || photo}
                size={200}
                backgroundColor="white"
              />
            </View>
            <Text className="text-sm text-gray-500 mt-4 text-center">
              QR 코드를 스캔하여 사진을 저장하세요
            </Text>
          </View>

          {/* 버튼들 */}
          <View className="gap-3">
            <TouchableOpacity
              className="bg-blue-500 py-4 rounded-2xl"
              onPress={reset}
            >
              <Text className="text-white text-center text-lg font-bold">
                🔄 다시 촬영하기
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-gray-200 py-4 rounded-2xl"
              onPress={() => navigation.goBack()}
            >
              <Text className="text-gray-700 text-center text-lg font-bold">
                홈으로 돌아가기
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // 카메라 화면
  return (
    <SafeAreaView className="flex-1 bg-black">
      <CameraView ref={cameraRef} className="flex-1" facing={facing}>
        <View className="flex-1 justify-between p-6">
          {/* 상단 버튼 */}
          <View className="flex-row justify-between">
            <TouchableOpacity
              className="bg-black/50 px-4 py-2 rounded-full"
              onPress={() => navigation.goBack()}
            >
              <Text className="text-white text-lg font-semibold">← 뒤로</Text>
            </TouchableOpacity>

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
