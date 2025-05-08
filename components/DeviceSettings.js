import React, { useEffect } from "react";
import { View } from "react-native";
import TabView from "./tabs/TabView";
import { styles } from "./tabs/style/styles";

const DeviceSettings = ({ navigation, route }) => {
  const initialTab = route.params?.initialTab || 0;

  useEffect(() => {
    initialTab == 0;
  }, [route.params?.initialTab]);

  return (
    <View style={styles.container}>
      <TabView navigation={navigation} initialTab={initialTab} />
    </View>
  );
};

export default DeviceSettings;
