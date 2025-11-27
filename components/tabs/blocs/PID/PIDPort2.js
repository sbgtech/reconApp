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

const PIDPortTwo = ({
  connectedDevice,
  PID,
  dispatchPID,
  fetchDataPID,
  setLoading,
}) => {
  const { width } = useWindowDimensions();

  const PID_enable = ["Disable", "Enable"];
  const PID_mode = ["Primary", "Override"];
  const PID_PVSource = ["LP", "TP", "CP", "Sales Flow", "Injection Flow"];

  const handleSendPIDSettings = async () => {
    if (
      PID.pidTwoSP === "" ||
      PID.pidTwoKP === "" ||
      PID.pidTwoKI === "" ||
      PID.pidTwoKD === "" ||
      PID.pidTwoINIT === "" ||
      PID.pidTwoDB === "" ||
      PID.pidTwoLL === "" ||
      PID.pidTwoLoopDelay === ""
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
        7,
        178,
        PID.pidTwoEnableIndex,
        179,
        PID.pidTwoModeIndex,
        180,
        Number(PID.pidTwoSP),
        181,
        Number(PID.pidTwoKP),
        182,
        Number(PID.pidTwoKI),
        183,
        Number(PID.pidTwoKD),
        184,
        Number(PID.pidTwoINIT),
        185,
        Number(PID.pidTwoDB),
        186,
        Number(PID.pidTwoLL),
        187,
        PID.pidTwoPVSource,
        190,
        Number(PID.pidTwoLoopDelay),
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
      await fetchDataPID();
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
        <Text style={styles.valveTitle(width)}>PID COUT2 Settings</Text>
        <Text style={styles.titleSettings(width)}>PID Enable</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={PID_enable}
          selectedIndex={PID.pidTwoEnableIndex}
          setSelectedIndex={(index) =>
            dispatchPID({ pidTwoEnableIndex: index })
          }
        />
        <Text style={styles.titleSettings(width)}>PID Mode</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={PID_mode}
          selectedIndex={PID.pidTwoModeIndex}
          setSelectedIndex={(index) => dispatchPID({ pidTwoModeIndex: index })}
        />
        <Text style={styles.titleSettings(width)}>PID Set Point (SP)</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={PID.pidTwoSP?.toString() || ""}
          onChangeText={(text) =>
            HandleChange.handleChanges4Digits(text, "pidTwoSP", dispatchPID)
          }
          keyboardType="numeric"
        />
        <View style={styles.pidInputsContainer}>
          <View style={styles.pidInputs}>
            <Text style={styles.titleSettings(width)}>PID KP (%)</Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={PID.pidTwoKP?.toString() || ""}
              onChangeText={(text) =>
                HandleChange.handleChanges3Digits(text, "pidTwoKP", dispatchPID)
              }
              keyboardType="numeric"
            />
          </View>
          <View style={styles.pidInputs}>
            <Text style={styles.titleSettings(width)}>PID KI (%)</Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={PID.pidTwoKI?.toString() || ""}
              onChangeText={(text) =>
                HandleChange.handleChanges3Digits(text, "pidTwoKI", dispatchPID)
              }
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={styles.pidInputsContainer}>
          <View style={styles.pidInputs}>
            <Text style={styles.titleSettings(width)}>PID KD (%)</Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={PID.pidTwoKD?.toString() || ""}
              onChangeText={(text) =>
                HandleChange.handleChanges3Digits(text, "pidTwoKD", dispatchPID)
              }
              keyboardType="numeric"
            />
          </View>
          <View style={styles.pidInputs}>
            <Text style={styles.titleSettings(width)}>PID INIT (%)</Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={PID.pidTwoINIT?.toString() || ""}
              onChangeText={(text) =>
                HandleChange.handleChanges3Digits(
                  text,
                  "pidTwoINIT",
                  dispatchPID
                )
              }
              keyboardType="numeric"
            />
          </View>
        </View>
        <Text style={styles.titleSettings(width)}>PID Deadband</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={PID.pidTwoDB?.toString() || ""}
          onChangeText={(text) =>
            HandleChange.handleChanges4Digits(text, "pidTwoDB", dispatchPID)
          }
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>PID Low Limit</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={PID.pidTwoLL?.toString() || ""}
          onChangeText={(text) =>
            HandleChange.handleChanges4Digits(text, "pidTwoLL", dispatchPID)
          }
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>PID PV Source</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={PID_PVSource}
          selectedIndex={PID.pidTwoPVSource}
          setSelectedIndex={(index) => dispatchPID({ pidTwoPVSource: index })}
        />
        <Text style={styles.titleSettings(width)}>PID Loop Delay</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={PID.pidTwoLoopDelay?.toString() || ""}
          onChangeText={(text) =>
            HandleChange.handleChanges4Digits(
              text,
              "pidTwoLoopDelay",
              dispatchPID
            )
          }
          keyboardType="numeric"
        />
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
export default PIDPortTwo;
