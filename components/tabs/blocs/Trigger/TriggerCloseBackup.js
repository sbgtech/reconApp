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

  const flowrateTriggerSource = ["Sales", "Injection Flow"];

  const handleSendTriggerCloseBackup = async () => {
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
        LSB: LSB_closeTriggerSelectEnable,
        MSB: MSB_closeTriggerSelectEnable,
      } = Receive.unpackFloatToRegister(trigger.closeTriggerSelectEnable);
      const {
        LSB: LSB_closeFlowrateTriggerSource,
        MSB: MSB_closeFlowrateTriggerSource,
      } = Receive.unpackFloatToRegister(trigger.closeFlowrateTriggerSource);
      const {
        LSB: LSB_closeBackupTimerEnable,
        MSB: MSB_closeBackupTimerEnable,
      } = Receive.unpackFloatToRegister(trigger.closeBackupTimerEnable);
      const { LSB: LSB_MinBackupTimer, MSB: MSB_MinBackupTimer } =
        Receive.unpackFloatToRegister(totalSecondsMinBackupTimer);
      const { LSB: LSB_MaxBackupTimer, MSB: MSB_MaxBackupTimer } =
        Receive.unpackFloatToRegister(totalSecondsMaxBackupTimer);
      if (trigger?.closeBackupTimerEnable === 1) {
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
            254,
            LSB_closeTriggerSelectEnable,
            255,
            MSB_closeTriggerSelectEnable,
            280,
            LSB_closeFlowrateTriggerSource,
            281,
            MSB_closeFlowrateTriggerSource,
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
        }
      } else if (trigger?.closeTriggerSelectEnable === 6) {
        arr = JSON.stringify([
          6,
          254,
          LSB_closeTriggerSelectEnable,
          255,
          MSB_closeTriggerSelectEnable,
          280,
          LSB_closeFlowrateTriggerSource,
          281,
          MSB_closeFlowrateTriggerSource,
          260,
          LSB_closeBackupTimerEnable,
          261,
          MSB_closeBackupTimerEnable,
        ]);
      } else {
        arr = JSON.stringify([
          6,
          254,
          LSB_closeTriggerSelectEnable,
          255,
          MSB_closeTriggerSelectEnable,
          260,
          LSB_closeBackupTimerEnable,
          261,
          MSB_closeBackupTimerEnable,
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
    <View style={styles.settingsSection(width)} key={"card4"}>
      <View style={styles.inputContainer}>
        <Text style={styles.valveTitle(width)}>Close Trigger</Text>
        <Text style={styles.titleSettings(width)}>Trigger Select Enable</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={closeTriggerSelectEnable}
          selectedIndex={trigger.closeTriggerSelectEnable}
          setSelectedIndex={(index) =>
            dispatchTrigger({ closeTriggerSelectEnable: index })
          }
        />
        {trigger.closeTriggerSelectEnable !== null &&
          trigger?.closeTriggerSelectEnable === 6 && (
            <View>
              <Text style={styles.titleSettings(width)}>
                Flowrate Trigger Source
              </Text>
              <Dropdown
                dropdownTitle={"Select option"}
                list={flowrateTriggerSource}
                selectedIndex={trigger.closeFlowrateTriggerSource}
                setSelectedIndex={(index) =>
                  dispatchTrigger({ closeFlowrateTriggerSource: index })
                }
              />
            </View>
          )}
        <Text style={styles.titleSettings(width)}>Backup Timer Enable</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={backupTimerList}
          selectedIndex={trigger.closeBackupTimerEnable}
          setSelectedIndex={(index) =>
            dispatchTrigger({ closeBackupTimerEnable: index })
          }
        />
        {trigger.closeBackupTimerEnable !== null &&
          trigger?.closeBackupTimerEnable === 1 && (
            <View>
              <Text style={styles.titleSettings(width)}>Backup Timer Min</Text>
              <TriggerTimer
                totalSec={trigger.closeBackupTimerMin}
                hourValue={minBackupTimerHour}
                minValue={minBackupTimerMin}
                secValue={minBackupTimerSec}
                setHourValue={setMinBackupTimerHour}
                setMinValue={setMinBackupTimerMin}
                setSecValue={setMinBackupTimerSec}
              />
              <Text style={styles.titleSettings(width)}>Backup Timer Max</Text>
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
          )}
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
