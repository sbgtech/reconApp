import { View, Text, TextInput, useWindowDimensions } from "react-native";
import { styles } from "../../style/styles";
import ButtonUI from "../../../ButtonUI";
import { Buffer } from "buffer";
import Toast from "react-native-toast-message";
import {
  UART_SERVICE_UUID,
  UART_TX_CHARACTERISTIC_UUID,
} from "../../../Utils/Constants";
import { Receive } from "../../../Utils/Receive";
import { HandleChange } from "../../../Utils/HandleChange";

const RFCPID = ({
  connectedDevice,
  RFC,
  dispatchRFC,
  fetchDataRFC,
  setLoading,
}) => {
  const { width } = useWindowDimensions();

  const handleSendRFCPID = async () => {
    if (
      RFC.rfcPidSP === "" ||
      RFC.rfcPidKP === "" ||
      RFC.rfcPidKI === "" ||
      RFC.rfcPidKD === "" ||
      RFC.rfcPidINIT === "" ||
      RFC.rfcPidDB === "" ||
      RFC.rfcPidLL === ""
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
        166,
        Number(RFC.rfcPidSP),
        167,
        Number(RFC.rfcPidKP),
        168,
        Number(RFC.rfcPidKI),
        169,
        Number(RFC.rfcPidKD),
        170,
        Number(RFC.rfcPidINIT),
        171,
        Number(RFC.rfcPidDB),
        172,
        Number(RFC.rfcPidLL)
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
      await fetchDataRFC();
    } catch (error) {
      console.log(
        "Error with writeCharacteristicWithResponseForService :",
        error
      );
    }
  };

  return (
    <View style={styles.settingsSection(width)} key="card2">
      <View style={styles.inputContainer}>
        <Text style={styles.valveTitle(width)}>PID Settings</Text>
        <Text style={styles.titleSettings(width)}>PID SP</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={RFC.rfcPidSP?.toString() || ""}
          onChangeText={(text) =>
            HandleChange.handleChanges4Digits(text, "rfcPidSP", dispatchRFC)
          }
          keyboardType="numeric"
        />
        <View style={styles.pidInputsContainer}>
          <View style={styles.pidInputs}>
            <Text style={styles.titleSettings(width)}>PID KP</Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={RFC.rfcPidKP?.toString() || ""}
              onChangeText={(text) =>
                HandleChange.handleChanges3Digits(text, "rfcPidKP", dispatchRFC)
              }
              keyboardType="numeric"
            />
          </View>
          <View style={styles.pidInputs}>
            <Text style={styles.titleSettings(width)}>PID KI</Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={RFC.rfcPidKI?.toString() || ""}
              onChangeText={(text) =>
                HandleChange.handleChanges3Digits(text, "rfcPidKI", dispatchRFC)
              }
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={styles.pidInputsContainer}>
          <View style={styles.pidInputs}>
            <Text style={styles.titleSettings(width)}>PID KD</Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={RFC.rfcPidKD?.toString() || ""}
              onChangeText={(text) =>
                HandleChange.handleChanges3Digits(text, "rfcPidKD", dispatchRFC)
              }
              keyboardType="numeric"
            />
          </View>
          <View style={styles.pidInputs}>
            <Text style={styles.titleSettings(width)}>PID INIT</Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={RFC.rfcPidINIT?.toString() || ""}
              onChangeText={(text) =>
                HandleChange.handleChanges3Digits(
                  text,
                  "rfcPidINIT",
                  dispatchRFC
                )
              }
              keyboardType="numeric"
            />
          </View>
        </View>
        <Text style={styles.titleSettings(width)}>PID Deadband</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={RFC.rfcPidDB?.toString() || ""}
          onChangeText={(text) =>
            HandleChange.handleChanges4Digits(text, "rfcPidDB", dispatchRFC)
          }
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>PID Low Limit</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={RFC.rfcPidLL?.toString() || ""}
          onChangeText={(text) =>
            HandleChange.handleChanges4Digits(text, "rfcPidLL", dispatchRFC)
          }
          keyboardType="numeric"
        />
      </View>
      <View style={styles.containerBtnText}>
        <ButtonUI
          onPress={() => handleSendRFCPID()}
          title={"Send"}
          btnStyle={styles.btnSendText(width)}
          txtStyle={styles.TextSendStyle(width)}
        />
      </View>
    </View>
  );
};
export default RFCPID;
