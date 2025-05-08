import React from "react";
import { Text, View, useWindowDimensions } from "react-native";
import ButtonUI from "./ButtonUI";
import { styles } from "./tabs/style/styles";

const Item = ({ name, id, onPress, title, disabled }) => {
  const { width } = useWindowDimensions();
  return (
    <View style={styles.itemView}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName(width)}>
          {name ? `${name} ${id.substr(0, 5)}` : "Unknown"}
        </Text>
        <Text style={styles.itemID(width)}>{id ? id : "Unknown"}</Text>
      </View>
      <View>
        <ButtonUI
          onPress={onPress}
          title={title}
          btnStyle={styles.btnSendText(width)}
          txtStyle={styles.TextSendStyle(width)}
          disabled={disabled}
        />
      </View>
    </View>
  );
};

export default Item;
