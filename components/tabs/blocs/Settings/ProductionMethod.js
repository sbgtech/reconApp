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

const ProductionMethod = ({
  connectedDevice,
  settings,
  dispatchSettings,
  fetchDataSettings,
  setLoading,
}) => {
  const { width } = useWindowDimensions();

  const productionMethod = [
    "Timer Mode",
    "Timer Intermit Mode",
    "Pressure Intermit Mode",
    "Trigger Mode",
  ];

  const falseArrivals = ["Disable", "Enable"];

  // send array of prod method, missrun max, false arrivals and well depth values to device with their addresses
  const handleSendFirstBloc = async () => {
    if (settings.missrunMax === "" || settings.wellDepth === "") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "All fields (Missrun max and Well depth) must be filled",
        visibilityTime: 3000,
      });
      return; // Exit the function if validation fails
    }
    try {
      const arr = JSON.stringify([
        3,
        111,
        settings.productionMethodIndex,
        109,
        Number(settings.missrunMax),
        110,
        settings.falseArrivalsIndex,
        125,
        Number(settings.wellDepth),
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
  };

  return (
    <View style={styles.settingsSection(width)} key={"card1"}>
      <View style={styles.inputContainer}>
        <Text style={styles.titleSettings(width)}>Production method :</Text>
        <Dropdown
          dropdownTitle={"Select mode"}
          list={productionMethod}
          selectedIndex={settings.productionMethodIndex}
          setSelectedIndex={(index) =>
            dispatchSettings({ productionMethodIndex: index })
          }
        />
        <Text style={styles.titleSettings(width)}>Missrun max :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.missrunMax?.toString() || ""}
          onChangeText={(text) =>
            HandleChange.handleChanges4Digits(
              text,
              "missrunMax",
              dispatchSettings
            )
          }
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>Detect false arrivals :</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={falseArrivals}
          selectedIndex={settings.falseArrivalsIndex}
          setSelectedIndex={(index) =>
            dispatchSettings({ falseArrivalsIndex: index })
          }
        />
        <Text style={styles.titleSettings(width)}>Well depth :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.wellDepth?.toString() || ""}
          onChangeText={(text) =>
            HandleChange.handleChanges4Digits(
              text,
              "wellDepth",
              dispatchSettings
            )
          }
          keyboardType="numeric"
        />
      </View>
      <View style={styles.containerBtnText}>
        <ButtonUI
          onPress={() => handleSendFirstBloc()}
          title={"Send"}
          btnStyle={styles.btnSendText(width)}
          txtStyle={styles.TextSendStyle(width)}
        />
      </View>
    </View>
  );
};
export default ProductionMethod;
