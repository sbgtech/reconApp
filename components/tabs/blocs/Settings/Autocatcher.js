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

const Autocatcher = ({
  connectedDevice,
  settings,
  dispatchSettings,
  fetchDataSettings,
  setLoading,
}) => {
  const { width } = useWindowDimensions();

  const autocatcher = ["Disable", "Enable"];

  // send array of AUTOCATCHER values to device
  const handleSendAutocatcher = async () => {
    if (settings.autocatcherDelay === "") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "All fields of AUTOCATCHER must be filled",
        visibilityTime: 4000,
      });
      return; // Exit the function if validation fails
    } else {
      try {
        const arr = JSON.stringify([
          3,
          141,
          settings.autocatcherIndex,
          143,
          Number(settings.autocatcherDelay),
          158,
          settings.BValveTwinIndex,
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
    <View style={styles.settingsSection(width)} key={"card4"}>
      <View style={styles.inputContainer}>
        <Text style={styles.titleSettings(width)}>AUTOCATCHER :</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={autocatcher}
          selectedIndex={settings.autocatcherIndex}
          setSelectedIndex={(index) =>
            dispatchSettings({ autocatcherIndex: index })
          }
        />
        <Text style={styles.titleSettings(width)}>Delay (sec) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.autocatcherDelay?.toString() || ""}
          onChangeText={(text) =>
            HandleChange.handleChanges3Digits(
              text,
              "autocatcherDelay",
              dispatchSettings
            )
          }
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>B Valve Twin :</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={autocatcher}
          selectedIndex={settings.BValveTwinIndex}
          setSelectedIndex={(index) =>
            dispatchSettings({ BValveTwinIndex: index })
          }
        />
      </View>
      <View style={styles.containerBtnText}>
        <ButtonUI
          onPress={() => handleSendAutocatcher()}
          title={"Send"}
          btnStyle={styles.btnSendText(width)}
          txtStyle={styles.TextSendStyle(width)}
        />
      </View>
    </View>
  );
};
export default Autocatcher;
