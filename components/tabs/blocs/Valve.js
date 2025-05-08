import React, { useEffect, useState } from "react";
import { Text, View, useWindowDimensions } from "react-native";
import { Switch } from "react-native-switch";
import { styles } from "../style/styles";
import { Buffer } from "buffer";
import {
  UART_SERVICE_UUID,
  UART_TX_CHARACTERISTIC_UUID,
} from "../../Utils/Constants";
import Toast from "react-native-toast-message";

const Valve = ({
  connectedDevice,
  title,
  status,
  fetchDataSettings,
  valve,
}) => {
  const { width } = useWindowDimensions();
  const [isEnabledValve, setIsEnabledValve] = useState(status);

  // sent data of valve A
  const handleSendValveValue = async (value) => {
    try {
      let arr;
      if (valve === "A") {
        arr = JSON.stringify([3, 1, Number(value)]);
      }
      if (valve === "B") {
        arr = JSON.stringify([3, 2, Number(value)]);
      }
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
      setIsEnabledValve(value);
      await fetchDataSettings();
    } catch (error) {
      console.log(
        "Error with writeCharacteristicWithResponseForService :",
        error
      );
    }
  };

  // Update state when status changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsEnabledValve(status);
    }, 0);
    return () => clearTimeout(timeout);
  }, [status]);

  // Handle switch change
  const handleSwitchChange = (value) => {
    if (value !== isEnabledValve) {
      handleSendValveValue(value);
    }
  };

  const thumbWidthHeight = width < 600 ? 30 : width < 800 ? 38 : width < 950 ? 38 : 47;
  const switchWidth =
    width < 600 ? 80 : width < 800 ? 80 : width < 950 ? 100 : 120;
  const switchHeight =
    width < 600 ? 40 : width < 800 ? 32 : width < 950 ? 45 : 58;
  const fontSize = width < 600 ? 10 : width < 800 ? 10 : width < 950 ? 14 : 18;

  return (
    <View style={styles.valveWrapper}>
      <View style={styles.onOffStatus(width)}>
        <Text style={styles.valveTitle}>{title}</Text>
        <Switch
          value={isEnabledValve}
          onValueChange={handleSwitchChange}
          disabled={false}
          circleSize={thumbWidthHeight}
          barHeight={switchHeight}
          circleBorderWidth={1}
          backgroundActive={"#45D058"}
          backgroundInactive={"#ddd"}
          circleActiveColor={"#349E43"}
          circleInActiveColor={"#a3a3a3"}
          renderActiveText={false}
          renderInActiveText={false}
          renderInsideCircle={() => (
            <Text style={{ color: '#fff', fontSize }}>
              {isEnabledValve ? 'ON' : 'OFF'}
            </Text>
          )}
          switchLeftPx={1.5}
          switchRightPx={1.5}
          switchWidthMultiplier={switchWidth / thumbWidthHeight}
          switchBorderRadius={50}
        />
      </View>
    </View>
  );
};

export default Valve;
