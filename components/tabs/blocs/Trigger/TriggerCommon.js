import { useState } from "react";
import { View, Text, TextInput, useWindowDimensions } from "react-native";
import { styles } from "../../style/styles";
import ButtonUI from "../../../ButtonUI";
import { Buffer } from "buffer";
import {
  UART_SERVICE_UUID,
  UART_TX_CHARACTERISTIC_UUID,
} from "../../../Utils/Constants";
import Toast from "react-native-toast-message";
import TriggerTimer from "./TriggerTimer";
import { Receive } from "../../../Utils/Receive";
import { HandleChange } from "../../../Utils/HandleChange";

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

  const handleSendCommonSettings = async () => {
    try {
      let arr;
      const totalSecondsMin =
        Number(minArrivalHour) * 3600 +
        Number(minArrivalMin) * 60 +
        Number(minArrivalSec);

      const totalSecondsMax =
        Number(maxArrivalHour) * 3600 +
        Number(maxArrivalMin) * 60 +
        Number(maxArrivalSec);

      const { LSB: LSB_Min, MSB: MSB_Min } =
        Receive.unpackFloatToRegister(totalSecondsMin);
      const { LSB: LSB_Max, MSB: MSB_Max } =
        Receive.unpackFloatToRegister(totalSecondsMax);
      const { LSB: LSB_closeDelayTimer, MSB: MSB_closeDelayTimer } =
        Receive.unpackFloatToRegister(trigger.closeDelayTimer);

      if (trigger?.closeTriggerSelectEnable === 6) {
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
        } else if (Number(totalSecondsMin) >= Number(totalSecondsMax)) {
          Toast.show({
            type: "error",
            text1: "Warning",
            text2: "The max arrival time must be more than min arrival time",
            visibilityTime: 4000,
          });
          return;
        } else {
          arr = JSON.stringify([
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
        }
      } else {
        if (
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
        } else if (Number(totalSecondsMin) >= Number(totalSecondsMax)) {
          Toast.show({
            type: "error",
            text1: "Warning",
            text2: "The max arrival time must be more than min arrival time",
            visibilityTime: 4000,
          });
          return;
        }
        arr = JSON.stringify([
          6,
          224,
          LSB_Min,
          225,
          MSB_Min,
          226,
          LSB_Max,
          227,
          MSB_Max,
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
    <View style={styles.settingsSection(width)} key={"card1"}>
      <View style={styles.inputContainer}>
        <Text style={styles.valveTitle(width)}>Commun Settings</Text>
        <Text style={styles.titleSettings(width)}>Min Arrival Time</Text>
        <TriggerTimer
          totalSec={trigger.minArrivalTime}
          hourValue={minArrivalHour}
          minValue={minArrivalMin}
          secValue={minArrivalSec}
          setHourValue={setMinArrivalHour}
          setMinValue={setMinArrivalMin}
          setSecValue={setMinArrivalSec}
        />
        <Text style={styles.titleSettings(width)}>Max Arrival Time</Text>
        <TriggerTimer
          totalSec={trigger.maxArrivalTime}
          hourValue={maxArrivalHour}
          minValue={maxArrivalMin}
          secValue={maxArrivalSec}
          setHourValue={setMaxArrivalHour}
          setMinValue={setMaxArrivalMin}
          setSecValue={setMaxArrivalSec}
        />
        {trigger.closeTriggerSelectEnable !== null &&
          trigger?.closeTriggerSelectEnable === 6 && (
            <View>
              <Text style={styles.titleSettings(width)}>Close delay (SEC)</Text>
              <TextInput
                style={styles.inputSettings(width)}
                value={trigger.closeDelayTimer?.toString() || ""}
                onChangeText={(text) =>
                  HandleChange.handleChanges4Digits(
                    text,
                    "closeDelayTimer",
                    dispatchTrigger
                  )
                }
                keyboardType="numeric"
              />
            </View>
          )}
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
