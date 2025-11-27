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

const PresureIntermit = ({
  connectedDevice,
  settings,
  dispatchSettings,
  fetchDataSettings,
  setLoading,
}) => {
  const { width } = useWindowDimensions();

  // send array of Pressure Intermit values to device
  const handleSendPressureIntermit = async () => {
    if (
      settings.receivedPressureMaxPSI === "" ||
      settings.receivedPressureMinPSI === ""
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Max PSI & Min PSI must be filled",
        visibilityTime: 3000,
      });
      return; // Exit the function if validation fails
    } else if (
      Number(settings.receivedPressureMinPSI) >
      Number(settings.receivedPressureMaxPSI)
    ) {
      Toast.show({
        type: "error",
        text1: "Warning",
        text2: "The Max PSI must be more than Min PSI",
        visibilityTime: 4000,
      });
    } else {
      try {
        const arr = JSON.stringify([
          3,
          159,
          settings.receivedPressureSourceIndex,
          160,
          Number(settings.receivedPressureMaxPSI),
          161,
          Number(settings.receivedPressureMinPSI),
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
    <View style={styles.settingsSection(width)} key={"card5"}>
      <View style={styles.inputContainer}>
        <Text style={styles.titleSettings(width)}>
          Pressure intermit source :
        </Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={["Line", "Tubing", "Casing"]}
          selectedIndex={settings.receivedPressureSourceIndex}
          setSelectedIndex={(index) =>
            dispatchSettings({ receivedPressureSourceIndex: index })
          }
        />
        <Text style={styles.titleSettings(width)}>
          Pressure intermit Max PSI :
        </Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.receivedPressureMaxPSI?.toString() || ""}
          onChangeText={(text) =>
            HandleChange.handleChanges4Digits(
              text,
              "receivedPressureMaxPSI",
              dispatchSettings
            )
          }
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>
          Pressure intermit Min PSI :
        </Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.receivedPressureMinPSI?.toString() || ""}
          onChangeText={(text) =>
            HandleChange.handleChanges4Digits(
              text,
              "receivedPressureMinPSI",
              dispatchSettings
            )
          }
          keyboardType="numeric"
        />
      </View>
      <View style={styles.containerBtnText}>
        <ButtonUI
          onPress={() => handleSendPressureIntermit()}
          title={"Send"}
          btnStyle={styles.btnSendText(width)}
          txtStyle={styles.TextSendStyle(width)}
        />
      </View>
    </View>
  );
};
export default PresureIntermit;
