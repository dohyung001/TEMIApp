import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import QRCode from "react-native-qrcode-svg";
import { useTranslation } from "react-i18next";

const IMGBB_API_KEY = "e947920cd2d87b83c74bfdb195b2a18f"; // API 키 입력!

export default function PhotoScreen({ navigation }) {
  const { t } = useTranslation();
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const cameraRef = useRef(null);
  const [facing, setFacing] = useState("back");

  const uploadToImgBB = async (base64Data) => {
    try {
      // Base64 헤더 완전 제거
      let cleanBase64 = base64Data;

      if (cleanBase64.includes("base64,")) {
        cleanBase64 = cleanBase64.split("base64,").pop();
      }

      cleanBase64 = cleanBase64.trim().replace(/\s/g, "");

      console.log("📤 Base64 length:", cleanBase64.length);

      const formData = new FormData();
      formData.append("key", IMGBB_API_KEY);
      formData.append("image", cleanBase64);

      const response = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      console.log("📥 Response:", result);

      if (result.success && result.data) {
        return result.data.url;
      } else {
        console.error("❌ Error:", result.error);
        Alert.alert("업로드 실패", result.error?.message || "오류 발생");
        return null;
      }
    } catch (error) {
      console.error("❌ Upload Error:", error);
      Alert.alert("오류", "업로드 실패: " + error.message);
      return null;
    }
  };

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
        setUploading(true);

        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          base64: true,
        });

        console.log("📸 Photo captured");
        setPhoto(photo.uri);

        // base64 직접 전달
        const imageUrl = await uploadToImgBB(photo.base64);

        setUploading(false);

        if (imageUrl) {
          setPhotoUrl(imageUrl);
          console.log("✅ Success:", imageUrl);
        } else {
          setPhoto(null);
        }
      } catch (error) {
        setUploading(false);
        Alert.alert("오류", "사진 촬영 실패");
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

  if (uploading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-xl mt-4 text-gray-600">업로드 중...</Text>
      </SafeAreaView>
    );
  }

  if (photo && photoUrl) {
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

          <View className="flex-1 bg-gray-100 rounded-3xl overflow-hidden mb-5">
            <Image
              source={{ uri: photo }}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>

          <View className="items-center bg-blue-50 p-6 rounded-3xl mb-4">
            <Text className="text-lg font-semibold mb-4">
              📱 스마트폰으로 사진 받기
            </Text>
            <View className="bg-white p-4 rounded-2xl shadow-md">
              <QRCode value={photoUrl} size={200} backgroundColor="white" />
            </View>
            <Text className="text-sm text-gray-600 mt-4 text-center">
              QR 코드를 스캔하여 사진을 저장하세요
            </Text>
          </View>

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

  return (
    <SafeAreaView className="flex-1 bg-black">
      <CameraView ref={cameraRef} className="flex-1" facing={facing}>
        <View className="flex-1 justify-between p-6">
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
