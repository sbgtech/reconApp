import { StatusBar } from "react-native";
import "react-native-gesture-handler";
import "react-native-reanimated";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Item from "./components/Item";
import Home from "./components/Home";
// import DevicePage from "./components/DevicePage";
import Toast from "react-native-toast-message";
// import TestMode from "./components/TestMode";
import DeviceSettings from "./components/DeviceSettings";
import { useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import Entypo from "@expo/vector-icons/Entypo";
import Menu from "./components/Menu";
import WellStatus from "./components/tabs/WellStatusTab";
import TimerTab from "./components/tabs/TimerTab";
import SettingsTab from "./components/tabs/SettingsTab";
import StatisticsTab from "./components/tabs/StatisticsTab";
import TestTab from "./components/tabs/TestTab";

SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();
export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync(Entypo.font);
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <StatusBar backgroundColor={"#d7c300"} />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: "#d7c300" },
          headerTintColor: "#fff",
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="Item" component={Item} />
        <Stack.Screen
          name="DeviceSettings"
          component={DeviceSettings}
          options={{
            title: "Device settings",
          }}
        />
        <Stack.Screen name="WellStatus" component={WellStatus} />
        <Stack.Screen name="Timers" component={TimerTab} />
        <Stack.Screen name="Settings" component={SettingsTab} />
        <Stack.Screen name="Statistics" component={StatisticsTab} />
        <Stack.Screen name="Test" component={TestTab} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}
