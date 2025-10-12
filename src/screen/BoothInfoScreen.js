import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";

export default function BoothInfoScreen({ navigation }) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-5">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-xl text-blue-500 font-semibold">
            ← 뒤로가기
          </Text>
        </TouchableOpacity>
        <Text className="text-3xl font-bold mt-5">🏪 부스 정보</Text>
        <View className="flex-1 justify-center items-center">
          <Text className="text-xl text-gray-400">구현 예정</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
