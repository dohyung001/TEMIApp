import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";

export default function GameScreen({ navigation }) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-5">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-xl text-blue-500 font-semibold">
            ← 뒤로가기
          </Text>
        </TouchableOpacity>
        <Text className="text-3xl font-bold mt-5">🎮 미니게임</Text>
      </View>
    </SafeAreaView>
  );
}
