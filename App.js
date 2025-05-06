import React, { useState, useEffect } from "react";
import { Text, View, Button, Platform } from "react-native";
import { BleManager } from "react-native-ble-plx";

const App = () => {
  const [manager, setManager] = useState(null);
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);

  useEffect(() => {
    const bleManager = new BleManager();
    setManager(bleManager);

    // Cleanup
    return () => {
      bleManager.destroy();
    };
  }, []);

  const startScanning = () => {
    if (manager) {
      manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.log(error);
          return;
        }

        if (device && device.name) {
          setDevices((prevDevices) => {
            return prevDevices.some((d) => d.id === device.id)
              ? prevDevices
              : [...prevDevices, device];
          });
        }
      });
    }
  };

  const stopScanning = () => {
    if (manager) {
      manager.stopDeviceScan();
    }
  };

  const connectToDevice = async (device) => {
    try {
      await device.connect();
      setConnectedDevice(device);
      console.log("Connected to", device.name);
    } catch (error) {
      console.log("Connection failed:", error);
    }
  };

  const disconnectDevice = async () => {
    if (connectedDevice) {
      try {
        await connectedDevice.cancelConnection();
        setConnectedDevice(null);
        console.log("Disconnected");
      } catch (error) {
        console.log("Disconnect failed:", error);
      }
    }
  };

  return (
    <View>
      <Text>BLE Example</Text>
      <Button title="Start Scanning" onPress={startScanning} />
      <Button title="Stop Scanning" onPress={stopScanning} />
      {devices.length > 0 && (
        <View>
          <Text>Found Devices:</Text>
          {devices.map((device) => (
            <View key={device.id}>
              <Text>{device.name}</Text>
              <Button title="Connect" onPress={() => connectToDevice(device)} />
            </View>
          ))}
        </View>
      )}
      {connectedDevice && (
        <View>
          <Text>Connected to {connectedDevice.name}</Text>
          <Button title="Disconnect" onPress={disconnectDevice} />
        </View>
      )}
    </View>
  );
};

export default App;
