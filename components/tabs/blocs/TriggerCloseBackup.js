import React, { useState } from "react";
import { View, Text, useWindowDimensions } from "react-native";
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

const TriggerCloseBackup = ({
  connectedDevice,
  trigger,
  dispatchTrigger,
  fetchDataTrigger,
  setLoading,
}) => {
  // Commun settings
  const { width } = useWindowDimensions();

  const [minBackupTimerHour, setMinBackupTimerHour] = useState("");
  const [minBackupTimerMin, setMinBackupTimerMin] = useState("");
  const [minBackupTimerSec, setMinBackupTimerSec] = useState("");

  const [maxBackupTimerHour, setMaxBackupTimerHour] = useState("");
  const [maxBackupTimerMin, setMaxBackupTimerMin] = useState("");
  const [maxBackupTimerSec, setMaxBackupTimerSec] = useState("");

  // The dropdown select options for the trigger select enable in the close mode
  const closeTriggerSelectEnable = [
    "OFF",
    "Tubing PSI",
    "Casing PSI",
    "Tubing - Line",
    "Casing - Tubing",
    "Casing Upturn",
    "Flow Rate",
    "AfterFlow Timer",
  ];

  // The dropdown select options for backup timer
  const backupTimerList = ["Disable", "Enable"];

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

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSendTriggerCloseBackup = async () => {
    if (
      minBackupTimerHour === "" ||
      minBackupTimerMin === "" ||
      minBackupTimerSec === "" ||
      maxBackupTimerHour === "" ||
      maxBackupTimerMin === "" ||
      maxBackupTimerSec === ""
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
      const totalSecondsMinBackupTimer =
        Number(minBackupTimerHour) * 3600 +
        Number(minBackupTimerMin) * 60 +
        Number(minBackupTimerSec);

      const totalSecondsMaxBackupTimer =
        Number(maxBackupTimerHour) * 3600 +
        Number(maxBackupTimerMin) * 60 +
        Number(maxBackupTimerSec);

      const {
        LSB: LSB_closeTriggerSelectEnable,
        MSB: MSB_closeTriggerSelectEnable,
      } = unpackFloatToRegister(trigger.closeTriggerSelectEnable);
      const {
        LSB: LSB_closeBackupTimerEnable,
        MSB: MSB_closeBackupTimerEnable,
      } = unpackFloatToRegister(trigger.closeBackupTimerEnable);
      const { LSB: LSB_MinBackupTimer, MSB: MSB_MinBackupTimer } =
        unpackFloatToRegister(totalSecondsMinBackupTimer);
      const { LSB: LSB_MaxBackupTimer, MSB: MSB_MaxBackupTimer } =
        unpackFloatToRegister(totalSecondsMaxBackupTimer);
      const arr = JSON.stringify([
        6,
        254,
        LSB_closeTriggerSelectEnable,
        255,
        MSB_closeTriggerSelectEnable,
        260,
        LSB_closeBackupTimerEnable,
        261,
        MSB_closeBackupTimerEnable,
        262,
        LSB_MinBackupTimer,
        263,
        MSB_MinBackupTimer,
        264,
        LSB_MaxBackupTimer,
        265,
        MSB_MaxBackupTimer,
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
    <View style={styles.settingsSection(width)} key={"card4"}>
      <View style={styles.inputContainer}>
        <Text style={styles.valveTitle(width)}>Close Backup Timer</Text>
        <Text style={styles.titleSettings(width)}>Trigger select enable :</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={closeTriggerSelectEnable}
          selectedIndex={trigger.closeTriggerSelectEnable}
          setSelectedIndex={(index) =>
            dispatchTrigger({ closeTriggerSelectEnable: index })
          }
        />
        <Text style={styles.titleSettings(width)}>Backup timer enable :</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={backupTimerList}
          selectedIndex={trigger.closeBackupTimerEnable}
          setSelectedIndex={(index) =>
            dispatchTrigger({ closeBackupTimerEnable: index })
          }
        />
        <Text style={styles.titleSettings(width)}>Backup timer min :</Text>
        <TriggerTimer
          totalSec={trigger.closeBackupTimerMin}
          hourValue={minBackupTimerHour}
          minValue={minBackupTimerMin}
          secValue={minBackupTimerSec}
          setHourValue={setMinBackupTimerHour}
          setMinValue={setMinBackupTimerMin}
          setSecValue={setMinBackupTimerSec}
        />
        <Text style={styles.titleSettings(width)}>Backup timer max :</Text>
        <TriggerTimer
          totalSec={trigger.closeBackupTimerMax}
          hourValue={maxBackupTimerHour}
          minValue={maxBackupTimerMin}
          secValue={maxBackupTimerSec}
          setHourValue={setMaxBackupTimerHour}
          setMinValue={setMaxBackupTimerMin}
          setSecValue={setMaxBackupTimerSec}
        />
      </View>
      <View style={styles.containerBtnText}>
        <ButtonUI
          onPress={() => handleSendTriggerCloseBackup()}
          title={"Send"}
          btnStyle={styles.btnSendText(width)}
          txtStyle={styles.TextSendStyle(width)}
        />
      </View>
    </View>
  );
};
export default TriggerCloseBackup;
