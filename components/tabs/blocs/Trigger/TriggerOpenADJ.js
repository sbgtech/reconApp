import React, { useState } from "react";
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

  const handleSendTriggerOpenAdj = async () => {
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

      const { LSB: LSB_openAutoAdjustEnable, MSB: MSB_openAutoAdjustEnable } =
        Receive.unpackFloatToRegister(trigger.openAutoAdjustEnable);
      const { LSB: LSB_openAutoAdjustPSIMin, MSB: MSB_openAutoAdjustPSIMin } =
        Receive.unpackFloatToRegister(trigger.openAutoAdjustPSIMin);
      const { LSB: LSB_openAutoAdjustPSIMax, MSB: MSB_openAutoAdjustPSIMax } =
        Receive.unpackFloatToRegister(trigger.openAutoAdjustPSIMax);
      const { LSB: LSB_openPressureSetpoint, MSB: MSB_openPressureSetpoint } =
        Receive.unpackFloatToRegister(trigger.openPressureSetpoint);
      const {
        LSB: LSB_openAutoAdjustPSIIncrement,
        MSB: MSB_openAutoAdjustPSIIncrement,
      } = Receive.unpackFloatToRegister(trigger.openAutoAdjustPSIIncrement);

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
        trigger.openTriggerSelectEnable !== 0 &&
        trigger.openTriggerSelectEnable !== 7 &&
        trigger.openAutoAdjustEnable === 1
      ) {
        if (
          trigger.openAutoAdjustPSIMin === "" ||
          trigger.openAutoAdjustPSIMax === "" ||
          trigger.openPressureSetpoint === "" ||
          trigger.openAutoAdjustPSIIncrement === ""
        ) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "All fields must be filled",
            visibilityTime: 3000,
          });
          return; // Exit the function if validation fails
        } else if (
          Number(trigger.openAutoAdjustPSIMin) >=
          Number(trigger.openAutoAdjustPSIMax)
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
          ]);
        }
      } else if (
        trigger.openTriggerSelectEnable !== 0 &&
        trigger.openTriggerSelectEnable !== 7 &&
        trigger.openAutoAdjustEnable === 0
      ) {
        if (trigger.openPressureSetpoint === "") {
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
          240,
          LSB_openAutoAdjustEnable,
          241,
          MSB_openAutoAdjustEnable,
          230,
          LSB_openPressureSetpoint,
          231,
          MSB_openPressureSetpoint,
        ]);
      } else if (
        trigger.openTriggerSelectEnable === 7 &&
        trigger.openAutoAdjustEnable === 0
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
          240,
          LSB_openAutoAdjustEnable,
          241,
          MSB_openAutoAdjustEnable,
          232,
          LSB_TimerSetpoint,
          233,
          MSB_TimerSetpoint,
        ]);
      } else if (
        trigger.openTriggerSelectEnable === 7 &&
        trigger.openAutoAdjustEnable === 1
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
            240,
            LSB_openAutoAdjustEnable,
            241,
            MSB_openAutoAdjustEnable,
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
        }
      } else if (trigger.openTriggerSelectEnable === 0) {
        arr = JSON.stringify([
          6,
          240,
          LSB_openAutoAdjustEnable,
          241,
          MSB_openAutoAdjustEnable,
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
        <Text style={styles.valveTitle(width)}>Open Auto Adjust</Text>
        <Text style={styles.titleSettings(width)}>Auto Adjust Enable</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={autoAdjustEnableList}
          selectedIndex={trigger.openAutoAdjustEnable}
          setSelectedIndex={(index) =>
            dispatchTrigger({ openAutoAdjustEnable: index })
          }
        />
        {trigger.openTriggerSelectEnable !== 0 &&
          trigger.openTriggerSelectEnable !== 7 && (
            <View>
              {trigger.openAutoAdjustEnable === 1 && (
                <View style={styles.pidInputsContainer}>
                  <View style={styles.pidInputs}>
                    <Text style={styles.titleSettings(width)}>PSI Min</Text>
                    <TextInput
                      style={styles.inputSettings(width)}
                      value={trigger.openAutoAdjustPSIMin?.toString() || ""}
                      onChangeText={(text) =>
                        HandleChange.handleChanges4Digits(
                          text,
                          "openAutoAdjustPSIMin",
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
                      value={trigger.openAutoAdjustPSIMax?.toString() || ""}
                      onChangeText={(text) =>
                        HandleChange.handleChanges4Digits(
                          text,
                          "openAutoAdjustPSIMax",
                          dispatchTrigger
                        )
                      }
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              )}
              <View style={styles.pidInputsContainer}>
                {trigger.openAutoAdjustEnable === 1 && (
                  <View style={styles.pidInputs}>
                    <Text style={styles.titleSettings(width)}>
                      PSI Increment
                    </Text>
                    <TextInput
                      style={styles.inputSettings(width)}
                      value={
                        trigger.openAutoAdjustPSIIncrement?.toString() || ""
                      }
                      onChangeText={(text) =>
                        HandleChange.handleChanges4Digits(
                          text,
                          "openAutoAdjustPSIIncrement",
                          dispatchTrigger
                        )
                      }
                      keyboardType="numeric"
                    />
                  </View>
                )}
                {(trigger.openAutoAdjustEnable === 1 ||
                  trigger.openAutoAdjustEnable === 0) && (
                  <View style={styles.pidInputs}>
                    <Text style={styles.titleSettings(width)}>
                      Pressure Setpoint
                    </Text>
                    <TextInput
                      style={styles.inputSettings(width)}
                      value={trigger.openPressureSetpoint?.toString() || ""}
                      onChangeText={(text) =>
                        HandleChange.handleChanges4Digits(
                          text,
                          "openPressureSetpoint",
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
        {trigger.openTriggerSelectEnable === 7 && (
          <View>
            {(trigger.openAutoAdjustEnable === 1 ||
              trigger.openAutoAdjustEnable === 0) && (
              <View>
                <Text style={styles.titleSettings(width)}>Timer Setpoint</Text>
                <TriggerTimer
                  totalSec={trigger.openTimerSetpoint}
                  hourValue={timerSetpointHour}
                  minValue={timerSetpointMin}
                  secValue={timerSetpointSec}
                  setHourValue={setTimerSetpointHour}
                  setMinValue={setTimerSetpointMin}
                  setSecValue={setTimerSetpointSec}
                />
              </View>
            )}
            {trigger.openAutoAdjustEnable === 1 && (
              <View>
                <Text style={styles.titleSettings(width)}>
                  Auto Adjust Shutin Timer Min
                </Text>
                <TriggerTimer
                  totalSec={trigger.openAutoAdjustTimerMin}
                  hourValue={minAutoAdjustTimerHour}
                  minValue={minAutoAdjustTimerMin}
                  secValue={minAutoAdjustTimerSec}
                  setHourValue={setMinAutoAdjustTimerHour}
                  setMinValue={setMinAutoAdjustTimerMin}
                  setSecValue={setMinAutoAdjustTimerSec}
                />
                <Text style={styles.titleSettings(width)}>
                  Auto Adjust Shutin Timer Max
                </Text>
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
                  Auto Adjust Shutin Timer Increment
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
            )}
          </View>
        )}
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
