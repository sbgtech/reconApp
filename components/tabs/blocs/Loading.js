import React, { useEffect } from "react";
import { Text, View, Modal, ActivityIndicator } from "react-native";
import { styles } from "../style/styles";
import Toast from "react-native-toast-message";

const Loading = (props) => {
  useEffect(() => {
    let timeout;

    if (props.loading) {
      // Set a timeout to force close after 10 seconds
      timeout = setTimeout(() => {
        console.log("Loading timeout exceeded. Forcing close.");
        props.onForceClose?.(); // Call the fallback function
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Error to loading, try again",
          visibilityTime: 3000,
        });
      }, 10000); // 10 seconds
    }

    return () => {
      // Clear timeout when loading stops or component unmounts
      clearTimeout(timeout);
    };
  }, [props.loading]);

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
