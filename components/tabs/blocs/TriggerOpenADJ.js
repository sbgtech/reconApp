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

const TriggerOpenADJ = ({
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

  const handleSendTriggerOpenAdj = async () => {
    if (
      trigger.openAutoAdjustPSIMin === "" ||
      trigger.openAutoAdjustPSIMax === "" ||
      trigger.openPressureSetpoint === "" ||
      trigger.openAutoAdjustPSIIncrement === "" ||
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

      const { LSB: LSB_openAutoAdjustEnable, MSB: MSB_openAutoAdjustEnable } =
        unpackFloatToRegister(trigger.openAutoAdjustEnable);
      const { LSB: LSB_openAutoAdjustPSIMin, MSB: MSB_openAutoAdjustPSIMin } =
        unpackFloatToRegister(trigger.openAutoAdjustPSIMin);
      const { LSB: LSB_openAutoAdjustPSIMax, MSB: MSB_openAutoAdjustPSIMax } =
        unpackFloatToRegister(trigger.openAutoAdjustPSIMax);
      const { LSB: LSB_openPressureSetpoint, MSB: MSB_openPressureSetpoint } =
        unpackFloatToRegister(trigger.openPressureSetpoint);
      const {
        LSB: LSB_openAutoAdjustPSIIncrement,
        MSB: MSB_openAutoAdjustPSIIncrement,
      } = unpackFloatToRegister(trigger.openAutoAdjustPSIIncrement);

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
        240,
        LSB_openAutoAdjustEnable,
        241,
        MSB_openAutoAdjustEnable,
        242,
        LSB_openAutoAdjustPSIMin,
        243,
        MSB_openAutoAdjustPSIMin,
        244,
        LSB_openAutoAdjustPSIMax,
        245,
        MSB_openAutoAdjustPSIMax,
        230,
        LSB_openPressureSetpoint,
        231,
        MSB_openPressureSetpoint,
        246,
        LSB_openAutoAdjustPSIIncrement,
        247,
        MSB_openAutoAdjustPSIIncrement,
        232,
        LSB_TimerSetpoint,
        233,
        MSB_TimerSetpoint,
        248,
        LSB_MinAutoAdjustTimer,
        249,
        MSB_MinAutoAdjustTimer,
        250,
        LSB_MaxAutoAdjustTimer,
        251,
        MSB_MaxAutoAdjustTimer,
        252,
        LSB_AutoAdjustTimerIncrement,
        253,
        MSB_AutoAdjustTimerIncrement,
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
    <View style={styles.settingsSection(width)} key={"card3"}>
      <View style={styles.inputContainer}>
        <Text style={styles.valveTitle(width)}>Open Auto Adjust System</Text>
        <Text style={styles.titleSettings(width)}>Auto adjust enable :</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={autoAdjustEnableList}
          selectedIndex={trigger.openAutoAdjustEnable}
          setSelectedIndex={(index) =>
            dispatchTrigger({ openAutoAdjustEnable: index })
          }
        />
        <View style={styles.pidInputsContainer}>
          <View style={styles.pidInputs}>
            <Text style={styles.titleSettings(width)}>PSI min</Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={trigger.openAutoAdjustPSIMin?.toString() || ""}
              onChangeText={(text) =>
                handleChangeValues(text, "openAutoAdjustPSIMin")
              }
              keyboardType="numeric"
            />
          </View>
          <View style={styles.pidInputs}>
            <Text style={styles.titleSettings(width)}>PSI max</Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={trigger.openAutoAdjustPSIMax?.toString() || ""}
              onChangeText={(text) =>
                handleChangeValues(text, "openAutoAdjustPSIMax")
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
              value={trigger.openPressureSetpoint?.toString() || ""}
              onChangeText={(text) =>
                handleChangeValues(text, "openPressureSetpoint")
              }
              keyboardType="numeric"
            />
          </View>
          <View style={styles.pidInputs}>
            <Text style={styles.titleSettings(width)}>PSI increment</Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={trigger.openAutoAdjustPSIIncrement?.toString() || ""}
              onChangeText={(text) =>
                handleChangeValues(text, "openAutoAdjustPSIIncrement")
              }
              keyboardType="numeric"
            />
          </View>
        </View>
        <Text style={styles.titleSettings(width)}>Timer setpoint</Text>
        <TriggerTimer
          totalSec={trigger.openTimerSetpoint}
          hourValue={timerSetpointHour}
          minValue={timerSetpointMin}
          secValue={timerSetpointSec}
          setHourValue={setTimerSetpointHour}
          setMinValue={setTimerSetpointMin}
          setSecValue={setTimerSetpointSec}
        />
        <Text style={styles.titleSettings(width)}>Auto adjust timer min :</Text>
        <TriggerTimer
          totalSec={trigger.openAutoAdjustTimerMin}
          hourValue={minAutoAdjustTimerHour}
          minValue={minAutoAdjustTimerMin}
          secValue={minAutoAdjustTimerSec}
          setHourValue={setMinAutoAdjustTimerHour}
          setMinValue={setMinAutoAdjustTimerMin}
          setSecValue={setMinAutoAdjustTimerSec}
        />
        <Text style={styles.titleSettings(width)}>Auto adjust timer max :</Text>
        <TriggerTimer
          totalSec={trigger.openAutoAdjustTimerMax}
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
          totalSec={trigger.openAutoAdjustTimerIncrement}
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
          onPress={() => handleSendTriggerOpenAdj()}
          title={"Send"}
          btnStyle={styles.btnSendText(width)}
          txtStyle={styles.TextSendStyle(width)}
        />
      </View>
    </View>
  );
};
export default TriggerOpenADJ;
