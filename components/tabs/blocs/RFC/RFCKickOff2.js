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
import { Receive } from "../../../Utils/Receive";
import { HandleChange } from "../../../Utils/HandleChange";

const RFCKickOff2 = ({
  connectedDevice,
  RFC,
  dispatchRFC,
  fetchDataRFC,
  setLoading,
}) => {
  const { width } = useWindowDimensions();
    const kickOff_enable = ["Disable", "Enable"];

  const handleSendPIDSettings = async () => {
    if (
      RFC.rfcKickOff2Period === "" ||
      RFC.rfcKickOff2CPStep === "" ||
      RFC.rfcKickOff2CPMax === "" ||
      RFC.rfcKickOff2mAStep === ""
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
      const arr = JSON.stringify([
        9,
        50,
        Number(RFC.rfcKickOff2EnableIndex),
        52,
        Number(RFC.rfcKickOff2Period),
        54,
        Number(RFC.rfcKickOff2CPStep),
        56,
        Number(RFC.rfcKickOff2CPMax),
        58,
        Number(RFC.rfcKickOff2mAStep),
      ]);
      const buffer = Buffer.from(arr + "\n", "utf-8");
      await connectedDevice?.writeCharacteristicWithResponseForService(
        UART_SERVICE_UUID,
        UART_TX_CHARACTERISTIC_UUID,
        buffer.toString("base64"),
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
      await fetchDataRFC();
    } catch (error) {
      console.log(
        "Error with writeCharacteristicWithResponseForService :",
        error,
      );
    }
  };

  return (
    <View style={styles.settingsSection(width)} key="card3">
      <View style={styles.inputContainer}>
        <Text style={styles.valveTitle(width)}>KickOff2 Settings</Text>
        <Text style={styles.titleSettings(width)}>KickOff2 Enable</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={kickOff_enable}
          selectedIndex={RFC.rfcKickOff2EnableIndex}
          setSelectedIndex={(index) =>
            dispatchRFC({ rfcKickOff2EnableIndex: index })
          }
        />
        <View style={styles.pidInputsContainer}>
          <View style={styles.pidInputs}>
            <Text style={styles.titleSettings(width)}>Period</Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={RFC.rfcKickOff2Period?.toString() || ""}
              onChangeText={(text) =>
                HandleChange.handleChanges3Digits(text, "rfcKickOff2Period", dispatchRFC)
              }
              keyboardType="numeric"
            />
          </View>
          <View style={styles.pidInputs}>
            <Text style={styles.titleSettings(width)}>CP Step</Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={RFC.rfcKickOff2CPStep?.toString() || ""}
              onChangeText={(text) =>
                HandleChange.handleChanges3Digits(text, "rfcKickOff2CPStep", dispatchRFC)
              }
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={styles.pidInputsContainer}>
          <View style={styles.pidInputs}>
            <Text style={styles.titleSettings(width)}>CP Max</Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={RFC.rfcKickOff2CPMax?.toString() || ""}
              onChangeText={(text) =>
                HandleChange.handleChanges3Digits(text, "rfcKickOff2CPMax", dispatchRFC)
              }
              keyboardType="numeric"
            />
          </View>
          <View style={styles.pidInputs}>
            <Text style={styles.titleSettings(width)}>mA Step</Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={RFC.rfcKickOff2mAStep?.toString() || ""}
              onChangeText={(text) =>
                HandleChange.handleChanges3Digits(text, "rfcKickOff2mAStep", dispatchRFC)
              }
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>
      <View style={styles.containerBtnText}>
        <ButtonUI
          onPress={() => handleSendPIDSettings()}
          title={"Send"}
          btnStyle={styles.btnSendText(width)}
          txtStyle={styles.TextSendStyle(width)}
        />
      </View>
    </View>
  );
};
export default RFCKickOff2;
