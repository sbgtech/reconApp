import React from "react";
import { Text, View, StyleSheet } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "../style/styles";

const Dropdown = (props) => {
  return (
    <View>
      <SelectDropdown
        data={props.list}
        defaultValueByIndex={props.selectedIndex}
        onSelect={(selectedItem, index) => {
          props.setSelectedIndex(index);
        }}
        renderButton={(selectedItem, isOpened) => {
          return (
            <View style={styles.dropdownButtonStyle}>
              <Text style={styles.dropdownButtonTxtStyle}>
                {selectedItem || props.dropdownTitle}
              </Text>
              <Ionicons
                name={isOpened ? "chevron-up" : "chevron-down"}
                style={styles.dropdownButtonArrowStyle}
              />
            </View>
          );
        }}
        renderItem={(item, index, isSelected) => {
          return (
            <View
              style={{
                ...styles.dropdownItemStyle,
                ...(isSelected && { backgroundColor: "#ddd" }),
              }}
            >
              <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        dropdownStyle={styles.dropdownMenuStyle}
      />
    </View>
  );
};

export default Dropdown;
