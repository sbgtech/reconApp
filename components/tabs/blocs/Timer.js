import React, { useEffect, useState } from "react";
import { Text, View, TextInput, useWindowDimensions } from "react-native";
import ButtonUI from "../../ButtonUI";
import Toast from "react-native-toast-message";
import { styles } from "../style/styles";
import { Buffer } from "buffer";
import {
  UART_SERVICE_UUID,
  UART_TX_CHARACTERISTIC_UUID,
} from "../../Utils/Constants";
import { Receive } from "../../Utils/Receive";

const Timer = ({
  title,
  totalSec,
  connectedDevice,
  address1,
  address2,
  fetchDataTimer,
}) => {
  const { width } = useWindowDimensions();
  const [hourValue, setHourValue] = useState("");
  const [minValue, setMinValue] = useState("");
  const [secValue, setSecValue] = useState("");

  const handleChangeHour = (text) => {
    if (text) {
      setHourValue(text);
    } else {
      setHourValue("");
    }
  };

  const handleChangeMin = (text) => {
    if (text >= 0 && text <= 59) {
      setMinValue(text);
    } else {
      Toast.show({
        type: "error",
        text1: "Warning",
        text2: "Minutes must be entre 01 & 59",
        visibilityTime: 3000,
      });
      setMinValue("");
    }
  };

  const handleChangeSec = (text) => {
    if (text >= 0 && text <= 59) {
      setSecValue(text);
    } else {
      Toast.show({
        type: "error",
        text1: "Warning",
        text2: "Seconds must be entre 01 & 59",
        visibilityTime: 3000,
      });
      setSecValue("");
    }
  };

  const unpackFloatToRegister = (floatValue) => {
    // Convert the float to a 32-bit integer (using Float32Array and DataView)
    let buffer = new ArrayBuffer(4);
    let view = new DataView(buffer);
    view.setFloat32(0, floatValue, true);

    // Get the 32-bit integer from the buffer
    let register32bit = view.getUint32(0, true);

    let MSB = (register32bit >> 16) & 0xffff; // Top 16 bits
    let LSB = register32bit & 0xffff; // Bottom 16 bits

    return { LSB, MSB };
  };

  const handleSendTimer = async () => {
    if (hourValue === "" || minValue === "" || secValue === "") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "All fields (hours, minutes, and seconds) must be filled",
        visibilityTime: 3000,
      });
      return; // Exit the function if validation fails
    }
    try {
      const totalSeconds =
        Number(hourValue) * 3600 + Number(minValue) * 60 + Number(secValue);
      const { LSB, MSB } = unpackFloatToRegister(totalSeconds);
      const arr = JSON.stringify([2, address1, LSB, address2, MSB]);
      const buffer = Buffer.from(arr + "\n", "utf-8");
      connectedDevice?.writeCharacteristicWithResponseForService(
        UART_SERVICE_UUID,
        UART_TX_CHARACTERISTIC_UUID,
        buffer.toString("base64")
      );
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Data sent successfully",
        visibilityTime: 3000,
      });
      fetchDataTimer();
    } catch (error) {
      console.log(
        "Error with writeCharacteristicWithResponseForService :",
        error
      );
    }
  };

  const toHMS = (totalSeconds) => {
    const { formattedHours, formattedMinutes, formattedSeconds } =
      Receive.convertTimersToHMS(totalSeconds);
    setHourValue(formattedHours);
    setMinValue(formattedMinutes);
    setSecValue(formattedSeconds);
  };

  useEffect(() => {
    toHMS(totalSec);
  }, [totalSec]);

  return (
    <View style={styles.wrapper(width)}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.valveTitle}>{title}</Text>
      </View>

      <View style={styles.rangeWrapper}>
        <View style={styles.containerRange}>
          <View style={styles.timersInput}>
            <TextInput
              style={styles.inputTimer(width)}
              keyboardType="numeric"
              value={hourValue}
              onChangeText={handleChangeHour}
              maxLength={2}
              selectTextOnFocus={true}
            />
            <Text style={styles.dotTimer}>:</Text>
            <TextInput
              style={styles.inputTimer(width)}
              keyboardType="numeric"
              value={minValue}
              onChangeText={handleChangeMin}
              maxLength={2}
              selectTextOnFocus={true}
            />
            <Text style={styles.dotTimer}>:</Text>
            <TextInput
              style={styles.inputTimer(width)}
              keyboardType="numeric"
              value={secValue}
              onChangeText={handleChangeSec}
              maxLength={2}
              selectTextOnFocus={true}
            />
          </View>
          <View style={styles.TimersbtnContainer}>
            <ButtonUI
              onPress={() => handleSendTimer()}
              title={"Send"}
              btnStyle={styles.btnSendText(width)}
              txtStyle={styles.TextSendStyle(width)}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Timer;
