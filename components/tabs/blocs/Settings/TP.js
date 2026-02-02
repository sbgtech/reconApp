import { View, Text, TextInput, useWindowDimensions } from "react-native";
import { styles } from "../../style/styles";
import ButtonUI from "../../../ButtonUI";
import Dropdown from "../Dropdown";
import { Buffer } from "buffer";
import Toast from "react-native-toast-message";
import {
  UART_SERVICE_UUID,
  UART_TX_CHARACTERISTIC_UUID,
} from "../../../Utils/Constants";
import { HandleChange } from "../../../Utils/HandleChange";
import { Receive } from "../../../Utils/Receive";

const TP = ({
  connectedDevice,
  settings,
  dispatchSettings,
  fetchDataSettings,
  setLoading,
}) => {
  const { width } = useWindowDimensions();

  const TP_type = ["Voltage", "4-20mA"];

  // send array of TP values to device
  const handleSendTP = async () => {
    if (
      settings.TPSensorMax === "" ||
      settings.TPSensorMin === "" ||
      settings.TPVoltageMax === "" ||
      settings.TPVoltageMin === ""
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "All fields (TP sensor and TP Voltage) must be filled",
        visibilityTime: 3000,
      });
      return; // Exit the function if validation fails
    } else if (Number(settings.TPSensorMin) > Number(settings.TPSensorMax)) {
      Toast.show({
        type: "error",
        text1: "Warning",
        text2: "The TP Sensor max must be more than TP Sensor min",
        visibilityTime: 4000,
      });
    } else if (Number(settings.TPVoltageMin) > Number(settings.TPVoltageMax)) {
      Toast.show({
        type: "error",
        text1: "Warning",
        text2: "The TP Voltage max must be more than TP Voltage min",
        visibilityTime: 4000,
      });
    } else {
      try {
        const arr = JSON.stringify([
          3,
          106,
          settings.TPTypeIndex,
          107,
          Number(settings.TPSensorMax),
          108,
          Number(settings.TPSensorMin),
          118,
          Number(settings.TPVoltageMax * 10),
          119,
          Number(settings.TPVoltageMin * 10),
        ]);
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
        setLoading(true);
        await Receive.delay(2000);
        await fetchDataSettings();
      } catch (error) {
        console.log(
          "Error with writeCharacteristicWithResponseForService :",
          error
        );
      }
    }
  };

  return (
    <View style={styles.settingsSection(width)} key={"card8"}>
      <View style={styles.inputContainer}>
        <Text style={styles.titleSettings(width)}>TP Sensor type :</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={TP_type}
          selectedIndex={settings.TPTypeIndex}
          setSelectedIndex={(index) => dispatchSettings({ TPTypeIndex: index })}
        />
        <Text style={styles.titleSettings(width)}>TP Sensor max (PSI) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.TPSensorMax?.toString() || ""}
          onChangeText={(text) =>
            HandleChange.handleChanges4Digits(
              text,
              "TPSensorMax",
              dispatchSettings
            )
          }
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>TP Sensor min (PSI) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.TPSensorMin?.toString() || ""}
          onChangeText={(text) =>
            HandleChange.handleChanges4Digits(
              text,
              "TPSensorMin",
              dispatchSettings
            )
          }
          keyboardType="numeric"
        />
        {settings.TPTypeIndex !== null && settings?.TPTypeIndex === 0 && (
          <View>
            <Text style={styles.titleSettings(width)}>
              TP voltage max (V) :
            </Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={settings.TPVoltageMax?.toString() || ""}
              onChangeText={(text) =>
                HandleChange.handleChangesVoltage(
                  text,
                  "TPVoltageMax",
                  dispatchSettings
                )
              }
              keyboardType="numbers-and-punctuation"
            />
            <Text style={styles.titleSettings(width)}>
              TP voltage min (V) :
            </Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={settings.TPVoltageMin?.toString() || ""}
              onChangeText={(text) =>
                HandleChange.handleChangesVoltage(
                  text,
                  "TPVoltageMin",
                  dispatchSettings
                )
              }
              keyboardType="numbers-and-punctuation"
            />
          </View>
        )}
      </View>
      <View style={styles.containerBtnText}>
        <ButtonUI
          onPress={() => handleSendTP()}
          title={"Send"}
          btnStyle={styles.btnSendText(width)}
          txtStyle={styles.TextSendStyle(width)}
        />
      </View>
    </View>
  );
};
export default TP;
