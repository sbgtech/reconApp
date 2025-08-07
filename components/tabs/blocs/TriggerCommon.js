import React, { useState } from "react";
import { View, Text, TextInput, useWindowDimensions } from "react-native";
import { styles } from "../style/styles";
import ButtonUI from "../../ButtonUI";
import { Buffer } from "buffer";
import {
  UART_SERVICE_UUID,
  UART_TX_CHARACTERISTIC_UUID,
} from "../../Utils/Constants";
import Toast from "react-native-toast-message";
import TriggerTimer from "./TriggerTimer";

const TriggerCommon = ({
  connectedDevice,
  trigger,
  dispatchTrigger,
  fetchDataTrigger,
  setLoading,
}) => {
  // Commun settings
  const { width } = useWindowDimensions();

  const [minArrivalHour, setMinArrivalHour] = useState("");
  const [minArrivalMin, setMinArrivalMin] = useState("");
  const [minArrivalSec, setMinArrivalSec] = useState("");

  const [maxArrivalHour, setMaxArrivalHour] = useState("");
  const [maxArrivalMin, setMaxArrivalMin] = useState("");
  const [maxArrivalSec, setMaxArrivalSec] = useState("");

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

  // handle change values
  const handleChangeValues = (text, fieldName) => {
    if (text) {
      const validText = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      // Ensure the length is 4
      if (validText.length > 4) {
        Toast.show({
          type: "error",
          text1: "Warning",
          text2: "The max value must be 4 digits",
          visibilityTime: 3000,
        });
        dispatchTrigger({ [fieldName]: "" });
      } else {
        dispatchTrigger({ [fieldName]: validText });
      }
    } else {
      dispatchTrigger({ [fieldName]: "" });
    }
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSendCommonSettings = async () => {
    if (
      trigger.closeDelayTimer === "" ||
      minArrivalHour === "" ||
      minArrivalMin === "" ||
      minArrivalSec === "" ||
      maxArrivalHour === "" ||
      maxArrivalMin === "" ||
      maxArrivalSec === ""
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "All fields must be filled",
        visibilityTime: 3000,
      });
      return; // Exit the function if validation fails
    }
    try {
      const totalSecondsMin =
        Number(minArrivalHour) * 3600 +
        Number(minArrivalMin) * 60 +
        Number(minArrivalSec);

      const totalSecondsMax =
        Number(maxArrivalHour) * 3600 +
        Number(maxArrivalMin) * 60 +
        Number(maxArrivalSec);
      const { LSB: LSB_Min, MSB: MSB_Min } =
        unpackFloatToRegister(totalSecondsMin);
      const { LSB: LSB_Max, MSB: MSB_Max } =
        unpackFloatToRegister(totalSecondsMax);
      const { LSB: LSB_closeDelayTimer, MSB: MSB_closeDelayTimer } =
        unpackFloatToRegister(trigger.closeDelayTimer);
      const arr = JSON.stringify([
        6,
        224,
        LSB_Min,
        225,
        MSB_Min,
        226,
        LSB_Max,
        227,
        MSB_Max,
        222,
        LSB_closeDelayTimer,
        223,
        MSB_closeDelayTimer,
      ]);
      const buffer = Buffer.from(arr + "\n", "utf-8");
      await connectedDevice?.writeCharacteristicWithResponseForService(
        UART_SERVICE_UUID,
        UART_TX_CHARACTERISTIC_UUID,
        buffer.toString("base64")
      );
      console.log(arr);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Data sent successfully",
        visibilityTime: 3000,
      });
      setLoading(true);
      await delay(2000);
      await fetchDataTrigger();
    } catch (error) {
      console.log(
        "Error with writeCharacteristicWithResponseForService :",
        error
      );
    }
  };
  return (
    <View style={styles.settingsSection(width)} key={"card1"}>
      <View style={styles.inputContainer}>
        <Text style={styles.valveTitle(width)}>Commun Settings</Text>
        <Text style={styles.titleSettings(width)}>Min arrival time :</Text>
        <TriggerTimer
          totalSec={trigger.minArrivalTime}
          hourValue={minArrivalHour}
          minValue={minArrivalMin}
          secValue={minArrivalSec}
          setHourValue={setMinArrivalHour}
          setMinValue={setMinArrivalMin}
          setSecValue={setMinArrivalSec}
        />
        <Text style={styles.titleSettings(width)}>Max arrival time</Text>
        <TriggerTimer
          totalSec={trigger.maxArrivalTime}
          hourValue={maxArrivalHour}
          minValue={maxArrivalMin}
          secValue={maxArrivalSec}
          setHourValue={setMaxArrivalHour}
          setMinValue={setMaxArrivalMin}
          setSecValue={setMaxArrivalSec}
        />
        <Text style={styles.titleSettings(width)}>Close delay (SEC) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={trigger.closeDelayTimer?.toString() || ""}
          onChangeText={(text) => handleChangeValues(text, "closeDelayTimer")}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.containerBtnText}>
        <ButtonUI
          onPress={() => handleSendCommonSettings()}
          title={"Send"}
          btnStyle={styles.btnSendText(width)}
          txtStyle={styles.TextSendStyle(width)}
        />
      </View>
    </View>
  );
};
export default TriggerCommon;
