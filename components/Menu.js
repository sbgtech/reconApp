import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  useWindowDimensions,
  Text,
  Alert,
} from "react-native";
import MenuItem from "./MenuItem";
import { styles } from "./tabs/style/styles";
import { BleManager } from "react-native-ble-plx";
import { Receive } from "./Utils/Receive";
import { UART_SERVICE_UUID } from "./Utils/Constants";
import Toast from "react-native-toast-message";
import ButtonUI from "./ButtonUI";
import Loading from "./tabs/blocs/Loading";

const bleManager = new BleManager();

const Menu = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const [wellName, setWellName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [connectedDevice, setConnectedDevice] = useState(null);
  const currentVersion = "Prod 8-13MAY2025@12:00.AM";

  const menu = [
    {
      iconName: "pulse",
      tabName: "Well Status",
    },
    {
      iconName: "stopwatch-outline",
      tabName: "Timers",
    },
    {
      iconName: "cog",
      tabName: "Settings",
    },
    {
      iconName: "podium-outline",
      tabName: "Statistics",
    },
    {
      iconName: "radio-button-on",
      tabName: "Triggers",
    },
    {
      iconName: "hammer-outline",
      tabName: "Test",
    },
  ];

  const handleTabPress = (index) => {
    if (!connectedDevice) {
      Toast.show({
        type: "error",
        text1: "Device not connected",
        text2: "Please connect to a device first.",
        visibilityTime: 3000,
      });
      return; // Return early if there's no connected device
    }
    switch (index) {
      case 0:
        navigation.navigate("WellStatus", { connectedDevice: connectedDevice });
        break;
      case 1:
        navigation.navigate("Timers", { connectedDevice: connectedDevice });
        break;
      case 2:
        navigation.navigate("Settings", { connectedDevice: connectedDevice });
        break;
      case 3:
        navigation.navigate("Statistics", { connectedDevice: connectedDevice });
        break;
      case 4:
        navigation.navigate("Triggers", { connectedDevice: connectedDevice });
        break;
      case 5:
        navigation.navigate("Test", { connectedDevice: connectedDevice });
        break;
      default:
        break;
    }
  };

  const fetchWellName = async () => {
    try {
      const dataPromise = await Receive.ReceiveWellName(
        connectedDevice,
        setWellName,
        setLoading,
        setTitle
      );
      await dataPromise;
      // Receive and parse data again
    } catch (error) {
      console.error("Error during fetching data:", error);
    }
  };

  useEffect(() => {
    // verify the device is connected or not
    const checkDeviceConnection = async () => {
      const connectedDevices = await bleManager.connectedDevices([
        UART_SERVICE_UUID,
      ]);
      if (connectedDevices.length > 0) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Connected to " + connectedDevices[0].name,
          visibilityTime: 3000,
        });
        setConnectedDevice(connectedDevices[0]);
        setTimeout(async () => {
          await Receive.sendIden(connectedDevices[0], connectedDevices[0].id);
        }, 500);
        await Receive.ReceiveWellName(
          connectedDevices[0],
          setWellName,
          setLoading,
          setTitle
        );
      } else {
        Alert.alert(
          "Device Not Allowed",
          "Device Type Must be RECON Mobile",
          [
            {
              text: "Cancel",
              onPress: () => {
                navigation.removeListener(),
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Home", params: { scanning: false } }],
                  });
              },
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => {
                navigation.removeListener(),
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Home", params: { scanning: false } }],
                  });
              },
            },
          ],
          { cancelable: false }
        );
      }
    };
    checkDeviceConnection();
  }, []);

  useEffect(() => {
    // Function to handle disconnection
    const handleDisconnection = (error) => {
      if (error) {
        console.error("Disconnection error:", error);
      }
      Toast.show({
        type: "error",
        text1: "Device Disconnected",
        text2: "The BLE device has been disconnected.",
        visibilityTime: 3000,
      });
      setConnectedDevice(null); // Optionally reset device state
      navigation.removeListener();
      navigation.reset({
        index: 0,
        routes: [{ name: "Home", params: { scanning: false } }],
      });
    };

    // If device is connected, listen for disconnection events
    if (connectedDevice) {
      const subscription = connectedDevice.onDisconnected(handleDisconnection);

      // Cleanup subscription on component unmount or when device changes
      return () => subscription.remove();
    }
  }, [connectedDevice]);

  // function to disconnect the current connected device from BLE
  const disconnectFromDevice = async () => {
    try {
      if (connectedDevice) {
        await connectedDevice.cancelConnection();
        console.log("Disconnected successfully");
        setConnectedDevice(null);
        navigation.removeListener();
        navigation.reset({
          index: 0,
          routes: [{ name: "Home", params: { scanning: false } }],
        });
      } else {
        console.log("No device connected");
      }
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
  };

  // when clicking on disconnect button, run this function
  const handleDisconnect = () => {
    Alert.alert(
      "Disconnect",
      "Are you sure you want to disconnect from the device?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "Disconnect", onPress: () => disconnectFromDevice() }, // call disconnectFromDevice function
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.deviceBloc}>
        <View style={styles.nameVersionBloc(width)}>
          <View>
            {wellName ? (
              <Text style={styles.wellName(width)}>{wellName}</Text>
            ) : (
              <Text style={styles.wellName(width)}>RECON device</Text>
            )}
          </View>
          <View>
            <Text style={styles.version(width)}>{currentVersion}</Text>
          </View>
        </View>

        {connectedDevice ? (
          <View key={connectedDevice.id}>
            <Text style={styles.deviceInfo(width)}>
              Device : {connectedDevice.name}
            </Text>
            <Text style={styles.deviceInfo(width)}>
              ID : {connectedDevice.id}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 6,
                gap: 12,
              }}
            >
              <View style={{ flex: 1 }}>
                <ButtonUI
                  onPress={() => fetchWellName()}
                  title={"Refresh"}
                  btnStyle={styles.deviceBtns}
                  txtStyle={styles.TextSendStyle(width)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <ButtonUI
                  onPress={() => handleDisconnect()}
                  title={"Disconnect"}
                  btnStyle={styles.deviceBtns}
                  txtStyle={styles.TextSendStyle(width)}
                />
              </View>
            </View>
          </View>
        ) : (
          <Text style={styles.deviceInfo(width)}>No connected devices</Text>
        )}
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {menu.map((m, index) => (
          <MenuItem
            key={index}
            iconName={m.iconName}
            tabName={m.tabName}
            onPress={() => handleTabPress(index)}
          />
        ))}
      </ScrollView>
      <Loading loading={loading} title={title} />
    </View>
  );
};

export default Menu;
