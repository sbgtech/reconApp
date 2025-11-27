import { useState } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { styles } from "../../style/styles";
import ButtonUI from "../../../ButtonUI";
import { Buffer } from "buffer";
import {
  UART_SERVICE_UUID,
  UART_TX_CHARACTERISTIC_UUID,
} from "../../../Utils/Constants";
import Toast from "react-native-toast-message";
import TriggerTimer from "./TriggerTimer";
import Dropdown from "../Dropdown";
import { Receive } from "../../../Utils/Receive";

const TriggerOpenBackup = ({
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

  // The dropdown select options for the trigger select enable in the open mode
  const openTriggerSelectEnableList = [
    "OFF",
    "Tubing PSI",
    "Casing PSI",
    "Load Factor",
    "Tubing - Line",
    "Casing - Line",
    "Casing - Tubing",
    "Shutin Timer",
  ];

  // The dropdown select options for backup timer
  const backupTimerList = ["Disable", "Enable"];

  const handleSendTriggerOpenBackup = async () => {
    try {
      let arr;
      const totalSecondsMinBackupTimer =
        Number(minBackupTimerHour) * 3600 +
        Number(minBackupTimerMin) * 60 +
        Number(minBackupTimerSec);

      const totalSecondsMaxBackupTimer =
        Number(maxBackupTimerHour) * 3600 +
        Number(maxBackupTimerMin) * 60 +
        Number(maxBackupTimerSec);

      const {
        LSB: LSB_openTriggerSelectEnable,
        MSB: MSB_openTriggerSelectEnable,
      } = Receive.unpackFloatToRegister(trigger.openTriggerSelectEnable);
      const { LSB: LSB_openBackupTimerEnable, MSB: MSB_openBackupTimerEnable } =
        Receive.unpackFloatToRegister(trigger.openBackupTimerEnable);
      const { LSB: LSB_MinBackupTimer, MSB: MSB_MinBackupTimer } =
        Receive.unpackFloatToRegister(totalSecondsMinBackupTimer);
      const { LSB: LSB_MaxBackupTimer, MSB: MSB_MaxBackupTimer } =
        Receive.unpackFloatToRegister(totalSecondsMaxBackupTimer);
      if (trigger?.openBackupTimerEnable === 1) {
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
        } else if (
          Number(totalSecondsMinBackupTimer) >=
          Number(totalSecondsMaxBackupTimer)
        ) {
          Toast.show({
            type: "error",
            text1: "Warning",
            text2: "The backup timer max must be more than backup timer min",
            visibilityTime: 4000,
          });
          return;
        } else {
          arr = JSON.stringify([
            6,
            228,
            LSB_openTriggerSelectEnable,
            229,
            MSB_openTriggerSelectEnable,
            234,
            LSB_openBackupTimerEnable,
            235,
            MSB_openBackupTimerEnable,
            236,
            LSB_MinBackupTimer,
            237,
            MSB_MinBackupTimer,
            238,
            LSB_MaxBackupTimer,
            239,
            MSB_MaxBackupTimer,
          ]);
        }
      } else {
        arr = JSON.stringify([
          6,
          228,
          LSB_openTriggerSelectEnable,
          229,
          MSB_openTriggerSelectEnable,
          234,
          LSB_openBackupTimerEnable,
          235,
          MSB_openBackupTimerEnable,
        ]);
      }
      const buffer = Buffer.from(arr + "\n", "utf-8");
      await connectedDevice?.writeCharacteristicWithResponseForService(
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
      console.log(arr);
      console.log(JSON.parse(arr).length);
      setLoading(true);
      await Receive.delay(2000);
      await fetchDataTrigger();
    } catch (error) {
      console.log(
        "Error with writeCharacteristicWithResponseForService :",
        error
      );
    }
  };

  return (
    <View style={styles.settingsSection(width)} key={"card2"}>
      <View style={styles.inputContainer}>
        <Text style={styles.valveTitle(width)}>Open Trigger</Text>
        <Text style={styles.titleSettings(width)}>Trigger Select Enable</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={openTriggerSelectEnableList}
          selectedIndex={trigger.openTriggerSelectEnable}
          setSelectedIndex={(index) =>
            dispatchTrigger({ openTriggerSelectEnable: index })
          }
        />
        <Text style={styles.titleSettings(width)}>Backup Timer Enable</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={backupTimerList}
          selectedIndex={trigger.openBackupTimerEnable}
          setSelectedIndex={(index) =>
            dispatchTrigger({ openBackupTimerEnable: index })
          }
        />
        {trigger?.openBackupTimerEnable !== null &&
          trigger?.openBackupTimerEnable === 1 && (
            <View>
              <Text style={styles.titleSettings(width)}>Backup Timer Min</Text>
              <TriggerTimer
                totalSec={trigger.openBackupTimerMin}
                hourValue={minBackupTimerHour}
                minValue={minBackupTimerMin}
                secValue={minBackupTimerSec}
                setHourValue={setMinBackupTimerHour}
                setMinValue={setMinBackupTimerMin}
                setSecValue={setMinBackupTimerSec}
              />
              <Text style={styles.titleSettings(width)}>Backup Timer Max</Text>
              <TriggerTimer
                totalSec={trigger.openBackupTimerMax}
                hourValue={maxBackupTimerHour}
                minValue={maxBackupTimerMin}
                secValue={maxBackupTimerSec}
                setHourValue={setMaxBackupTimerHour}
                setMinValue={setMaxBackupTimerMin}
                setSecValue={setMaxBackupTimerSec}
              />
            </View>
          )}
      </View>
      <View style={styles.containerBtnText}>
        <ButtonUI
          onPress={() => handleSendTriggerOpenBackup()}
          title={"Send"}
          btnStyle={styles.btnSendText(width)}
          txtStyle={styles.TextSendStyle(width)}
        />
      </View>
    </View>
  );
};
export default TriggerOpenBackup;
