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

const Hilo = ({
  connectedDevice,
  settings,
  dispatchSettings,
  fetchDataSettings,
  setLoading,
}) => {
  const { width } = useWindowDimensions();

  const hiLoMode = ["Disable", "Enable"];

  // send array of HiLo values to device
  const handleSendHiLo = async () => {
    if (
      settings.hiLoHigh === "" ||
      settings.hiLoLow === "" ||
      settings.hiLoDelay === ""
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "All fields (HiLo high, HiLo low and HiLo Delay) must be filled",
        visibilityTime: 4000,
      });
      return; // Exit the function if validation fails
    } else if (Number(settings.hiLoLow) > Number(settings.hiLoHigh)) {
      Toast.show({
        type: "error",
        text1: "Warning",
        text2: "The HiLo high value must be more than HiLo low value",
        visibilityTime: 4000,
      });
    } else {
      try {
        const arr = JSON.stringify([
          3,
          122,
          settings.hiLoModeIndex,
          123,
          Number(settings.hiLoHigh),
          124,
          Number(settings.hiLoLow),
          155,
          Number(settings.hiLoDelay),
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
    <View style={styles.settingsSection(width)} key={"card2"}>
      <View style={styles.inputContainer}>
        <Text style={styles.titleSettings(width)}>HiLo mode :</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={hiLoMode}
          selectedIndex={settings.hiLoModeIndex}
          setSelectedIndex={(index) =>
            dispatchSettings({ hiLoModeIndex: index })
          }
        />
        <Text style={styles.titleSettings(width)}>HiLo high Threshold :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.hiLoHigh?.toString() || ""}
          onChangeText={(text) =>
            HandleChange.handleChanges4Digits(
              text,
              "hiLoHigh",
              dispatchSettings
            )
          }
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>HiLo low Threshold :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.hiLoLow?.toString() || ""}
          onChangeText={(text) =>
            HandleChange.handleChanges4Digits(text, "hiLoLow", dispatchSettings)
          }
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>HiLo Delay :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.hiLoDelay?.toString() || ""}
          onChangeText={(text) =>
            HandleChange.handleChanges3Digits(
              text,
              "hiLoDelay",
              dispatchSettings
            )
          }
          keyboardType="numeric"
        />
      </View>
      <View style={styles.containerBtnText}>
        <ButtonUI
          onPress={() => handleSendHiLo()}
          title={"Send"}
          btnStyle={styles.btnSendText(width)}
          txtStyle={styles.TextSendStyle(width)}
        />
      </View>
    </View>
  );
};
export default Hilo;
