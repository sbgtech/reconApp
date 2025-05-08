import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  Alert,
  useWindowDimensions,
  Keyboard,
} from "react-native";
import Item from "./Item";
import { BleManager } from "react-native-ble-plx";
import ButtonUI from "./ButtonUI";
import Toast from "react-native-toast-message";
import { styles } from "./tabs/style/styles";
import Login_modal from "./tabs/blocs/Login_modal";
import Wellname_modal from "./tabs/blocs/Wellname_modal";
import ReelNotification from "./ReelNotification";
import { useRef } from "react";

// create new instance for the BleManager module
const bleManager = new BleManager();

export default function Home({ navigation, route }) {
  const { width } = useWindowDimensions();
  // initialize the state of bluetooth in the mobile, default Unknown
  const [bluetoothState, setBluetoothState] = useState("Unknown");
  // create scanning state of the devices, default is not scanning yet
  const [scanning, setScanning] = useState(false);
  // an array of available devices
  const [devices, setDevices] = useState([]);
  // create new Set of the discovered devices to set thems into devices array
  const discoveredDevices = new Set();

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [wellNameModalVisible, setWellNameModalVisible] = useState(false);
  const [pin, setPin] = useState("");
  const [wellname, setWellname] = useState("");
  const [loginIsIndicatorShown, setLoginIsIndicatorShown] = useState(false);
  const [isWellNameIndicatorShown, setIsWellNameIndicatorShown] =
    useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null); // Store selected device
  const lastSixDigits = (foundWell) => {
    return foundWell.unitid.slice(-6);
  };
  const [showNotification, setShowNotification] = useState(false);
  const unit = "345678";
  const [unitid, setUnitid] = React.useState("");

  // Request Bluetooth permissions
  // Ask user when he open the app to allow and activate position and bluetooth
  const requestBluetoothPermission = async () => {
    if (Platform.OS === "ios") {
      return true;
    }
    if (
      Platform.OS === "android" &&
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    ) {
      const apiLevel = parseInt(Platform.Version.toString(), 10);
      if (apiLevel < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      if (
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN &&
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      ) {
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        return (
          result["android.permission.BLUETOOTH_CONNECT"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result["android.permission.BLUETOOTH_SCAN"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result["android.permission.ACCESS_FINE_LOCATION"] ===
            PermissionsAndroid.RESULTS.GRANTED
        );
      }
    }
    Alert.alert("Permission have not been granted");
    return false;
  };

  // Initial load
  useEffect(() => {
    // when load this component it check the bluetooth state
    const checkBluetoothState = async () => {
      const state = await bleManager.state();
      setBluetoothState(state);
    };
    checkBluetoothState();
    // Set up a listener for Bluetooth state changes
    const checkState = async () => {
      // read the state of bluetooth with ble plx module and set it into our state
      const subscription = await bleManager.onStateChange((state) => {
        setBluetoothState(state);
        if (state !== "PoweredOn") {
          // if bluetooth or posiition are deactivates, it show an alert to activate them
          Alert.alert(
            "Info",
            "Please make sure to activate Bluetooth and position for better usage."
          );
        }
      }, true);
      return () => subscription.remove(); // Clean up listener on unmount
    };
    checkState();
  }, []);

  useEffect(() => {
    // when page refreshed call requestBluetoothPermissions function
    requestBluetoothPermission();
    // call scanning function
    scanForDevices();
    // Cleanup function to stop scanning when component unmounts
    return () => {
      bleManager.stopDeviceScan();
    };
  }, [scanning]);

  useEffect(() => {
    // Check if parameters exist and update state accordingly
    if (route.params && route.params.scanning) {
      setScanning(false);
      scanForDevices();
    }
  }, [route.params]); // Depend on route.params

  // function to scan devices
  const scanForDevices = () => {
    if (scanning) {
      // if scanning state is true
      setDevices([]); // empty the array
      // call scan function of the ble plx module
      bleManager.startDeviceScan(
        null,
        { allowDuplicates: false },
        (error, scannedDevice) => {
          if (error) {
            // if error when scanning show error alert
            console.log("Error scanning for devices:", error);
            Toast.show({
              type: "error",
              text1: "Error",
              text2: error.message,
              visibilityTime: 3000,
            });
            return;
          }
          // If retrieve an device, add it to the scanned devices list
          if (scannedDevice && !discoveredDevices.has(scannedDevice.id)) {
            if (scannedDevice.name) {
              discoveredDevices.add(scannedDevice.id);
              setDevices((prevDevices) => [...prevDevices, scannedDevice]);
            }
          }
        }
      );
    }
  };

  // Function to handle the login process
  const handleSubmitPIN = async () => {
    if (pin.length === 6) {
      if (pin === unit) {
        setLoginIsIndicatorShown(true);
        setTimeout(() => {
          Toast.show({
            type: "success",
            text1: "Successfully OTP",
            text2: `Your OTP is ${pin}`,
            visibilityTime: 5000,
          });
          setLoginIsIndicatorShown(false);
          setLoginModalVisible(false);
          if (selectedDevice) {
            navigation.navigate("DeviceSettings", { initialTab: 0 });
          }
          setPin("");
        }, 2000);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Invalid PIN",
          visibilityTime: 3000,
        });
        setPin("");
      }
    }
  };

  const openWellnameModal = async () => {
    await disconnectDevice();
    setLoginModalVisible(false);
    setTimeout(() => {
      setWellNameModalVisible(true);
    }, 500);
  };

  // Function to handle the well name
  const handleSubmitWellName = async () => {
    try {
      setIsWellNameIndicatorShown(true);
      // Make an API request to check if the well name exists
      const response = await fetch(
        `https://mocki.io/v1/6c5b4f8d-e439-4c04-ae72-fd019dfc4dbb`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          // body: JSON.stringify({ wellname: wellname }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        const foundWell = await data.find((well) => well.name === wellname);
        if (foundWell) {
          const lastSix = await lastSixDigits(foundWell);
          setUnitid(lastSix);
          setTimeout(() => {
            setIsWellNameIndicatorShown(false);
            setWellNameModalVisible(false);
            setShowNotification(true);
          }, 2000);
          console.log(
            `device ID ${foundWell.unitid}, device name: ${foundWell.name}`
          );
          // await otpInputRef.current.setValue(`${lastSix}`);
          // setPin(lastSix);
          // Show success toast and handle the well ID
          // setTimeout(() => {
          //   Toast.show({
          //     type: "success",
          //     text1: "Well Name found",
          //     text2: `Waiting for sending ${wellname}'s PIN notification`,
          //     visibilityTime: 6000,
          //   });
          // }, 2000);
          // setTimeout(() => {
          //   Toast.show({
          //     type: "success",
          //     text1: "Well Name PIN",
          //     text2: `The WellName PIN is: ${lastSix}`,
          //     visibilityTime: 7000,
          //   });
          // }, 9000);
        } else {
          // If well name does not exist, show an error message
          setIsWellNameIndicatorShown(false);
          Keyboard.dismiss();
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Well name does not exist",
            visibilityTime: 3000,
          });
        }
      } else {
        // Handle server errors
        setIsWellNameIndicatorShown(false);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Server error, please try again later",
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      // Handle network errors
      setIsWellNameIndicatorShown(false);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Network error, please try again",
        visibilityTime: 3000,
      });
    }
  };

  const disconnectDevice = async () => {
    try {
      if (selectedDevice) {
        await selectedDevice.cancelConnection();
        console.log("Disconnected successfully");
        setSelectedDevice("");
        setLoginModalVisible(false);
      } else {
        console.log("No device connected");
        setLoginModalVisible(false);
      }
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
  };

  // function allow user to connect to device
  const connectToDevice = async (selectedDevice) => {
    if (!selectedDevice) return;
    try {
      setIsButtonDisabled(true); // Disable button before connecting
      // connect to selected device
      await selectedDevice
        .connect()
        .then((device) => device.discoverAllServicesAndCharacteristics()) // discovering services and characteristics of device
        .then((device) => {
          // success to connect to device
          console.log("Connected to", device.name);
          // setLoginModalVisible(true);
          // setSelectedDevice(selectedDevice);
          // console.log("selectedDevice", selectedDevice);
          navigation.navigate("DeviceSettings", { initialTab: 0 });
        });
    } catch (error) {
      // error connecting to device
      console.error("Error connecting to device:", error);
      // showing toast for error connected
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Error connecting to device",
        visibilityTime: 3000,
      });
    } finally {
      setIsButtonDisabled(false); // Re-enable button after operation
    }
  };

  // useEffect(() => {
  //   console.log("this is width", width);
  // }, [width]);

  const renderItem = ({ item }) => (
    <Item
      name={item.name}
      id={item.id}
      // onPress={() => {
      //   setLoginModalVisible(true); // If not logged in, show the login modal
      //   setSelectedDevice(item); // Set the device to connect to after login
      // }}
      onPress={() => connectToDevice(item)}
      title={"Connect"}
      disabled={isButtonDisabled}
    />
  );

  const handleEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTextHome(width)}>
          {" "}
          No available devices yet!
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.HomeView}>
      <ButtonUI
        onPress={() => {
          setScanning(!scanning);
        }}
        // onPress={() => {
        //   connectToDevice();
        // }}
        title={scanning ? "Stop Scanning" : "Scan devices"}
        btnStyle={styles.HomeBtnSendText(width)}
        txtStyle={styles.HomeTextSendStyle(width)}
      />
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.HomeTitle(width)}>Available devices :</Text>
        <Text style={styles.HomeCountDevices(width)}>({devices.length})</Text>
        {scanning && <ActivityIndicator size="small" color="#0055a4" />}
      </View>
      <FlatList
        contentContainerStyle={{
          flex: 1,
        }}
        data={devices}
        renderItem={renderItem}
        keyExtractor={(item, index) => index}
        refreshing={false}
        onRefresh={scanForDevices}
        ListEmptyComponent={handleEmpty}
      />
      <Login_modal
        loginModalVisible={loginModalVisible}
        setLoginModalVisible={setLoginModalVisible}
        disconnectDevice={disconnectDevice}
        pin={pin}
        setPin={setPin}
        handleSubmitPIN={handleSubmitPIN}
        loginIsIndicatorShown={loginIsIndicatorShown}
        onPress={() => openWellnameModal()}
      />
      <Wellname_modal
        wellNameModalVisible={wellNameModalVisible}
        setWellNameModalVisible={setWellNameModalVisible}
        wellname={wellname}
        setWellname={setWellname}
        handleSubmitWellName={handleSubmitWellName}
        isWellNameIndicatorShown={isWellNameIndicatorShown}
      />
      {showNotification && (
        <ReelNotification
          message={unitid}
          onDismiss={() => setShowNotification(false)} // Hide the notification when dismissed
        />
      )}
    </View>
  );
}
