import { View, Text, useWindowDimensions } from "react-native";
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

const ValveSelection = ({
  connectedDevice,
  settings,
  dispatchSettings,
  fetchDataSettings,
  setLoading,
}) => {
  const { width } = useWindowDimensions();

  const valve_selection = ["A-Valve", "B-Valve", "PID COUT 1", "PID COUT 2"];

  const handleSendValveSelection = async () => {
    try {
      const { LSB: LSB_primaryValveSelection, MSB: MSB_primaryValveSelection } =
        Receive.unpackFloatToRegister(settings.primaryValveSelection);
      const { LSB: LSB_hiloValveSelection, MSB: MSB_hiloValveSelection } =
        Receive.unpackFloatToRegister(settings.hiloValveSelection);
      const arr = JSON.stringify([
        3,
        282,
        LSB_primaryValveSelection,
        283,
        MSB_primaryValveSelection,
        284,
        LSB_hiloValveSelection,
        285,
        MSB_hiloValveSelection,
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
      await fetchDataSettings();
    } catch (error) {
      console.log(
        "Error with writeCharacteristicWithResponseForService :",
        error
      );
    }
  };

  return (
    <View style={styles.settingsSection(width)} key="card3">
      <View style={styles.inputContainer}>
        <Text style={styles.titleSettings(width)}>Primary Valve Selection</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={valve_selection}
          selectedIndex={settings.primaryValveSelection}
          setSelectedIndex={(index) =>
            dispatchSettings({ primaryValveSelection: index })
          }
        />
        <Text style={styles.titleSettings(width)}>HiLo Valve Selection</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={valve_selection}
          selectedIndex={settings.hiloValveSelection}
          setSelectedIndex={(index) =>
            dispatchSettings({ hiloValveSelection: index })
          }
        />
      </View>
      <View style={styles.containerBtnText}>
        <ButtonUI
          onPress={() => handleSendValveSelection()}
          title={"Send"}
          btnStyle={styles.btnSendText(width)}
          txtStyle={styles.TextSendStyle(width)}
        />
      </View>
    </View>
  );
};
export default ValveSelection;
