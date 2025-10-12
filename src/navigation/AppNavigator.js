import { createStackNavigator } from "@react-navigation/stack";

// Screens
import HomeScreen from "../screen/HomeScreen";
import NavigationScreen from "../screen/NavigationScreen";
import BoothInfoScreen from "../screen/BoothInfoScreen";
import PhotoScreen from "../screen/PhotoScreen-nfc";
import FortuneScreen from "../screen/FortuneScreen";
import GameScreen from "../screen/GameScreen";
import RecommendScreen from "../screen/RecommendScreen";
import SurveyScreen from "../screen/SurveyScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        orientation: "landscape",
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Navigation" component={NavigationScreen} />
      <Stack.Screen name="BoothInfo" component={BoothInfoScreen} />
      <Stack.Screen name="Photo" component={PhotoScreen} />
      <Stack.Screen name="Fortune" component={FortuneScreen} />
      <Stack.Screen name="Game" component={GameScreen} />
      <Stack.Screen name="Recommend" component={RecommendScreen} />
      <Stack.Screen name="Survey" component={SurveyScreen} />
    </Stack.Navigator>
  );
}
