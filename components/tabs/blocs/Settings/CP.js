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

const CP = ({
  connectedDevice,
  settings,
  dispatchSettings,
  fetchDataSettings,
  setLoading,
}) => {
  const { width } = useWindowDimensions();

  const CP_type = ["Voltage", "4-20mA"];

  // send array of CP values to device
  const handleSendCP = async () => {
    if (
      settings.CPSensorMax === "" ||
      settings.CPSensorMin === "" ||
      settings.CPVoltageMax === "" ||
      settings.CPVoltageMin === ""
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "All fields (CP sensor and CP Voltage) must be filled",
        visibilityTime: 3000,
      });
      return; // Exit the function if validation fails
    } else if (Number(settings.CPSensorMin) > Number(settings.CPSensorMax)) {
      Toast.show({
        type: "error",
        text1: "Warning",
        text2: "The CP Sensor max must be more than CP Sensor min",
        visibilityTime: 4000,
      });
    } else if (Number(settings.CPVoltageMin) > Number(settings.CPVoltageMax)) {
      Toast.show({
        type: "error",
        text1: "Warning",
        text2: "The CP Voltage max must be more than CP Voltage min",
        visibilityTime: 4000,
      });
    } else {
      try {
        const arr = JSON.stringify([
          3,
          103,
          settings.CPTypeIndex,
          104,
          Number(settings.CPSensorMax),
          105,
          Number(settings.CPSensorMin),
          118,
          Number(settings.CPVoltageMax * 10),
          119,
          Number(settings.CPVoltageMin * 10),
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
    <View style={styles.settingsSection(width)} key={"card7"}>
      <View style={styles.inputContainer}>
        <Text style={styles.titleSettings(width)}>CP Sensor type :</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={CP_type}
          selectedIndex={settings.CPTypeIndex}
          setSelectedIndex={(index) => dispatchSettings({ CPTypeIndex: index })}
        />
        <Text style={styles.titleSettings(width)}>CP Sensor max (PSI) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.CPSensorMax?.toString() || ""}
          onChangeText={(text) =>
            HandleChange.handleChanges4Digits(
              text,
              "CPSensorMax",
              dispatchSettings
            )
          }
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>CP Sensor min (PSI) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.CPSensorMin?.toString() || ""}
          onChangeText={(text) =>
            HandleChange.handleChanges4Digits(
              text,
              "CPSensorMin",
              dispatchSettings
            )
          }
          keyboardType="numeric"
        />
        {settings.CPTypeIndex !== null && settings?.CPTypeIndex === 0 && (
          <View>
            <Text style={styles.titleSettings(width)}>
              CP voltage max (V) :
            </Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={settings.CPVoltageMax?.toString() || ""}
              onChangeText={(text) =>
                HandleChange.handleChangesVoltage(
                  text,
                  "CPVoltageMax",
                  dispatchSettings
                )
              }
              keyboardType="numbers-and-punctuation"
            />
            <Text style={styles.titleSettings(width)}>
              CP voltage min (V) :
            </Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={settings.CPVoltageMin?.toString() || ""}
              onChangeText={(text) =>
                HandleChange.handleChangesVoltage(
                  text,
                  "CPVoltageMin",
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
          onPress={() => handleSendCP()}
          title={"Send"}
          btnStyle={styles.btnSendText(width)}
          txtStyle={styles.TextSendStyle(width)}
        />
      </View>
    </View>
  );
};
export default CP;
