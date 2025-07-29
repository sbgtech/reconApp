// deviceNameStorage.js
import * as FileSystem from "expo-file-system";

const FILE_PATH = FileSystem.documentDirectory + "customDeviceNames.json";

export const loadDeviceNameMap = async () => {
  try {
    const info = await FileSystem.getInfoAsync(FILE_PATH);
    console.log("File exists:", info.exists);
    if (!info.exists) return {};
    const data = await FileSystem.readAsStringAsync(FILE_PATH);
    console.log("File data:", data);
    return JSON.parse(data);
  } catch (e) {
    console.error("Error reading device name file:", e);
    return {};
  }
};

export const saveDeviceNameMap = async (map) => {
  try {
    const json = JSON.stringify(map);
    await FileSystem.writeAsStringAsync(FILE_PATH, json);
    console.log("Saved device name map:", json);
  } catch (e) {
    console.error("Error writing device name file:", e);
  }
};

export const setCustomDeviceName = async (deviceId, customName) => {
  const map = await loadDeviceNameMap();
  map[deviceId] = customName;
  await saveDeviceNameMap(map);
};

export const getCustomDeviceName = async (deviceId) => {
  const map = await loadDeviceNameMap();
  return map[deviceId] || null;
};
