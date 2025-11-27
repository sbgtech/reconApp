import { View, Text, TextInput, useWindowDimensions } from "react-native";
import { styles } from "../../style/styles";
import ButtonUI from "../../../ButtonUI";
import { Buffer } from "buffer";
import {
  UART_SERVICE_UUID,
  UART_TX_CHARACTERISTIC_UUID,
} from "../../../Utils/Constants";
import Toast from "react-native-toast-message";
import { Receive } from "../../../Utils/Receive";
import { HandleChange } from "../../../Utils/HandleChange";

const Alarm = ({
  connectedDevice,
  alarm,
  dispatchAlarm,
  fetchDataAlarm,
  setLoading,
}) => {
  const { width } = useWindowDimensions();

  const handleSendAlarmSettings = async () => {
    if (
      alarm.LPAlarmLimitMin === "" ||
      alarm.LPAlarmLimitMax === "" ||
      alarm.TPAlarmLimitMin === "" ||
      alarm.TPAlarmLimitMax === "" ||
      alarm.CPAlarmLimitMin === "" ||
      alarm.CPAlarmLimitMax === ""
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
      const { LSB: LSB_TPAlarmLimitMax, MSB: MSB_TPAlarmLimitMax } =
        Receive.unpackFloatToRegister(alarm.TPAlarmLimitMax);
      const { LSB: LSB_TPAlarmLimitMin, MSB: MSB_TPAlarmLimitMin } =
        Receive.unpackFloatToRegister(alarm.TPAlarmLimitMin);
      const { LSB: LSB_CPAlarmLimitMax, MSB: MSB_CPAlarmLimitMax } =
        Receive.unpackFloatToRegister(alarm.CPAlarmLimitMax);
      const { LSB: LSB_CPAlarmLimitMin, MSB: MSB_CPAlarmLimitMin } =
        Receive.unpackFloatToRegister(alarm.CPAlarmLimitMin);
      const { LSB: LSB_LPAlarmLimitMax, MSB: MSB_LPAlarmLimitMax } =
        Receive.unpackFloatToRegister(alarm.LPAlarmLimitMax);
      const { LSB: LSB_LPAlarmLimitMin, MSB: MSB_LPAlarmLimitMin } =
        Receive.unpackFloatToRegister(alarm.LPAlarmLimitMin);
      const arr = JSON.stringify([
        8,
        286,
        LSB_TPAlarmLimitMax,
        287,
        MSB_TPAlarmLimitMax,
        288,
        LSB_TPAlarmLimitMin,
        289,
        MSB_TPAlarmLimitMin,
        290,
        LSB_CPAlarmLimitMax,
        291,
        MSB_CPAlarmLimitMax,
        292,
        LSB_CPAlarmLimitMin,
        293,
        MSB_CPAlarmLimitMin,
        294,
        LSB_LPAlarmLimitMax,
        295,
        MSB_LPAlarmLimitMax,
        296,
        LSB_LPAlarmLimitMin,
        297,
        MSB_LPAlarmLimitMin,
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
      await Receive.delay(2000);
      await fetchDataAlarm();
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
        <Text style={styles.valveTitle(width)}>Alarm Settings</Text>
        <Text style={styles.titleSettings(width)}>LP Alarm Limit Min</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={alarm.LPAlarmLimitMin?.toString() || ""}
          onChangeText={(text) =>
            HandleChange.handleChanges4Digits(
              text,
              "LPAlarmLimitMin",
              dispatchAlarm
            )
          }
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>LP Alarm Limit Max</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={alarm.LPAlarmLimitMax?.toString() || ""}
          onChangeText={(text) =>
            HandleChange.handleChanges4Digits(
              text,
              "LPAlarmLimitMax",
              dispatchAlarm
            )
          }
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>TP Alarm Limit Min</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={alarm.TPAlarmLimitMin?.toString() || ""}
          onChangeText={(text) =>
            HandleChange.handleChanges4Digits(
              text,
              "TPAlarmLimitMin",
              dispatchAlarm
            )
          }
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>TP Alarm Limit Max</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={alarm.TPAlarmLimitMax?.toString() || ""}
          onChangeText={(text) =>
            HandleChange.handleChanges4Digits(
              text,
              "TPAlarmLimitMax",
              dispatchAlarm
            )
          }
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>CP Alarm Limit Min</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={alarm.CPAlarmLimitMin?.toString() || ""}
          onChangeText={(text) =>
            HandleChange.handleChanges4Digits(
              text,
              "CPAlarmLimitMin",
              dispatchAlarm
            )
          }
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>CP Alarm Limit Max</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={alarm.CPAlarmLimitMax?.toString() || ""}
          onChangeText={(text) =>
            HandleChange.handleChanges4Digits(
              text,
              "CPAlarmLimitMax",
              dispatchAlarm
            )
          }
          keyboardType="numeric"
        />
      </View>
      <View style={styles.containerBtnText}>
        <ButtonUI
          onPress={() => handleSendAlarmSettings()}
          title={"Send"}
          btnStyle={styles.btnSendText(width)}
          txtStyle={styles.TextSendStyle(width)}
        />
      </View>
    </View>
  );
};
export default Alarm;
