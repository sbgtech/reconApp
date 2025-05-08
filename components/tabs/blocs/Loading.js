import React from "react";
import { Text, View, Modal, ActivityIndicator } from "react-native";
import { styles } from "../style/styles";

const Loading = (props) => {
  return (
    <View>
      <Modal animationType="slide" transparent={true} visible={props.loading}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.waitingMsg}>{props.title}</Text>
            <ActivityIndicator color={"#000"} size={"large"} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Loading;
