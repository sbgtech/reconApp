import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { styles } from "./tabs/style/styles";

const MenuItem = ({ iconName, tabName, onPress }) => {
  const { width } = useWindowDimensions();
  return (
    <TouchableOpacity style={styles.menuItemView(width)} onPress={onPress}>
      <View style={styles.menuIconView(width)}>
        <Ionicons
          name={iconName}
          size={styles.menuIconSize(width)}
          color="#fff"
        />
      </View>
      <View style={styles.menuTextView}>
        <Text style={styles.menuTextSize(width)}>{tabName}</Text>
        {tabName === "Test" && (
          <Ionicons
            name="lock-closed-outline"
            size={styles.menuIconSize(width)}
            color="gray"
          />
        )}
      </View>
      <View>
        <Ionicons
          name="chevron-forward-outline"
          size={styles.menuIconSize(width)}
          color="gray"
        />
      </View>
    </TouchableOpacity>
  );
};

export default MenuItem;
