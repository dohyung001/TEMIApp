import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function SurveyScreen({ navigation }) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-5">
        <TouchableOpacity className="p-3" onPress={() => navigation.goBack()}>
          <Text className="text-xl text-blue-500 font-semibold">
            ← 뒤로가기
          </Text>
        </TouchableOpacity>

        <Text className="text-4xl font-bold text-center my-5">📋 설문조사</Text>

        <View className="flex-1 justify-center items-center">
          <Text className="text-xl text-gray-600 mb-8 text-center">
            QR 코드를 스캔하여{"\n"}설문조사에 참여해주세요!
          </Text>

          <View className="bg-gray-100 p-8 rounded-3xl">
            <QRCode value="https://forms.gle/example" size={250} />
          </View>

          <Text className="text-base text-gray-400 mt-8">
            스마트폰 카메라로 QR 코드를 스캔하세요
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
