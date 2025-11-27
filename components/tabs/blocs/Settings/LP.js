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

const LP = ({
  connectedDevice,
  settings,
  dispatchSettings,
  fetchDataSettings,
  setLoading,
}) => {
  const { width } = useWindowDimensions();

  const LP_type = ["Voltage", "4-20mA"];

  // send array of LP values to device
  const handleSendLP = async () => {
    if (
      settings.LPSensorMax === "" ||
      settings.LPSensorMin === "" ||
      settings.LPVoltageMax === "" ||
      settings.LPVoltageMin === ""
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "All fields (LP sensor and LP Voltage) must be filled",
        visibilityTime: 4000,
      });
      return; // Exit the function if validation fails
    } else if (Number(settings.LPSensorMin) > Number(settings.LPSensorMax)) {
      Toast.show({
        type: "error",
        text1: "Warning",
        text2: "The LP Sensor max must be more than LP Sensor min",
        visibilityTime: 4000,
      });
    } else if (Number(settings.LPVoltageMin) > Number(settings.LPVoltageMax)) {
      Toast.show({
        type: "error",
        text1: "Warning",
        text2: "The LP Voltage max must be more than LP Voltage min",
        visibilityTime: 4000,
      });
    } else {
      try {
        const arr = JSON.stringify([
          3,
          100,
          settings.LPTypeIndex,
          101,
          Number(settings.LPSensorMax),
          102,
          Number(settings.LPSensorMin),
          116,
          Number(settings.LPVoltageMax * 10),
          117,
          Number(settings.LPVoltageMin * 10),
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
    <View style={styles.settingsSection(width)} key="card6">
      <View style={styles.inputContainer}>
        <Text style={styles.titleSettings(width)}>LP Sensor type :</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={LP_type}
          selectedIndex={settings.LPTypeIndex}
          setSelectedIndex={(index) => dispatchSettings({ LPTypeIndex: index })}
        />
        <Text style={styles.titleSettings(width)}>LP Sensor max (PSI) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.LPSensorMax?.toString() || ""}
          onChangeText={(text) =>
            HandleChange.handleChanges4Digits(
              text,
              "LPSensorMax",
              dispatchSettings
            )
          }
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>LP Sensor min (PSI) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.LPSensorMin?.toString() || ""}
          onChangeText={(text) =>
            HandleChange.handleChanges4Digits(
              text,
              "LPSensorMin",
              dispatchSettings
            )
          }
          keyboardType="numeric"
        />
        {settings.LPTypeIndex !== null && settings?.LPTypeIndex === 0 && (
          <View>
            <Text style={styles.titleSettings(width)}>
              LP voltage max (V) :
            </Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={settings.LPVoltageMax?.toString() || ""}
              onChangeText={(text) =>
                HandleChange.handleChangesVoltage(
                  text,
                  "LPVoltageMax",
                  dispatchSettings
                )
              }
              keyboardType="numbers-and-punctuation"
            />
            <Text style={styles.titleSettings(width)}>
              LP voltage min (V) :
            </Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={settings.LPVoltageMin?.toString() || ""}
              onChangeText={(text) =>
                HandleChange.handleChangesVoltage(
                  text,
                  "LPVoltageMin",
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
          onPress={() => handleSendLP()}
          title={"Send"}
          btnStyle={styles.btnSendText(width)}
          txtStyle={styles.TextSendStyle(width)}
        />
      </View>
    </View>
  );
};
export default LP;
