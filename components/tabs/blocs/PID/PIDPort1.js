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

const PIDPortOne = ({
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

  // handle change values
  const handleChangePercent = (text, fieldName) => {
    if (text) {
      const validText = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      // Ensure the length is 3
      if (validText.length > 3) {
        Toast.show({
          type: "error",
          text1: "Warning",
          text2: "The max value must be 3 digits",
          visibilityTime: 3000,
        });
        dispatchPID({ [fieldName]: "" });
      } else {
        dispatchPID({ [fieldName]: validText });
      }
    } else {
      dispatchPID({ [fieldName]: "" });
    }
  };

  const handleSendPIDSettings = async () => {
    if (
      PID.pidOneSP === "" ||
      PID.pidOneKP === "" ||
      PID.pidOneKI === "" ||
      PID.pidOneKD === "" ||
      PID.pidOneINIT === "" ||
      PID.pidOneDB === "" ||
      PID.pidOneLL === "" ||
      PID.pidOneLoopDelay === ""
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
        164,
        PID.pidOneEnableIndex,
        165,
        PID.pidOneModeIndex,
        166,
        Number(PID.pidOneSP),
        167,
        Number(PID.pidOneKP),
        168,
        Number(PID.pidOneKI),
        169,
        Number(PID.pidOneKD),
        170,
        Number(PID.pidOneINIT),
        171,
        Number(PID.pidOneDB),
        172,
        Number(PID.pidOneLL),
        173,
        PID.pidOnePVSource,
        176,
        Number(PID.pidOneLoopDelay),
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
    <View style={styles.settingsSection(width)} key="card1">
      <View style={styles.inputContainer}>
        <Text style={styles.valveTitle(width)}>PID COUT1 Settings</Text>
        <Text style={styles.titleSettings(width)}>PID Enable</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={PID_enable}
          selectedIndex={PID.pidOneEnableIndex}
          setSelectedIndex={(index) =>
            dispatchPID({ pidOneEnableIndex: index })
          }
        />
        <Text style={styles.titleSettings(width)}>PID Mode</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={PID_mode}
          selectedIndex={PID.pidOneModeIndex}
          setSelectedIndex={(index) => dispatchPID({ pidOneModeIndex: index })}
        />
        <Text style={styles.titleSettings(width)}>PID Set Point (SP)</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={PID.pidOneSP?.toString() || ""}
          onChangeText={(text) =>
            HandleChange.handleChanges4Digits(text, "pidOneSP", dispatchPID)
          }
          keyboardType="numeric"
        />
        <View style={styles.pidInputsContainer}>
          <View style={styles.pidInputs}>
            <Text style={styles.titleSettings(width)}>PID KP (%)</Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={PID.pidOneKP?.toString() || ""}
              onChangeText={(text) =>
                HandleChange.handleChanges3Digits(text, "pidOneKP", dispatchPID)
              }
              keyboardType="numeric"
            />
          </View>
          <View style={styles.pidInputs}>
            <Text style={styles.titleSettings(width)}>PID KI (%)</Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={PID.pidOneKI?.toString() || ""}
              onChangeText={(text) =>
                HandleChange.handleChanges3Digits(text, "pidOneKI", dispatchPID)
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
              value={PID.pidOneKD?.toString() || ""}
              onChangeText={(text) =>
                HandleChange.handleChanges3Digits(text, "pidOneKD", dispatchPID)
              }
              keyboardType="numeric"
            />
          </View>
          <View style={styles.pidInputs}>
            <Text style={styles.titleSettings(width)}>PID INIT (%)</Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={PID.pidOneINIT?.toString() || ""}
              onChangeText={(text) =>
                HandleChange.handleChanges3Digits(
                  text,
                  "pidOneINIT",
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
          value={PID.pidOneDB?.toString() || ""}
          onChangeText={(text) =>
            HandleChange.handleChanges4Digits(text, "pidOneDB", dispatchPID)
          }
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>PID Low Limit</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={PID.pidOneLL?.toString() || ""}
          onChangeText={(text) =>
            HandleChange.handleChanges4Digits(text, "pidOneLL", dispatchPID)
          }
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>PID PV Source</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={PID_PVSource}
          selectedIndex={PID.pidOnePVSource}
          setSelectedIndex={(index) => dispatchPID({ pidOnePVSource: index })}
        />
        <Text style={styles.titleSettings(width)}>PID Loop Delay</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={PID.pidOneLoopDelay?.toString() || ""}
          onChangeText={(text) =>
            HandleChange.handleChanges4Digits(
              text,
              "pidOneLoopDelay",
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
export default PIDPortOne;
