import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { View, Text, Alert, useWindowDimensions } from "react-native";
import ButtonUI from "../ButtonUI";
import Tab from "./Tab";
import WellStatus from "./WellStatusTab";
import TimerTab from "./TimerTab";
import SettingsTab from "./SettingsTab";
import SettingsTab2 from "./SettingsTab2";
import StatisticsTab from "./StatisticsTab";
import TestTab from "./TestTab";
import { BleManager } from "react-native-ble-plx";
import { UART_SERVICE_UUID } from "../Utils/Constants";
import { styles } from "./style/styles";
import { Receive } from "../Utils/Receive";
import Toast from "react-native-toast-message";

const bleManager = new BleManager();

const TabView = ({ navigation, initialTab }) => {
  const { width } = useWindowDimensions();
  // set the connected welltimer to this variable
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [wellName, setWellName] = useState(null);
  const isFocused = useIsFocused();
  const currentVersion = "Prod 7-29APR2025@12:00.AM";
  // the existed pages for config welltimer after connected to it
  const tabs = [
    {
      label: "Well status",
      content: <WellStatus connectedDevice={connectedDevice} />,
    },
    {
      label: "Timers",
      content: <TimerTab connectedDevice={connectedDevice} />,
    },
    {
      label: "Settings",
      content: <SettingsTab2 connectedDevice={connectedDevice} />,
    },
    {
      label: "Statistics",
      content: <StatisticsTab connectedDevice={connectedDevice} />,
    },
    {
      label: "Test",
      content: (
        <TestTab
          connectedDevice={connectedDevice}
          navigation={navigation}
          setActiveTab={setActiveTab}
        />
      ),
    },
  ];
  // variable used for known the current page, default is the first page (index 0)
  const [activeTab, setActiveTab] = useState(initialTab);

  // function to set active page to the variable when pressing on the page
  const handleTabPress = (index) => {
    setActiveTab(index);
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
        // await Receive.sendReqToGetData(connectedDevice, activeTab);
        setTimeout(async () => {
          await Receive.sendIden(connectedDevices[0], connectedDevices[0].id);
        }, 500);
        await Receive.ReceiveWellName(connectedDevices[0], setWellName);
      } else {
        Alert.alert(
          "Device Not Allowed",
          "Device Type Must be RECON Mobile",
          [
            {
              text: "Cancel",
              onPress: () => {
                navigation.removeListener(),
                  navigation.navigate("Home", {
                    scanning: false,
                  });
              },
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => {
                navigation.removeListener(),
                  navigation.navigate("Home", {
                    scanning: false,
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
      navigation.navigate("Home", { scanning: false });
    };

    // If device is connected, listen for disconnection events
    if (connectedDevice) {
      const subscription = connectedDevice.onDisconnected(handleDisconnection);

      // Cleanup subscription on component unmount or when device changes
      return () => subscription.remove();
    }
  }, [connectedDevice]);

  useEffect(() => {
    // if device is connected ,call send requests function to send request to device with the current page input to get data and display them
    if (connectedDevice) {
      Receive.sendReqToGetData(connectedDevice, activeTab);
    }
  }, [activeTab, connectedDevice]); // Send request whenever activeTab changes (call useEffect whenever activeTab changes)

  useEffect(() => {
    if (!isFocused) {
      // Code to run when the screen is focused
      disconnectFromDevice();
    }
  }, [isFocused]);

  // function to disconnect the current connected device from BLE
  const disconnectFromDevice = async () => {
    try {
      if (connectedDevice) {
        await connectedDevice.cancelConnection();
        console.log("Disconnected successfully");
        setConnectedDevice(null);
        navigation.removeListener();
        navigation.navigate("Home", { scanning: false });
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
    <View style={styles.container}>
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
            <ButtonUI
              onPress={() => handleDisconnect()}
              title={"Disconnect"}
              btnStyle={styles.deviceBtns}
              txtStyle={styles.TextSendStyle(width)}
            />
          </View>
        ) : (
          <Text style={styles.deviceInfo(width)}>No connected devices</Text>
        )}
      </View>
      <View style={styles.tabsContainer}>
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            isActive={index === activeTab}
            onPress={() => handleTabPress(index)}
          />
        ))}
      </View>
      <View style={styles.contentContainer}>
        {tabs[activeTab].label === "Test" && (
          <TestTab
            connectedDevice={connectedDevice}
            navigation={navigation}
            setActiveTab={setActiveTab}
          />
        )}
        {tabs[activeTab].label !== "Test" && tabs[activeTab].content}
      </View>
    </View>
  );
};

export default TabView;
