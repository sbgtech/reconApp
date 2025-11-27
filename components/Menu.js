import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  ScrollView,
  View,
  useWindowDimensions,
  Text,
  Alert,
  StyleSheet,
  Modal,
  TextInput,
  BackHandler, // Import BackHandler for Android hardware back button
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native"; // Import useNavigation
import MenuItem from "./MenuItem";
import { styles } from "./tabs/style/styles";
import { BleManager } from "react-native-ble-plx";
import { Receive } from "./Utils/Receive";
import { UART_SERVICE_UUID } from "./Utils/Constants";
import Toast from "react-native-toast-message";
import ButtonUI from "./ButtonUI";
import Loading from "./tabs/blocs/Loading";
import {
  getCustomDeviceName,
  setCustomDeviceName,
} from "./Utils/deviceNameStorage";
import AntDesign from "react-native-vector-icons/AntDesign";

const bleManager = new BleManager();

const Menu = () => {
  const navigation = useNavigation(); // Use useNavigation hook
  const { width } = useWindowDimensions();
  const [wellName, setWellName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [customDeviceName, setCustomDeviceNameState] = useState("");
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [customName, setCustomName] = useState("");
  const currentVersion = "PROD 11-28AUG2025@10:00.AM";
  const disconnectMonitorSubscription = useRef(null);

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
      tabName: "Trigger",
    },
    {
      iconName: "options-outline",
      tabName: "PID",
    },
    {
      iconName: "notifications-outline",
      tabName: "Alarm",
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
        navigation.navigate("Trigger", { connectedDevice: connectedDevice });
        break;
      case 5:
        navigation.navigate("PID", { connectedDevice: connectedDevice });
        break;
      case 6:
        navigation.navigate("Alarm", { connectedDevice: connectedDevice });
        break;
      case 7:
        navigation.navigate("Test", { connectedDevice: connectedDevice });
        break;
      default:
        break;
    }
  };

  const manualDisconnect = () => {
    if (connectedDevice) {
      Alert.alert(
        "Disconnect Device?",
        "Are you sure you want to disconnect from the device and exit?",
        [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          { text: "YES", onPress: handleDisconnect },
        ]
      );
      return true; // Prevent default back action
    }
    return false; // Allow default back action if no device is connected
  };

  // Function to handle device disconnection
  const handleDisconnect = useCallback(async () => {
    if (connectedDevice) {
      // setLoading(true);
      // setTitle("Disconnecting...");
      try {
        await connectedDevice.cancelConnection();
        setConnectedDevice(null);
        setCustomDeviceNameState("");
        setWellName(null);
        // Toast.show({
        //   type: "indo",
        //   text1: "Disconnected",
        //   text2: "Successfully disconnected from device.",
        //   visibilityTime: 3000,
        // });
        // Navigate back to the Home screen after successful disconnection
        navigation.reset({
          index: 0,
          routes: [{ name: "Home", params: { scanning: false } }],
        });
      } catch (error) {
        console.error("Failed to disconnect:", error);
        Toast.show({
          type: "error",
          text1: "Disconnection Failed",
          text2: "Could not disconnect from device.",
          visibilityTime: 3000,
        });
      } finally {
        setLoading(false);
      }
    } else {
      Toast.show({
        type: "info",
        text1: "No Device Connected",
        text2: "There is no device to disconnect from.",
        visibilityTime: 3000,
      });
    }
  }, [connectedDevice, navigation]);

  useEffect(() => {
    const checkDeviceConnection = async () => {
      const devices = await bleManager.connectedDevices([UART_SERVICE_UUID]);
      if (devices.length > 0) {
        const device = devices[0];
        const customName = await getCustomDeviceName(device.id);
        setConnectedDevice(device);
        setCustomDeviceNameState(customName || device.name);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: `Connected to ${customName || device.name}`,
          visibilityTime: 3000,
        });
        setTimeout(async () => {
          await Receive.sendIden(device, device.id);
        }, 500);
        await Receive.ReceiveWellName(
          device,
          setWellName,
          setLoading,
          setTitle
        );

        // Monitor for device disconnection
        disconnectMonitorSubscription.current = device.onDisconnected(
          (error, disconnectedDevice) => {
            if (error) {
              console.error("Device disconnection error:", error);
              Toast.show({
                type: "error",
                text1: "Connection Error",
                text2: "Device unexpectedly disconnected.",
                visibilityTime: 3000,
              });
            } else {
              console.log(`Device ${disconnectedDevice.id} disconnected.`);
              Toast.show({
                type: "info",
                text1: "Device Disconnected",
                text2: `Successfully disconnected from ${
                  customName || disconnectedDevice.name
                }`,
                visibilityTime: 3000,
              });
              setConnectedDevice(null);
              setCustomDeviceNameState("");
              setWellName(null);
              // Navigate back to the Home screen
              navigation.reset({
                index: 0,
                routes: [{ name: "Home", params: { scanning: false } }],
              });
            }
          }
        );
      } else {
        // Alert.alert(
        //   "Device Not Connected",
        //   "No device is currently connected. Please connect to a device.",
        //   [
        //     {
        //       text: "OK",
        //       onPress: () => {
        //         navigation.reset({
        //           index: 0,
        //           routes: [{ name: "Home", params: { scanning: false } }],
        //         });
        //       },
        //     },
        //   ],
        //   { cancelable: false }
        // );
      }
    };
    checkDeviceConnection();

    // Clean up on component unmount
    return () => {
      if (disconnectMonitorSubscription.current) {
        disconnectMonitorSubscription.current.remove();
      }
    };
  }, [navigation]); // Depend on navigation to ensure reset works correctly

  // Handle Android hardware back button
  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        if (connectedDevice) {
          Alert.alert(
            "Disconnect Device?",
            "Are you sure you want to disconnect from the device and exit?",
            [
              {
                text: "Cancel",
                onPress: () => null,
                style: "cancel",
              },
              { text: "YES", onPress: handleDisconnect },
            ]
          );
          return true;
        }
        return false;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => {
        backHandler.remove();
      };
    }, [connectedDevice, handleDisconnect])
  );

  // Add a header button for disconnection
  useEffect(() => {
    const backArrowAction = () => {
      if (connectedDevice) {
        Alert.alert(
          "Disconnect Device?",
          "Are you sure you want to disconnect from the device and exit?",
          [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel",
            },
            { text: "YES", onPress: handleDisconnect },
          ]
        );
        return true; // Prevent default back action
      }
      return false; // Allow default back action if no device is connected
    };
    navigation.setOptions({
      headerLeft: () =>
        connectedDevice && (
          <AntDesign
            name={"arrowleft"}
            size={26}
            color="#fff"
            style={{ marginLeft: 20, marginRight: 14 }}
            onPress={backArrowAction}
          />
        ),
    });
  }, [navigation, connectedDevice, handleDisconnect]);

  const saveCustomDeviceName = async () => {
    if (connectedDevice && customName.trim() !== "") {
      try {
        await setCustomDeviceName(connectedDevice.id, customName.trim());
        setCustomDeviceNameState(customName.trim());
        setRenameModalVisible(false);
        Toast.show({
          type: "success",
          text1: "Device Renamed",
          text2: `Device name updated to ${customName.trim()}`,
          visibilityTime: 3000,
        });
        setCustomName(""); // Clear the input
      } catch (e) {
        console.error("Failed to save custom device name", e);
        Toast.show({
          type: "error",
          text1: "Rename Failed",
          text2: "Could not rename device.",
          visibilityTime: 3000,
        });
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Invalid Name",
        text2: "Please enter a valid name.",
        visibilityTime: 3000,
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.deviceBloc}>
        <View style={styles.nameVersionBloc(width)}>
          <Text style={styles.wellName(width)}>
            {wellName || "RECON device"}
          </Text>
          <Text style={styles.version(width)}>{currentVersion}</Text>
        </View>

        {connectedDevice ? (
          <View key={connectedDevice.id}>
            <Text style={styles.deviceInfo(width)}>
              Device : {customDeviceName}
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
                  onPress={() => setRenameModalVisible(true)}
                  title={"Rename Device"}
                  btnStyle={styles.deviceBtns}
                  txtStyle={styles.TextSendStyle(width)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <ButtonUI
                  onPress={manualDisconnect}
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
      <Modal
        visible={renameModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.renameModalContainer}>
          <View style={styles.renameModalContent(width)}>
            <View style={styles.renameModalCurrentNameContainer}>
              <Text style={styles.renameModalLabel(width)}>Current Name :</Text>
              <Text
                style={[styles.renameModalLabel(width), { color: "#0055a4" }]}
              >
                {customDeviceName}
              </Text>
            </View>
            <TextInput
              placeholder="Enter custom name"
              value={customName}
              onChangeText={setCustomName}
              style={styles.renameModalInput(width)}
            />
            <View style={styles.renameModalButtonsContainer}>
              <ButtonUI
                title="Cancel"
                onPress={() => setRenameModalVisible(false)}
                btnStyle={[
                  styles.renameButton(width),
                  { backgroundColor: "#9a9a9a" },
                ]}
              />
              <ButtonUI
                title="Save"
                onPress={saveCustomDeviceName}
                btnStyle={styles.renameButton(width)}
              />
            </View>
          </View>
        </View>
      </Modal>
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
