import {
  UART_SERVICE_UUID,
  UART_RX_CHARACTERISTIC_UUID,
  UART_TX_CHARACTERISTIC_UUID,
} from "./Constants";
import { Buffer } from "buffer";
import Toast from "react-native-toast-message";
import { Platform } from "react-native";

export class Receive {
  // function listen to receive wellName
  static async ReceiveWellName(device, setWellName, setLoading, setTitle) {
    return new Promise((resolve, reject) => {
      setLoading(true);
      setTitle("Loading...");

      let timeout;
      let subscription;
      let dataReceived = false;

      const cleanup = () => {
        clearTimeout(timeout);
        if (subscription && typeof subscription.remove === "function") {
          subscription.remove();
        }
        setTimeout(() => setLoading(false), 400);
      };

      timeout = setTimeout(() => {
        if (!dataReceived) {
          cleanup();
          console.log("Data not received within 7 seconds (Wellname)");
          Toast.show({
            type: "error",
            text1: "Warning",
            text2: "No Received Wellname",
            visibilityTime: 3000,
          });
          reject("Timeout: No Wellname received");
        }
      }, 7000);
      subscription = device?.monitorCharacteristicForService(
        UART_SERVICE_UUID,
        UART_RX_CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            cleanup();
            reject(error);
            return;
          }
          try {
            const str = Buffer.from(characteristic.value, "base64").toString(
              "utf-8"
            );
            if (str.includes("wellname")) {
              let result = str.split(" ").slice(1).join(" ").trim();
              setWellName(result);
              dataReceived = true;
              cleanup();
              resolve(true);
            }
          } catch (err) {
            console.log("Error parsing data:", err);
            // Wait for other packets; don't reject yet
          }
        }
      );
    }).catch((err) => {
      console.log("Receive failed:", err);
      return false;
    });
  }

  // function listen to receive data for well status page
  static async WellStatusReceivedData(
    device,
    dispatchWellStatus,
    setLoading,
    setTitle
  ) {
    return new Promise((resolve, reject) => {
      setLoading(true);
      setTitle("Loading...");

      let timeout;
      let page1Received = false;
      let page5Received = false;
      let subscription;

      const cleanup = () => {
        clearTimeout(timeout);
        if (subscription && typeof subscription.remove === "function") {
          subscription.remove();
        }
        setTimeout(() => setLoading(false), 400);
      };

      const finish = () => {
        if (page1Received && page5Received) {
          cleanup();
          resolve(true);
        }
      };

      timeout = setTimeout(() => {
        if (!page1Received || !page5Received) {
          cleanup();
          Toast.show({
            type: "error",
            text1: "Warning",
            text2: "No received data",
            visibilityTime: 3000,
          });
          reject("Timeout: Incomplete data received");
        }
      }, 7000);

      subscription = device?.monitorCharacteristicForService(
        UART_SERVICE_UUID,
        UART_RX_CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            cleanup();
            reject(error);
            return;
          }

          try {
            const str = Buffer.from(characteristic.value, "base64").toString(
              "utf-8"
            );
            const firstChar = str.charAt(0);
            const pageIndex = Number(str.charAt(1));
            const lastChar = str[str.length - 2];

            if (firstChar === "[" && lastChar === "]") {
              if (pageIndex === 1 && !page1Received) {
                const msg = JSON.parse(str);
                const arrivals = msg.slice(6, 26).map((value, index) => ({
                  name: `Arrival ${index + 1}`,
                  value,
                }));

                dispatchWellStatus({
                  plungerStateIndex: msg[1],
                  systemClock: msg[2],
                  line: msg[3],
                  tubing: msg[4],
                  casing: msg[5],
                  arrivals,
                  fwVersion: `${parseFloat([msg[26]]) / 10}.${Number([
                    msg[27],
                  ])}`,
                  battery: msg[28],
                });

                page1Received = true;
                finish();
              }

              if (pageIndex === 5 && !page5Received) {
                const msg = JSON.parse(str.replace(/'/g, '"'));

                dispatchWellStatus({
                  uniqueID: msg[1],
                });

                page5Received = true;
                finish();
              }
            }
          } catch (err) {
            console.log("Error parsing data:", err);
            // Wait for other packets; don't reject yet
          }
        }
      );
    }).catch((err) => {
      console.log("Receive failed:", err);
      return false;
    });
  }

  // function listen to receive data for timer page
  static async TimerReceivedData(device, dispatchTimers, setLoading, setTitle) {
    return new Promise((resolve, reject) => {
      setLoading(true);
      setTitle("Loading...");
      let timeout;
      let subscription;
      let dataReceived = false;

      const cleanup = () => {
        clearTimeout(timeout);
        if (subscription && typeof subscription.remove === "function") {
          subscription.remove();
        }
        setTimeout(() => setLoading(false), 400);
      };

      timeout = setTimeout(() => {
        if (!dataReceived) {
          cleanup();
          console.log("Data not received within 7 seconds (Timer)");
          Toast.show({
            type: "error",
            text1: "Warning",
            text2: "No received data",
            visibilityTime: 3000,
          });
          reject("Timeout: No timer data received");
        }
      }, 7000);

      subscription = device?.monitorCharacteristicForService(
        UART_SERVICE_UUID,
        UART_RX_CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            cleanup();
            reject(error);
            return;
          }

          try {
            const str = Buffer.from(characteristic.value, "base64").toString(
              "utf-8"
            );
            const firstChar = str.charAt(0);
            const pageIndex = Number(str.charAt(1));
            const lastChar = str[str.length - 2];

            if (firstChar === "[" && lastChar === "]" && pageIndex === 2) {
              const msg = JSON.parse(str);

              dispatchTimers({
                receivedOpenTimer: msg[1],
                receivedShutinTimer: msg[2],
                receivedAfterflowTimer: msg[3],
                receivedMandatoryTimer: msg[4],
              });

              dataReceived = true;
              cleanup();
              resolve(true);
            }
          } catch (err) {
            console.log("Error parsing timer data:", err);
            // We continue listening in case of parse issues
          }
        }
      );
    }).catch((err) => {
      console.log("Error receiving timer data:", err);
      return false;
    });
  }

  // function listen to receive data for settings page
  static async SettingsReceivedData(
    device,
    dispatchSettings,
    setLoading,
    setTitle
  ) {
    new Promise((resolve, reject) => {
      setLoading(true);
      setTitle("Loading...");
      let timeout;
      let subscription;
      let dataReceived = false;
      const cleanup = () => {
        clearTimeout(timeout);
        if (subscription && typeof subscription.remove === "function") {
          subscription.remove();
        }
        setTimeout(() => setLoading(false), 400);
      };
      timeout = setTimeout(() => {
        if (!dataReceived) {
          cleanup();
          console.log("Data not received within 7 seconds (Settings)");
          Toast.show({
            type: "error",
            text1: "Warning",
            text2: "No received data",
            visibilityTime: 3000,
          });
          reject("Timeout: No settings data received");
        }
      }, 7000);

      subscription = device?.monitorCharacteristicForService(
        UART_SERVICE_UUID,
        UART_RX_CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            cleanup();
            reject(error);
            return;
          }
          try {
            const str = Buffer.from(characteristic.value, "base64").toString(
              "utf-8"
            );
            const firstIndexValue = str.charAt(0);
            const pageIndex = Number(str.charAt(1));
            const lastIndexValue = str[str.length - 2];

            if (
              firstIndexValue === "[" &&
              lastIndexValue === "]" &&
              pageIndex === 3
            ) {
              const msg = JSON.parse(str);

              dispatchSettings({
                valveA: msg[1],
                valveB: msg[35],
                productionMethodIndex: msg[2],
                missrunMax: msg[3],
                falseArrivalsIndex: msg[4],
                wellDepth: msg[5],
                hiLoModeIndex: msg[6],
                hiLoHigh: msg[7],
                hiLoLow: msg[8],
                hiLoDelay: msg[39],
                LPTypeIndex: msg[9],
                LPSensorMax: msg[10],
                LPSensorMin: msg[11],
                LPVoltageMax: msg[12] / 10,
                LPVoltageMin: msg[13] / 10,
                CPTypeIndex: msg[14],
                CPSensorMax: msg[15],
                CPSensorMin: msg[16],
                CPVoltageMax: msg[17] / 10,
                CPVoltageMin: msg[18] / 10,
                TPTypeIndex: msg[19],
                TPSensorMax: msg[20],
                TPSensorMin: msg[21],
                TPVoltageMax: msg[22] / 10,
                TPVoltageMin: msg[23] / 10,
                pidOverrideIndex: msg[24],
                pidSP: msg[25],
                pidKP: msg[26],
                pidKI: msg[27],
                pidKD: msg[28],
                pidINIT: msg[29],
                pidDB: msg[30],
                pidLL: msg[31],
                autocatcherIndex: msg[32],
                autocatcherDelay: msg[33],
                BValveTwinIndex: msg[34],
                receivedPressureSourceIndex: msg[36],
                receivedPressureMaxPSI: msg[37],
                receivedPressureMinPSI: msg[38],
              });
              dataReceived = true;
              cleanup();
              resolve(true);
              if (subscription?.remove) subscription.remove();
            }
          } catch (err) {
            console.log("Error parsing settings data:", err);
            // We continue listening in case of parse issues
          }
        }
      );
    }).catch((err) => {
      console.log("Error receiving settings data:", err);
      return false;
    });
  }

  // function listen to receive data for settings page
  static async StatisticsReceivedData(
    device,
    dispatchStatistics,
    setLoading,
    setTitle
  ) {
    return new Promise((resolve, reject) => {
      setLoading(true);
      setTitle("Loading...");
      let timeout;
      let subscription;
      let dataReceived = false;
      const cleanup = () => {
        clearTimeout(timeout);
        if (subscription && typeof subscription.remove === "function") {
          subscription.remove();
        }
        setTimeout(() => setLoading(false), 400);
      };

      timeout = setTimeout(() => {
        if (!dataReceived) {
          cleanup();
          console.log("Data not received within 7 seconds (Statistic)");
          Toast.show({
            type: "error",
            text1: "Warning",
            text2: "No received data",
            visibilityTime: 3000,
          });
          reject("Timeout: No Statistic data received");
        }
      }, 7000);
      device?.monitorCharacteristicForService(
        UART_SERVICE_UUID,
        UART_RX_CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            cleanup();
            reject(error);
            return;
          }
          try {
            const str = Buffer.from(characteristic.value, "base64").toString(
              "utf-8"
            );
            const firstIndexValue = str.charAt(0); // Getting the character at index 0
            const pageIndex = Number(str.charAt(1)); // Getting the character at index 0
            const lastIndexValue = str[str.length - 2]; // Accessing the last character
            if (
              firstIndexValue == "[" &&
              lastIndexValue == "]" &&
              Number(pageIndex) == 4
            ) {
              const msg = JSON.parse(str);
              dispatchStatistics({
                arrivalsToday: msg[1],
                arrivalsWeek: msg[2],
                arrivalsTotal: msg[3],
                missrunToday: msg[4],
                missrunWeek: msg[5],
                missrunTotal: msg[6],
                onTimeToday: msg[7],
                onTimeWeek: msg[8],
                onTimeTotal: msg[9],
              });
              //
              dataReceived = true;
              cleanup();
              resolve(true);
            }
          } catch (err) {
            console.log("Error parsing statistic data:", err);
            // We continue listening in case of parse issues
          }
        }
      );
    }).catch(() => {
      console.log("Error receiving statistic data:", err);
      return false;
    });
  }

  // function listen to receive data for test page
  static async TestReceivedData(device, setters) {
    const { setDataArray, setLoading, setDataReceived } = setters;
    try {
      device?.monitorCharacteristicForService(
        UART_SERVICE_UUID,
        UART_RX_CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            console.log(error);
            return;
          }
          const msg = Buffer.from(characteristic.value, "base64").toString(
            "utf-8"
          );
          // if (msg !== "NACK\n") {
          setDataArray((prevArray) => [
            ...prevArray,
            { date: Date.now(), data: msg, type: "RX" },
          ]);
          setLoading(false);
          setDataReceived(true); // Update dataReceived state
          // }
        }
      );
      return subscription;
    } catch (error) {
      console.log("No receiving data from device", error);
      return null;
    }
  }

  // function get total seconds in input and return converted time in HH:MM:SS format
  static convertToHMS = (totalSeconds) => {
    let hours = Math.floor(totalSeconds / 3600);
    let remainingSecondsAfterHours = totalSeconds % 3600;
    let minutes = Math.floor(remainingSecondsAfterHours / 60);
    let seconds = remainingSecondsAfterHours % 60;

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    return formattedHours + ":" + formattedMinutes + ":" + formattedSeconds;
  };

  static convertTimersToHMS = (totalSeconds) => {
    let hours = Math.floor(totalSeconds / 3600);
    let remainingSecondsAfterHours = totalSeconds % 3600;
    let minutes = Math.floor(remainingSecondsAfterHours / 60);
    let seconds = remainingSecondsAfterHours % 60;

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    return { formattedHours, formattedMinutes, formattedSeconds };
  };

  // function for sending data to device (called it into each page)
  static async sendReqToGetData(connectedDevice, activeTab) {
    try {
      const data = "0x0" + (activeTab + 1) + " \n";
      const buffer = Buffer.from(data, "utf-8");
      await connectedDevice?.writeCharacteristicWithResponseForService(
        UART_SERVICE_UUID,
        UART_TX_CHARACTERISTIC_UUID,
        buffer.toString("base64")
      );
    } catch (error) {
      console.log("Error to sent request for receiving data.");
    }
  }

  // function for sending device id and phone type (android or ios)
  static async sendIden(connectedDevice, id) {
    try {
      let data = "";
      if (Platform.OS === "android") {
        data = `BLEID:${id},TYPE:ANDROID \n`;
      } else {
        data = `BLEID:${id},TYPE:IOS \n`;
      }
      const buffer = Buffer.from(data, "utf-8");
      await connectedDevice?.writeCharacteristicWithResponseForService(
        UART_SERVICE_UUID,
        UART_TX_CHARACTERISTIC_UUID,
        buffer.toString("base64")
      );
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }
}
