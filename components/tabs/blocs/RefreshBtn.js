import React from "react";
import { Text, View, Modal, useWindowDimensions } from "react-native";
import { styles } from "../style/styles";
import ButtonUI from "../../ButtonUI";

const RefreshBtn = ({ onPress }) => {
  const { width } = useWindowDimensions();
  return (
    <View style={styles.refreshBtnWrapper}>
      <ButtonUI
        onPress={onPress}
        title={"Refresh"}
        btnStyle={styles.refreshBtn(width)}
        txtStyle={styles.TextSendStyle(width)}
      />
    </View>
  );
};

export default RefreshBtn;
