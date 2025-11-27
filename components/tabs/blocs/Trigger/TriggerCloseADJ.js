import { useState } from "react";
import { View, Text, useWindowDimensions, TextInput } from "react-native";
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
import { HandleChange } from "../../../Utils/HandleChange";

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

  const handleSendTriggerCloseAdj = async () => {
    try {
      let arr;
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
        Receive.unpackFloatToRegister(trigger.closeAutoAdjustEnable);
      const { LSB: LSB_closeAutoAdjustPSIMin, MSB: MSB_closeAutoAdjustPSIMin } =
        Receive.unpackFloatToRegister(trigger.closeAutoAdjustPSIMin);
      const { LSB: LSB_closeAutoAdjustPSIMax, MSB: MSB_closeAutoAdjustPSIMax } =
        Receive.unpackFloatToRegister(trigger.closeAutoAdjustPSIMax);
      const { LSB: LSB_closePressureSetpoint, MSB: MSB_closePressureSetpoint } =
        Receive.unpackFloatToRegister(trigger.closePressureSetpoint);
      const {
        LSB: LSB_closeAutoAdjustPSIIncrement,
        MSB: MSB_closeAutoAdjustPSIIncrement,
      } = Receive.unpackFloatToRegister(trigger.closeAutoAdjustPSIIncrement);

      const { LSB: LSB_TimerSetpoint, MSB: MSB_TimerSetpoint } =
        Receive.unpackFloatToRegister(totalSecondsTimerSetpoint);

      const { LSB: LSB_MinAutoAdjustTimer, MSB: MSB_MinAutoAdjustTimer } =
        Receive.unpackFloatToRegister(totalSecondsMinAutoAdjustTimer);

      const { LSB: LSB_MaxAutoAdjustTimer, MSB: MSB_MaxAutoAdjustTimer } =
        Receive.unpackFloatToRegister(totalSecondsMaxAutoAdjustTimer);

      const {
        LSB: LSB_AutoAdjustTimerIncrement,
        MSB: MSB_AutoAdjustTimerIncrement,
      } = Receive.unpackFloatToRegister(totalSecondsAutoAdjustTimerIncrement);

      if (
        trigger.closeTriggerSelectEnable !== 0 &&
        trigger.closeTriggerSelectEnable !== 7 &&
        trigger.closeAutoAdjustEnable === 1
      ) {
        if (
          trigger.closeAutoAdjustPSIMin === "" ||
          trigger.closeAutoAdjustPSIMax === "" ||
          trigger.closePressureSetpoint === "" ||
          trigger.closeAutoAdjustPSIIncrement === ""
        ) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "All fields must be filled",
            visibilityTime: 3000,
          });
          return; // Exit the function if validation fails
        } else if (
          Number(trigger.closeAutoAdjustPSIMin) >=
          Number(trigger.closeAutoAdjustPSIMax)
        ) {
          Toast.show({
            type: "error",
            text1: "Warning",
            text2: "The PSI max must be more than PSI min",
            visibilityTime: 4000,
          });
          return;
        } else {
          arr = JSON.stringify([
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
          ]);
        }
      } else if (
        trigger.closeTriggerSelectEnable !== 0 &&
        trigger.closeTriggerSelectEnable !== 7 &&
        trigger.closeAutoAdjustEnable === 0
      ) {
        if (trigger.closePressureSetpoint === "") {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Pressure Setpoint must be filled",
            visibilityTime: 3000,
          });
          return; // Exit the function if validation fails
        }
        arr = JSON.stringify([
          6,
          266,
          LSB_closeAutoAdjustEnable,
          267,
          MSB_closeAutoAdjustEnable,
          256,
          LSB_closePressureSetpoint,
          257,
          MSB_closePressureSetpoint,
        ]);
      } else if (
        trigger.closeTriggerSelectEnable === 7 &&
        trigger.closeAutoAdjustEnable === 0
      ) {
        if (
          timerSetpointHour === "" ||
          timerSetpointMin === "" ||
          timerSetpointSec === ""
        ) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Timer Setpoint must be filled",
            visibilityTime: 3000,
          });
          return; // Exit the function if validation fails
        }
        arr = JSON.stringify([
          6,
          266,
          LSB_closeAutoAdjustEnable,
          267,
          MSB_closeAutoAdjustEnable,
          258,
          LSB_TimerSetpoint,
          259,
          MSB_TimerSetpoint,
        ]);
      } else if (
        trigger.closeTriggerSelectEnable === 7 &&
        trigger.closeAutoAdjustEnable === 1
      ) {
        if (
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
        } else if (
          Number(totalSecondsMinAutoAdjustTimer) >=
          Number(totalSecondsMaxAutoAdjustTimer)
        ) {
          Toast.show({
            type: "error",
            text1: "Warning",
            text2: "The Shutin timer max must be more than Shutin timer min",
            visibilityTime: 4000,
          });
          return;
        } else {
          arr = JSON.stringify([
            6,
            266,
            LSB_closeAutoAdjustEnable,
            267,
            MSB_closeAutoAdjustEnable,
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
        }
      } else if (trigger.closeTriggerSelectEnable === 0) {
        arr = JSON.stringify([
          6,
          266,
          LSB_closeAutoAdjustEnable,
          267,
          MSB_closeAutoAdjustEnable,
        ]);
      }
      const buffer = Buffer.from(arr + "\n", "utf-8");
      await connectedDevice?.writeCharacteristicWithResponseForService(
        UART_SERVICE_UUID,
        UART_TX_CHARACTERISTIC_UUID,
        buffer.toString("base64")
      );
      console.log(arr);
      console.log(JSON.parse(arr).length);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Data sent successfully",
        visibilityTime: 3000,
      });
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
    <View style={styles.settingsSection(width)} key={"card3"}>
      <View style={styles.inputContainer}>
        <Text style={styles.valveTitle(width)}>Close Auto Adjust</Text>
        <Text style={styles.titleSettings(width)}>Auto Adjust Enable</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={autoAdjustEnableList}
          selectedIndex={trigger.closeAutoAdjustEnable}
          setSelectedIndex={(index) =>
            dispatchTrigger({ closeAutoAdjustEnable: index })
          }
        />
        {trigger.closeTriggerSelectEnable !== 0 &&
          trigger.closeTriggerSelectEnable !== 7 && (
            <View>
              {trigger.closeAutoAdjustEnable === 1 && (
                <View style={styles.pidInputsContainer}>
                  <View style={styles.pidInputs}>
                    <Text style={styles.titleSettings(width)}>PSI Min</Text>
                    <TextInput
                      style={styles.inputSettings(width)}
                      value={trigger.closeAutoAdjustPSIMin?.toString() || ""}
                      onChangeText={(text) =>
                        HandleChange.handleChanges4Digits(
                          text,
                          "closeAutoAdjustPSIMin",
                          dispatchTrigger
                        )
                      }
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.pidInputs}>
                    <Text style={styles.titleSettings(width)}>PSI Max</Text>
                    <TextInput
                      style={styles.inputSettings(width)}
                      value={trigger.closeAutoAdjustPSIMax?.toString() || ""}
                      onChangeText={(text) =>
                        HandleChange.handleChanges4Digits(
                          text,
                          "closeAutoAdjustPSIMax",
                          dispatchTrigger
                        )
                      }
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              )}
              <View style={styles.pidInputsContainer}>
                {trigger.closeAutoAdjustEnable === 1 && (
                  <View style={styles.pidInputs}>
                    <Text style={styles.titleSettings(width)}>
                      PSI Increment
                    </Text>
                    <TextInput
                      style={styles.inputSettings(width)}
                      value={
                        trigger.closeAutoAdjustPSIIncrement?.toString() || ""
                      }
                      onChangeText={(text) =>
                        HandleChange.handleChanges4Digits(
                          text,
                          "closeAutoAdjustPSIIncrement",
                          dispatchTrigger
                        )
                      }
                      keyboardType="numeric"
                    />
                  </View>
                )}
                {(trigger.closeAutoAdjustEnable === 1 ||
                  trigger.closeAutoAdjustEnable === 0) && (
                  <View style={styles.pidInputs}>
                    <Text style={styles.titleSettings(width)}>
                      Pressure Setpoint
                    </Text>
                    <TextInput
                      style={styles.inputSettings(width)}
                      value={trigger.closePressureSetpoint?.toString() || ""}
                      onChangeText={(text) =>
                        HandleChange.handleChanges4Digits(
                          text,
                          "closePressureSetpoint",
                          dispatchTrigger
                        )
                      }
                      keyboardType="numeric"
                    />
                  </View>
                )}
              </View>
            </View>
          )}
        {trigger.closeTriggerSelectEnable === 7 && (
          <View>
            {(trigger.closeAutoAdjustEnable === 1 ||
              trigger.closeAutoAdjustEnable === 0) && (
              <View>
                <Text style={styles.titleSettings(width)}>Timer Setpoint</Text>
                <TriggerTimer
                  totalSec={trigger.closeTimerSetpoint}
                  hourValue={timerSetpointHour}
                  minValue={timerSetpointMin}
                  secValue={timerSetpointSec}
                  setHourValue={setTimerSetpointHour}
                  setMinValue={setTimerSetpointMin}
                  setSecValue={setTimerSetpointSec}
                />
              </View>
            )}
            {trigger.closeAutoAdjustEnable === 1 && (
              <View>
                <Text style={styles.titleSettings(width)}>
                  Auto Adjust AF Timer Min
                </Text>
                <TriggerTimer
                  totalSec={trigger.closeAutoAdjustTimerMin}
                  hourValue={minAutoAdjustTimerHour}
                  minValue={minAutoAdjustTimerMin}
                  secValue={minAutoAdjustTimerSec}
                  setHourValue={setMinAutoAdjustTimerHour}
                  setMinValue={setMinAutoAdjustTimerMin}
                  setSecValue={setMinAutoAdjustTimerSec}
                />
                <Text style={styles.titleSettings(width)}>
                  Auto Adjust AF Timer Max
                </Text>
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
                  Auto Adjust AF Timer Increment
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
            )}
          </View>
        )}
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
