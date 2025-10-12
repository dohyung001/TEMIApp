import { useTranslation } from "react-i18next";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
export default function SurveyScreen({ navigation }) {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-5">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-xl text-blue-500 font-semibold">
            ← {t("back")}
          </Text>
        </TouchableOpacity>

        <Text className="text-4xl font-bold text-center my-5">
          📋 {t("surveyTitle")}
        </Text>

        <Text className="text-xl text-center text-gray-600 mb-10">
          {t("surveyDescription")}
        </Text>

        {/* ... */}
      </View>
    </SafeAreaView>
  );
}
