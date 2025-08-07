import React, { useState } from "react";
import { View, Text, useWindowDimensions, TextInput } from "react-native";
import { styles } from "../style/styles";
import ButtonUI from "../../ButtonUI";
import { Buffer } from "buffer";
import {
  UART_SERVICE_UUID,
  UART_TX_CHARACTERISTIC_UUID,
} from "../../Utils/Constants";
import Toast from "react-native-toast-message";
import TriggerTimer from "./TriggerTimer";
import Dropdown from "./Dropdown";

const TriggerCloseADJ = ({
  connectedDevice,
  trigger,
  dispatchTrigger,
  fetchDataTrigger,
  setLoading,
}) => {
  // Commun settings
  const { width } = useWindowDimensions();

  const [timerSetpointHour, setTimerSetpointHour] = useState("");
  const [timerSetpointMin, setTimerSetpointMin] = useState("");
  const [timerSetpointSec, setTimerSetpointSec] = useState("");

  const [minAutoAdjustTimerHour, setMinAutoAdjustTimerHour] = useState("");
  const [minAutoAdjustTimerMin, setMinAutoAdjustTimerMin] = useState("");
  const [minAutoAdjustTimerSec, setMinAutoAdjustTimerSec] = useState("");

  const [maxAutoAdjustTimerHour, setMaxAutoAdjustTimerHour] = useState("");
  const [maxAutoAdjustTimerMin, setMaxAutoAdjustTimerMin] = useState("");
  const [maxAutoAdjustTimerSec, setMaxAutoAdjustTimerSec] = useState("");

  const [autoAdjustTimerIncrementHour, setAutoAdjustTimerIncrementHour] =
    useState("");
  const [autoAdjustTimerIncrementMin, setAutoAdjustTimerIncrementMin] =
    useState("");
  const [autoAdjustTimerIncrementSec, setAutoAdjustTimerIncrementSec] =
    useState("");

  // The dropdown select options for backup timer
  const autoAdjustEnableList = ["Disable", "Enable"];

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

  const handleSendTriggerCloseAdj = async () => {
    if (
      trigger.closeAutoAdjustPSIMin === "" ||
      trigger.closeAutoAdjustPSIMax === "" ||
      trigger.closePressureSetpoint === "" ||
      trigger.closeAutoAdjustPSIIncrement === "" ||
      timerSetpointHour === "" ||
      timerSetpointMin === "" ||
      timerSetpointSec === "" ||
      minAutoAdjustTimerHour === "" ||
      minAutoAdjustTimerMin === "" ||
      minAutoAdjustTimerSec === "" ||
      maxAutoAdjustTimerHour === "" ||
      maxAutoAdjustTimerMin === "" ||
      maxAutoAdjustTimerSec === "" ||
      autoAdjustTimerIncrementHour === "" ||
      autoAdjustTimerIncrementMin === "" ||
      autoAdjustTimerIncrementSec === ""
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
      const totalSecondsTimerSetpoint =
        Number(timerSetpointHour) * 3600 +
        Number(timerSetpointMin) * 60 +
        Number(timerSetpointSec);

      const totalSecondsMinAutoAdjustTimer =
        Number(minAutoAdjustTimerHour) * 3600 +
        Number(minAutoAdjustTimerMin) * 60 +
        Number(minAutoAdjustTimerSec);

      const totalSecondsMaxAutoAdjustTimer =
        Number(maxAutoAdjustTimerHour) * 3600 +
        Number(maxAutoAdjustTimerMin) * 60 +
        Number(maxAutoAdjustTimerSec);

      const totalSecondsAutoAdjustTimerIncrement =
        Number(autoAdjustTimerIncrementHour) * 3600 +
        Number(autoAdjustTimerIncrementMin) * 60 +
        Number(autoAdjustTimerIncrementSec);

      const { LSB: LSB_closeAutoAdjustEnable, MSB: MSB_closeAutoAdjustEnable } =
        unpackFloatToRegister(trigger.closeAutoAdjustEnable);
      const { LSB: LSB_closeAutoAdjustPSIMin, MSB: MSB_closeAutoAdjustPSIMin } =
        unpackFloatToRegister(trigger.closeAutoAdjustPSIMin);
      const { LSB: LSB_closeAutoAdjustPSIMax, MSB: MSB_closeAutoAdjustPSIMax } =
        unpackFloatToRegister(trigger.closeAutoAdjustPSIMax);
      const { LSB: LSB_closePressureSetpoint, MSB: MSB_closePressureSetpoint } =
        unpackFloatToRegister(trigger.closePressureSetpoint);
      const {
        LSB: LSB_closeAutoAdjustPSIIncrement,
        MSB: MSB_closeAutoAdjustPSIIncrement,
      } = unpackFloatToRegister(trigger.closeAutoAdjustPSIIncrement);

      const { LSB: LSB_TimerSetpoint, MSB: MSB_TimerSetpoint } =
        unpackFloatToRegister(totalSecondsTimerSetpoint);

      const { LSB: LSB_MinAutoAdjustTimer, MSB: MSB_MinAutoAdjustTimer } =
        unpackFloatToRegister(totalSecondsMinAutoAdjustTimer);

      const { LSB: LSB_MaxAutoAdjustTimer, MSB: MSB_MaxAutoAdjustTimer } =
        unpackFloatToRegister(totalSecondsMaxAutoAdjustTimer);

      const {
        LSB: LSB_AutoAdjustTimerIncrement,
        MSB: MSB_AutoAdjustTimerIncrement,
      } = unpackFloatToRegister(totalSecondsAutoAdjustTimerIncrement);

      const arr = JSON.stringify([
        6,
        266,
        LSB_closeAutoAdjustEnable,
        267,
        MSB_closeAutoAdjustEnable,
        268,
        LSB_closeAutoAdjustPSIMin,
        269,
        MSB_closeAutoAdjustPSIMin,
        270,
        LSB_closeAutoAdjustPSIMax,
        271,
        MSB_closeAutoAdjustPSIMax,
        256,
        LSB_closePressureSetpoint,
        257,
        MSB_closePressureSetpoint,
        272,
        LSB_closeAutoAdjustPSIIncrement,
        273,
        MSB_closeAutoAdjustPSIIncrement,
        258,
        LSB_TimerSetpoint,
        259,
        MSB_TimerSetpoint,
        274,
        LSB_MinAutoAdjustTimer,
        275,
        MSB_MinAutoAdjustTimer,
        276,
        LSB_MaxAutoAdjustTimer,
        277,
        MSB_MaxAutoAdjustTimer,
        278,
        LSB_AutoAdjustTimerIncrement,
        279,
        MSB_AutoAdjustTimerIncrement,
      ]);
      const buffer = Buffer.from(arr + "\n", "utf-8");
      await connectedDevice?.writeCharacteristicWithResponseForService(
        UART_SERVICE_UUID,
        UART_TX_CHARACTERISTIC_UUID,
        buffer.toString("base64")
      );
      console.log("the arr: ", arr);
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
    <View style={styles.settingsSection(width)} key={"card3"}>
      <View style={styles.inputContainer}>
        <Text style={styles.valveTitle(width)}>Close Auto Adjust System</Text>
        <Text style={styles.titleSettings(width)}>Auto adjust enable :</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={autoAdjustEnableList}
          selectedIndex={trigger.closeAutoAdjustEnable}
          setSelectedIndex={(index) =>
            dispatchTrigger({ closeAutoAdjustEnable: index })
          }
        />
        <View style={styles.pidInputsContainer}>
          <View style={styles.pidInputs}>
            <Text style={styles.titleSettings(width)}>PSI min</Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={trigger.closeAutoAdjustPSIMin?.toString() || ""}
              onChangeText={(text) =>
                handleChangeValues(text, "closeAutoAdjustPSIMin")
              }
              keyboardType="numeric"
            />
          </View>
          <View style={styles.pidInputs}>
            <Text style={styles.titleSettings(width)}>PSI max</Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={trigger.closeAutoAdjustPSIMax?.toString() || ""}
              onChangeText={(text) =>
                handleChangeValues(text, "closeAutoAdjustPSIMax")
              }
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={styles.pidInputsContainer}>
          <View style={styles.pidInputs}>
            <Text style={styles.titleSettings(width)}>PSI setpoint</Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={trigger.closePressureSetpoint?.toString() || ""}
              onChangeText={(text) =>
                handleChangeValues(text, "closePressureSetpoint")
              }
              keyboardType="numeric"
            />
          </View>
          <View style={styles.pidInputs}>
            <Text style={styles.titleSettings(width)}>PSI increment</Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={trigger.closeAutoAdjustPSIIncrement?.toString() || ""}
              onChangeText={(text) =>
                handleChangeValues(text, "closeAutoAdjustPSIIncrement")
              }
              keyboardType="numeric"
            />
          </View>
        </View>
        <Text style={styles.titleSettings(width)}>Timer setpoint :</Text>
        <TriggerTimer
          totalSec={trigger.closeTimerSetpoint}
          hourValue={timerSetpointHour}
          minValue={timerSetpointMin}
          secValue={timerSetpointSec}
          setHourValue={setTimerSetpointHour}
          setMinValue={setTimerSetpointMin}
          setSecValue={setTimerSetpointSec}
        />
        <Text style={styles.titleSettings(width)}>Auto adjust timer min :</Text>
        <TriggerTimer
          totalSec={trigger.closeAutoAdjustTimerMin}
          hourValue={minAutoAdjustTimerHour}
          minValue={minAutoAdjustTimerMin}
          secValue={minAutoAdjustTimerSec}
          setHourValue={setMinAutoAdjustTimerHour}
          setMinValue={setMinAutoAdjustTimerMin}
          setSecValue={setMinAutoAdjustTimerSec}
        />
        <Text style={styles.titleSettings(width)}>Auto adjust timer max :</Text>
        <TriggerTimer
          totalSec={trigger.closeAutoAdjustTimerMax}
          hourValue={maxAutoAdjustTimerHour}
          minValue={maxAutoAdjustTimerMin}
          secValue={maxAutoAdjustTimerSec}
          setHourValue={setMaxAutoAdjustTimerHour}
          setMinValue={setMaxAutoAdjustTimerMin}
          setSecValue={setMaxAutoAdjustTimerSec}
        />
        <Text style={styles.titleSettings(width)}>
          Auto adjust timer increment :
        </Text>
        <TriggerTimer
          totalSec={trigger.closeAutoAdjustTimerIncrement}
          hourValue={autoAdjustTimerIncrementHour}
          minValue={autoAdjustTimerIncrementMin}
          secValue={autoAdjustTimerIncrementSec}
          setHourValue={setAutoAdjustTimerIncrementHour}
          setMinValue={setAutoAdjustTimerIncrementMin}
          setSecValue={setAutoAdjustTimerIncrementSec}
        />
      </View>
      <View style={styles.containerBtnText}>
        <ButtonUI
          onPress={() => handleSendTriggerCloseAdj()}
          title={"Send"}
          btnStyle={styles.btnSendText(width)}
          txtStyle={styles.TextSendStyle(width)}
        />
      </View>
    </View>
  );
};
export default TriggerCloseADJ;
