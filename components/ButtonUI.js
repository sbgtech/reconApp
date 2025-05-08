import React from "react";
import { Text, Pressable, View } from "react-native";
import { styles } from "./tabs/style/styles";

export default function ButtonUI(props) {
  const { onPress, title, btnStyle, children, txtStyle, disabled } = props;

  return (
    <View>
      <Pressable
        style={({ pressed }) => [
          {
            opacity: pressed || disabled ? 0.5 : 1,
          },
          styles.buttonStyle,
          btnStyle,
          disabled, // Add a style for disabled state
        ]}
        onPress={disabled ? null : onPress}
        disabled={disabled}
      >
        {children ? (
          children
        ) : (
          <Text style={[styles.buttonTextStyle, txtStyle]}>{title}</Text>
        )}
      </Pressable>
    </View>
  );
}
