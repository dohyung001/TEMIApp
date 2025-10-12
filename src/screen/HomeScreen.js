import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/LanguageContext";

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();

  const menuItems = [
    {
      id: 1,
      title: t("navigation"),
      screen: "Navigation",
      icon: "🧭",
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: t("boothInfo"),
      screen: "BoothInfo",
      icon: "ℹ️",
      color: "bg-white",
    },
    { id: 3, title: t("chat"), screen: "Home", icon: "🤖", color: "bg-white" },
    {
      id: 4,
      title: t("photo"),
      screen: "Photo",
      icon: "📷",
      color: "bg-white",
    },
    { id: 5, title: t("game"), screen: "Game", icon: "🎮", color: "bg-white" },
    {
      id: 6,
      title: t("recommend"),
      screen: "Recommend",
      icon: "⭐",
      color: "bg-white",
    },
    { id: 7, title: t("faq"), screen: "Home", icon: "❓", color: "bg-white" },
    {
      id: 8,
      title: t("fortune"),
      screen: "Fortune",
      icon: "✨",
      color: "bg-white",
    },
    {
      id: 9,
      title: t("survey"),
      screen: "Survey",
      icon: "📋",
      color: "bg-white",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 p-6">
        {/* 언어 전환 버튼 */}
        <View className="flex-row justify-end gap-2 mb-4">
          <TouchableOpacity
            className={`px-4 py-2 rounded-full ${language === "ko" ? "bg-blue-500" : "bg-white"}`}
            onPress={() => changeLanguage("ko")}
          >
            <Text
              className={`font-semibold ${language === "ko" ? "text-white" : "text-gray-700"}`}
            >
              한국어
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`px-4 py-2 rounded-full ${language === "en" ? "bg-blue-500" : "bg-white"}`}
            onPress={() => changeLanguage("en")}
          >
            <Text
              className={`font-semibold ${language === "en" ? "text-white" : "text-gray-700"}`}
            >
              English
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`px-4 py-2 rounded-full ${language === "zh" ? "bg-blue-500" : "bg-white"}`}
            onPress={() => changeLanguage("zh")}
          >
            <Text
              className={`font-semibold ${language === "zh" ? "text-white" : "text-gray-700"}`}
            >
              中文
            </Text>
          </TouchableOpacity>
        </View>

        {/* 인사말 */}
        <View className="mb-6">
          <View className="bg-gray-800 px-4 py-2 rounded-full self-start">
            <Text className="text-white text-sm">👋 {t("welcome")}</Text>
          </View>
          <Text className="text-3xl font-bold mt-4">
            🤖 {t("whatCanIHelp")}
          </Text>
        </View>

        {/* 메뉴 그리드 */}
        <View className="flex-1">
          <View className="flex-row gap-4 mb-4">
            {/* 길 안내 - 큰 카드 */}
            <TouchableOpacity
              className="flex-1 bg-blue-500 rounded-3xl p-6 justify-between"
              onPress={() => navigation.navigate("Navigation")}
            >
              <Text className="text-5xl mb-2">🧭</Text>
              <View>
                <Text className="text-white text-2xl font-bold mb-1">
                  {t("navigation")}
                </Text>
                <Text className="text-blue-100 text-sm">
                  목적지로 빠르게 이동
                </Text>
              </View>
            </TouchableOpacity>

            {/* 2x2 그리드 */}
            <View className="flex-1 gap-4">
              <View className="flex-row gap-4">
                {menuItems.slice(1, 3).map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    className="flex-1 bg-white rounded-2xl p-4 items-center justify-center"
                    onPress={() => navigation.navigate(item.screen)}
                  >
                    <Text className="text-3xl mb-2">{item.icon}</Text>
                    <Text className="text-gray-800 text-xs font-semibold text-center">
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View className="flex-row gap-4">
                {menuItems.slice(3, 5).map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    className="flex-1 bg-white rounded-2xl p-4 items-center justify-center"
                    onPress={() => navigation.navigate(item.screen)}
                  >
                    <Text className="text-3xl mb-2">{item.icon}</Text>
                    <Text className="text-gray-800 text-xs font-semibold text-center">
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* 하단 4개 */}
          <View className="flex-row gap-4">
            {menuItems.slice(5, 9).map((item) => (
              <TouchableOpacity
                key={item.id}
                className="flex-1 bg-white rounded-2xl p-4 items-center justify-center"
                onPress={() => navigation.navigate(item.screen)}
              >
                <Text className="text-3xl mb-2">{item.icon}</Text>
                <Text className="text-gray-800 text-xs font-semibold text-center">
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text className="text-center text-gray-400 text-sm mt-6">
          터치하거나 음성으로 명령해주세요
        </Text>
      </View>
    </SafeAreaView>
  );
}
