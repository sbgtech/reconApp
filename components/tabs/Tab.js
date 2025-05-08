import React from "react";
import { Text, useWindowDimensions, TouchableOpacity } from "react-native";
import { styles } from "./style/styles";

const Tab = ({ label, isActive, onPress }) => {
  const { width } = useWindowDimensions();
  return (
    <TouchableOpacity
      style={[styles.tab(width), isActive ? styles.activeTab : null]}
      onPress={onPress}
    >
      <Text style={styles.tabText(width)}>{label}</Text>
    </TouchableOpacity>
  );
};

export default Tab;
