import {
  UART_SERVICE_UUID,
  UART_RX_CHARACTERISTIC_UUID,
  UART_TX_CHARACTERISTIC_UUID,
} from "./Constants";
import { Buffer } from "buffer";
import Toast from "react-native-toast-message";
import {
Platform
} from "react-native";

export class Receive {
  // function listen to receive wellName
  static async ReceiveWellName(device, setWellName) {
    // Monitor characteristic for service
    const subscription = device?.monitorCharacteristicForService(
      UART_SERVICE_UUID,
      UART_RX_CHARACTERISTIC_UUID,
      (error, characteristic) => {
        if (error) {
          console.log("Characteristic monitoring error:", error);
          return;
        }
        // Check if data is received
        const str = Buffer.from(characteristic.value, "base64").toString(
          "utf-8"
        );
        if (str.includes("wellname")) {
          let result = str.split(" ").slice(1).join(" ").trim();
          setWellName(result);
        }
      }
    );
    // Return a function to clean up the subscription
    return () => {
      subscription.remove();
    };
  }

  // function listen to receive data for well status page
  static async WellStatusReceivedData(
    device,
    dispatchWellStatus,
    setLoading,
    setTitle
  ) {
    let dataReceived = false; // Flag to track if data is received

    return new Promise((resolve, reject) => {
      // Set loading to true at the start
      setLoading(true);
      setTitle("Loading...");
      // Set a timeout for the operation
      const timeout = setTimeout(() => {
        if (!dataReceived) {
          console.log("Data not received within 7 seconds in well status");
          setLoading(false);
          Toast.show({
            type: "error",
            text1: "Warning",
            text2: "No received data",
            visibilityTime: 3000,
          });
        }
        reject({ received: false });
      }, 7000);

      // Monitor characteristic for service
      const subscription = device?.monitorCharacteristicForService(
        UART_SERVICE_UUID,
        UART_RX_CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            clearTimeout(timeout); // Clear timeout on error
            console.log("Characteristic monitoring error:", error);
            setLoading(false);
            reject(error); // Reject the promise
            return;
          }
          // Check if data is received
          const str = Buffer.from(characteristic.value, "base64").toString(
            "utf-8"
          );
          const firstIndexValue = str.charAt(0); // Getting the character at index 0
          const pageIndex = str.charAt(1); // Getting the character at index 0
          const lastIndexValue = str[str.length - 2]; // Accessing the last character
          if (
            firstIndexValue == "[" &&
            lastIndexValue == "]" &&
            Number(pageIndex) == 1
          ) {
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
              arrivals: arrivals,
              fwVersion: parseFloat([msg[26]]) / 10 + "." + Number([msg[27]]),
              battery: msg[28],
            });
            dataReceived = true;
            clearTimeout(timeout);
            setLoading(false);
            resolve(true);
          }
          if (
            firstIndexValue == "[" &&
            lastIndexValue == "]" &&
            Number(pageIndex) == 5
          ) {
            const jsonString = str.replace(/'/g, '"');
            const msg = JSON.parse(jsonString);
            dispatchWellStatus({
              uniqueID: msg[1],
            });
            dataReceived = true;
            clearTimeout(timeout);
            setLoading(false);
            resolve(true);
          }
        }
      );
      // Return a function to clean up the subscription
      return () => {
        subscription.remove();
        clearTimeout(timeout);
      };
    }).catch(() => {
      console.log("Error receiving data from device");
      return false; // Return false in case of error
    });
  }

  // function listen to receive data for timer page
  static async TimerReceivedData(device, dispatchTimers, setLoading, setTitle) {
    let received = false;
    return new Promise((resolve, reject) => {
      setLoading(true);
      setTitle("Loading...");
      const timeout = setTimeout(() => {
        if (!received) {
          console.log("Data not received within 7 seconds timer");
          setLoading(false);
          Toast.show({
            type: "error",
            text1: "Warning",
            text2: "No received data",
            visibilityTime: 3000,
          });
        }
        reject({ received: false });
      }, 7000);
      const subscription = device?.monitorCharacteristicForService(
        UART_SERVICE_UUID,
        UART_RX_CHARACTERISTIC_UUID,
        (error, characteristic) => {
          clearTimeout(timeout);
          if (error) {
            console.log(error);
            reject(error);
            return;
          }
          const str = Buffer.from(characteristic.value, "base64").toString(
            "utf-8"
          );
          const firstIndexValue = str.charAt(0); // Getting the character at index 0
          const pageIndex = str.charAt(1); // Getting the character at index 0
          const lastIndexValue = str[str.length - 2]; // Accessing the last character
          if (
            firstIndexValue == "[" &&
            lastIndexValue == "]" &&
            Number(pageIndex) == 2
          ) {
            const msg = JSON.parse(str);
            dispatchTimers({
              receivedOpenTimer: msg[1],
              receivedShutinTimer: msg[2],
              receivedAfterflowTimer: msg[3],
              receivedMandatoryTimer: msg[4],
            });
            setLoading(false);
            clearTimeout(timeout);
            received = true;
            resolve(received);
          }
        }
      );
      // Return a function to clean up the subscription
      return () => {
        subscription.remove();
        clearTimeout(timeout);
      };
    }).catch(() => {
      console.log("Error receiving data from device");
      return false; // Return false in case of error
    });
  }

  // function listen to receive data for settings page
  static async SettingsReceivedData(
    device,
    dispatchSettings,
    setLoading,
    setTitle
  ) {
    let received = false;
    return new Promise(async (resolve, reject) => {
      setLoading(true);
      setTitle("Loading...");
      const timeout = setTimeout(() => {
        if (!received) {
          console.log("Data not received within 7 seconds settings");
          setLoading(false);
          Toast.show({
            type: "error",
            text1: "Warning",
            text2: "No received data",
            visibilityTime: 3000,
          });
        }
        reject({ received: false });
      }, 7000);
      const subscription = await device?.monitorCharacteristicForService(
        UART_SERVICE_UUID,
        UART_RX_CHARACTERISTIC_UUID,
        (error, characteristic) => {
          clearTimeout(timeout);
          if (error) {
            console.log(error);
            reject(error);
            return;
          }
          const str = Buffer.from(characteristic.value, "base64").toString(
            "utf-8"
          );
          const firstIndexValue = str.charAt(0); // Getting the character at index 0
          const pageIndex = str.charAt(1); // Getting the character at index 0
          const lastIndexValue = str[str.length - 2]; // Accessing the last character
          if (
            firstIndexValue == "[" &&
            lastIndexValue == "]" &&
            Number(pageIndex) == 3
          ) {
            const msg = JSON.parse(str);
            //
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
            //
            received = true;
            clearTimeout(timeout);
            setLoading(false);
            resolve(received);
          }
        }
      );
      // Return a function to clean up the subscription
      return () => {
        subscription.remove(); // unsubscribes from the characteristic updates
        clearTimeout(timeout);
      };
    }).catch(() => {
      console.log("Error receiving data from device");
      return false; // Return false in case of error
    });
  }

  // function listen to receive data for settings page
  static async StatisticsReceivedData(
    device,
    dispatchStatistics,
    setLoading,
    setTitle
  ) {
    let received = false;
    return new Promise((resolve, reject) => {
      setLoading(true);
      setTitle("Loading...");
      const timeout = setTimeout(() => {
        if (!received) {
          console.log("Data not received within 7 seconds settings");
          setLoading(false);
          Toast.show({
            type: "error",
            text1: "Warning",
            text2: "No received data",
            visibilityTime: 3000,
          });
        }
        reject({ received: false });
      }, 7000);
      const subscription = device?.monitorCharacteristicForService(
        UART_SERVICE_UUID,
        UART_RX_CHARACTERISTIC_UUID,
        (error, characteristic) => {
          clearTimeout(timeout);
          if (error) {
            console.log(error);
            reject(error);
            return;
          }
          const str = Buffer.from(characteristic.value, "base64").toString(
            "utf-8"
          );
          const firstIndexValue = str.charAt(0); // Getting the character at index 0
          const pageIndex = str.charAt(1); // Getting the character at index 0
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
            setLoading(false);
            clearTimeout(timeout);
            received = true;
            resolve(received);
          }
        }
      );
      // Return a function to clean up the subscription
      return () => {
        subscription.remove();
        clearTimeout(timeout);
      };
    }).catch(() => {
      console.log("Error receiving data from device");
      return false; // Return false in case of error
    });
  }

  // function listen to receive data for test page
  static async TestReceivedData(device, setters) {
    const { setDataArray, setLoading, setDataReceived } = setters;
    try {
      const subscription = device?.monitorCharacteristicForService(
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
      // Return a function to clean up the subscription
      return () => {
        subscription.remove();
        clearTimeout(timeout);
      };
    } catch (error) {
      console.log("No receiving data from device");
      return false;
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

  // function listen to receive "ACK" from device to stop loading and show "successfully sent", else show "Error to sent data" and the time given for waiting response to stop loading is 20 seconds.
  // static async ACKReceivedData(device, setters) {
  //   const { setLoading, setTitle } = setters;
  //   let sent = false;
  //   return new Promise(async (resolve, reject) => {
  //     setLoading(true);
  //     setTitle("Sending...");
  //     const timeout = setTimeout(() => {
  //       if (!sent) {
  //         console.log("Error to send data");
  //         setLoading(false);
  //         Toast.show({
  //           type: "error",
  //           text1: "Warning",
  //           text2: "Error to send data",
  //           visibilityTime: 3000,
  //         });
  //       }
  //       reject({ sent: false });
  //     }, 20000);
  //     const subscription = await device?.monitorCharacteristicForService(
  //       UART_SERVICE_UUID,
  //       UART_RX_CHARACTERISTIC_UUID,
  //       (error, characteristic) => {
  //         clearTimeout(timeout);
  //         if (error) {
  //           console.log(error);
  //           setLoading(false);
  //           reject(error);
  //           return;
  //         }
  //         const msg = Buffer.from(characteristic.value, "base64").toString(
  //           "utf-8"
  //         );
  //         if (msg === "ACK\n") {
  //           setLoading(false);
  //           sent = true;
  //           resolve(sent);
  //           Toast.show({
  //             type: "success",
  //             text1: "Success",
  //             text2: "Data sent successfully",
  //             visibilityTime: 3000,
  //           });
  //         }
  //       }
  //     );
  //     // Return a function to clean up the subscription
  //     return () => {
  //       setLoading(false);
  //       subscription.remove();
  //       clearTimeout(timeout);
  //     };
  //   }).catch(() => {
  //     console.log("Error receiving ACK");
  //     return false; // Return false in case of error
  //   });
  // }
}
