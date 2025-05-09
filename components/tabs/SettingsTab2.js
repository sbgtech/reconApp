import React, { useEffect, useReducer, useState } from "react";
import {
  View,
  Text,
  TextInput,
  useWindowDimensions,
  Dimensions,
  StyleSheet,
  Platform,
} from "react-native";
import { styles } from "./style/styles";
import ButtonUI from "../ButtonUI";
import Dropdown from "./blocs/Dropdown";
import { Receive } from "../Utils/Receive";
import Loading from "./blocs/Loading";
import Valve from "./blocs/Valve";
import RefreshBtn from "./blocs/RefreshBtn";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Buffer } from "buffer";
import {
  UART_SERVICE_UUID,
  UART_TX_CHARACTERISTIC_UUID,
} from "../Utils/Constants";
import Toast from "react-native-toast-message";

const SettingsTab2 = (props) => {
  // declare initial states
  const { height } = Dimensions.get("window");
  const { width } = useWindowDimensions();
  const cardMinWidth =
    width < 600 ? width : width > 950 ? width / 3.4 : width / 2.3;
  const numColumns = Math.max(1, Math.floor(width / cardMinWidth));
  // the loading state, default is false
  const [loading, setLoading] = useState(false);
  // title of loading modal
  const [title, setTitle] = useState("");

  const productionMethod = [
    "Timer mode",
    "Timer Intermit mode",
    "Pressure Intermit mode",
  ];
  const falseArrivals_hiLoMode = ["Disable", "Enable"];
  // The dropdown select options for LP, CP and TP
  const LP_CP_TP_type = ["Voltage"];

  const initialSettingsState = {
    valveA: 0,
    valveB: 0,
    productionMethodIndex: null,
    missrunMax: "",
    falseArrivalsIndex: null,
    wellDepth: "",
    hiLoModeIndex: null,
    hiLoHigh: "",
    hiLoLow: "",
    hiLoDelay: "",
    pidOverrideIndex: null,
    pidSP: "",
    pidKP: "",
    pidKI: "",
    pidKD: "",
    pidINIT: "",
    pidDB: "",
    pidLL: "",
    autocatcherIndex: null,
    autocatcherDelay: "",
    BValveTwinIndex: null,
    receivedPressureSourceIndex: null,
    receivedPressureMaxPSI: "",
    receivedPressureMinPSI: "",
    LPTypeIndex: null,
    LPSensorMax: "",
    LPSensorMin: "",
    LPVoltageMax: "",
    LPVoltageMin: "",
    CPTypeIndex: null,
    CPSensorMax: "",
    CPSensorMin: "",
    CPVoltageMax: "",
    CPVoltageMin: "",
    TPTypeIndex: null,
    TPSensorMax: "",
    TPSensorMin: "",
    TPVoltageMax: "",
    TPVoltageMin: "",
  };

  const settingsReducer = (state, action) => ({
    ...state,
    ...action, // Merge new values
  });

  const [settings, dispatchSettings] = useReducer(
    settingsReducer,
    initialSettingsState
  );

  // handle change missrunMax value
  const handleChangeMissrunMax = (text) => {
    if (text) {
      const validText = text.replace(/[^0-9]/g, "");
      if (validText.length > 4) {
        Toast.show({
          type: "error",
          text1: "Warning",
          text2: "The max value must be 4 digits",
          visibilityTime: 3000,
        });
        dispatchSettings({ missrunMax: "" });
      } else {
        dispatchSettings({ missrunMax: validText });
      }
    } else {
      dispatchSettings({ missrunMax: "" });
    }
  };

  // handle change wellDepth value
  const handleChangeWellDepth = (text) => {
    if (text) {
      const validText = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      // Ensure the length is 4
      if (validText.length > 4) {
        Toast.show({
          type: "error",
          text1: "Warning",
          text2: "The max value must be 4 digits",
          visibilityTime: 3000,
        });
        dispatchSettings({ wellDepth: "" });
      } else {
        dispatchSettings({ wellDepth: validText });
      }
    } else {
      dispatchSettings({ wellDepth: "" });
    }
  };

  // handle change hiloHight value
  const handleChangeHiLoHigh = (text) => {
    if (text) {
      const validText = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      // Ensure the length is 4
      if (validText.length > 4) {
        Toast.show({
          type: "error",
          text1: "Warning",
          text2: "The max value must be 4 digits",
          visibilityTime: 3000,
        });
        dispatchSettings({ hiLoHigh: "" });
      } else {
        dispatchSettings({ hiLoHigh: validText });
      }
    } else {
      dispatchSettings({ hiLoHigh: "" });
    }
  };

  // handle change hiloLow value
  const handleChangeHiLoLow = (text) => {
    if (text) {
      const validText = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      // Ensure the length is 4
      if (validText.length > 4) {
        Toast.show({
          type: "error",
          text1: "Warning",
          text2: "The max value must be 4 digits",
          visibilityTime: 3000,
        });
        dispatchSettings({ hiLoLow: "" });
      } else {
        dispatchSettings({ hiLoLow: validText });
      }
    } else {
      dispatchSettings({ hiLoLow: "" });
    }
  };

  // handle change HiLo Delay value
  const handleChangeHiLoDelay = (text) => {
    if (text) {
      const validText = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      // Ensure the length is 3
      if (validText.length > 3) {
        Toast.show({
          type: "error",
          text1: "Warning",
          text2: "The max value must be 3 digits",
          visibilityTime: 3000,
        });
        dispatchSettings({ hiLoDelay: "" });
      } else {
        dispatchSettings({ hiLoDelay: validText });
      }
    } else {
      dispatchSettings({ hiLoDelay: "" });
    }
  };

  // handle change pid SP value
  const handleChangePidSP = (text) => {
    if (text) {
      const validText = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      // Ensure the length is 4
      if (validText.length > 4) {
        Toast.show({
          type: "error",
          text1: "Warning",
          text2: "The max value must be 4 digits",
          visibilityTime: 3000,
        });
        dispatchSettings({ pidSP: "" });
      } else {
        dispatchSettings({ pidSP: validText });
      }
    } else {
      dispatchSettings({ pidSP: "" });
    }
  };

  // handle change pid KP value
  const handleChangePidKP = (text) => {
    if (text) {
      const validText = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      // Ensure the length is 3
      if (validText.length > 3) {
        Toast.show({
          type: "error",
          text1: "Warning",
          text2: "The max value must be 3 digits",
          visibilityTime: 3000,
        });
        dispatchSettings({ pidKP: "" });
      } else {
        dispatchSettings({ pidKP: validText });
      }
    } else {
      dispatchSettings({ pidKP: "" });
    }
  };

  // handle change pid KI value
  const handleChangePidKI = (text) => {
    if (text) {
      const validText = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      // Ensure the length is 3
      if (validText.length > 3) {
        Toast.show({
          type: "error",
          text1: "Warning",
          text2: "The max value must be 3 digits",
          visibilityTime: 3000,
        });
        dispatchSettings({ pidKI: "" });
      } else {
        dispatchSettings({ pidKI: validText });
      }
    } else {
      dispatchSettings({ pidKI: "" });
    }
  };

  // handle change pid KD value
  const handleChangePidKD = (text) => {
    if (text) {
      const validText = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      // Ensure the length is 3
      if (validText.length > 3) {
        Toast.show({
          type: "error",
          text1: "Warning",
          text2: "The max value must be 3 digits",
          visibilityTime: 3000,
        });
        dispatchSettings({ pidKD: "" });
      } else {
        dispatchSettings({ pidKD: validText });
      }
    } else {
      dispatchSettings({ pidKD: "" });
    }
  };

  // handle change pid INIT value
  const handleChangePidINIT = (text) => {
    if (text) {
      const validText = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      // Ensure the length is 3
      if (validText.length > 3) {
        Toast.show({
          type: "error",
          text1: "Warning",
          text2: "The max value must be 3 digits",
          visibilityTime: 3000,
        });
        dispatchSettings({ pidINIT: "" });
      } else {
        dispatchSettings({ pidINIT: validText });
      }
    } else {
      dispatchSettings({ pidINIT: "" });
    }
  };

  // handle change pid DB value
  const handleChangePidDB = (text) => {
    if (text) {
      const validText = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      // Ensure the length is 3
      if (validText.length > 3) {
        Toast.show({
          type: "error",
          text1: "Warning",
          text2: "The max value must be 3 digits",
          visibilityTime: 3000,
        });
        dispatchSettings({ pidDB: "" });
      } else {
        dispatchSettings({ pidDB: validText });
      }
    } else {
      dispatchSettings({ pidDB: "" });
    }
  };

  // handle change pid LL value
  const handleChangePidLL = (text) => {
    if (text) {
      const validText = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      // Ensure the length is 3
      if (validText.length > 3) {
        Toast.show({
          type: "error",
          text1: "Warning",
          text2: "The max value must be 3 digits",
          visibilityTime: 3000,
        });
        dispatchSettings({ pidLL: "" });
      } else {
        dispatchSettings({ pidLL: validText });
      }
    } else {
      dispatchSettings({ pidLL: "" });
    }
  };

  // handle change AUTOCATCHER Delay value
  const handleChangeAutocatcherDelay = (text) => {
    if (text) {
      const validText = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      // Ensure the length is 3
      if (validText.length > 3) {
        Toast.show({
          type: "error",
          text1: "Warning",
          text2: "The max value must be 3 digits",
          visibilityTime: 3000,
        });
        dispatchSettings({ autocatcherDelay: "" });
      } else {
        dispatchSettings({ autocatcherDelay: validText });
      }
    } else {
      dispatchSettings({ autocatcherDelay: "" });
    }
  };

  // handle change Max PSI value
  const handleChangeMaxPSI = (text) => {
    if (text) {
      const validText = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      // Ensure the length is 4
      if (validText.length > 4) {
        Toast.show({
          type: "error",
          text1: "Warning",
          text2: "The max value must be 4 digits",
          visibilityTime: 3000,
        });
        dispatchSettings({ receivedPressureMaxPSI: "" });
      } else {
        dispatchSettings({ receivedPressureMaxPSI: validText });
      }
    } else {
      dispatchSettings({ receivedPressureMaxPSI: "" });
    }
  };

  // handle change Min PSI value
  const handleChangeMinPSI = (text) => {
    if (text) {
      const validText = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      // Ensure the length is 4
      if (validText.length > 4) {
        Toast.show({
          type: "error",
          text1: "Warning",
          text2: "The max value must be 4 digits",
          visibilityTime: 3000,
        });
        dispatchSettings({ receivedPressureMinPSI: "" });
      } else {
        dispatchSettings({ receivedPressureMinPSI: validText });
      }
    } else {
      dispatchSettings({ receivedPressureMinPSI: "" });
    }
  };

  // handle change LPSensorMax value
  const handleChangeLPSensorMax = (text) => {
    if (text) {
      const validText = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      // Ensure the length is 4
      if (validText.length > 4) {
        Toast.show({
          type: "error",
          text1: "Warning",
          text2: "The max value must be 4 digits",
          visibilityTime: 3000,
        });
        dispatchSettings({ LPSensorMax: "" });
      } else {
        dispatchSettings({ LPSensorMax: validText });
      }
    } else {
      dispatchSettings({ LPSensorMax: "" });
    }
  };

  // handle change LPSensorMin value
  const handleChangeLPSensorMin = (text) => {
    if (text) {
      const validText = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      // Ensure the length is 4
      if (validText.length > 4) {
        Toast.show({
          type: "error",
          text1: "Warning",
          text2: "The max value must be 4 digits",
          visibilityTime: 3000,
        });
        dispatchSettings({ LPSensorMin: "" });
      } else {
        dispatchSettings({ LPSensorMin: validText });
      }
    } else {
      dispatchSettings({ LPSensorMin: "" });
    }
  };

  // handle change LPVoltageMax value
  const handleChangeLPVoltageMax = (text) => {
    const MAX_VALUE = 9.9;

    if (text) {
      // Remove all non-numeric characters except decimal points
      let validText = text.replace(/[^0-9.]/g, "");

      // Find the position of the first decimal point
      const decimalIndex = validText.indexOf(".");

      // Allow only one digit before and one digit after the decimal point
      if (decimalIndex !== -1) {
        // Keep one digit before the decimal and one after
        validText = validText.substring(0, decimalIndex + 2);
      } else {
        // Ensure only one digit before the decimal point
        validText = validText.substring(0, 1);
      }

      // Remove any additional decimal points
      validText = validText.replace(/\.(?=.*\.)/g, "");

      const numericValue = parseFloat(validText);

      if (!isNaN(numericValue)) {
        if (numericValue > MAX_VALUE) {
          Toast.show({
            type: "error",
            text1: "Warning",
            text2: "The max value must be 9.9",
            visibilityTime: 3000,
          });
          dispatchSettings({ LPVoltageMax: "" });
        } else {
          dispatchSettings({ LPVoltageMax: validText });
        }
      } else {
        dispatchSettings({ LPVoltageMax: "" });
      }
    } else {
      dispatchSettings({ LPVoltageMax: "" });
    }
  };

  // handle change LPVoltageMin value
  const handleChangeLPVoltageMin = (text) => {
    const MAX_VALUE = 9.9;

    if (text) {
      // Remove all non-numeric characters except decimal points
      let validText = text.replace(/[^0-9.]/g, "");

      // Find the position of the first decimal point
      const decimalIndex = validText.indexOf(".");

      // Allow only one digit before and one digit after the decimal point
      if (decimalIndex !== -1) {
        // Keep one digit before the decimal and one after
        validText = validText.substring(0, decimalIndex + 2);
      } else {
        // Ensure only one digit before the decimal point
        validText = validText.substring(0, 1);
      }

      // Remove any additional decimal points
      validText = validText.replace(/\.(?=.*\.)/g, "");

      const numericValue = parseFloat(validText);

      if (!isNaN(numericValue)) {
        if (numericValue > MAX_VALUE) {
          Toast.show({
            type: "error",
            text1: "Warning",
            text2: "The max value must be 9.9",
            visibilityTime: 3000,
          });
          dispatchSettings({ LPVoltageMin: "" });
        } else {
          dispatchSettings({ LPVoltageMin: validText });
        }
      } else {
        dispatchSettings({ LPVoltageMin: "" });
      }
    } else {
      dispatchSettings({ LPVoltageMin: "" });
    }
  };

  // handle change CPSensorMax value
  const handleChangeCPSensorMax = (text) => {
    if (text) {
      const validText = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      // Ensure the length is 4
      if (validText.length > 4) {
        Toast.show({
          type: "error",
          text1: "Warning",
          text2: "The max value must be 4 digits",
          visibilityTime: 3000,
        });
        dispatchSettings({ CPSensorMax: "" });
      } else {
        dispatchSettings({ CPSensorMax: validText });
      }
    } else {
      dispatchSettings({ CPSensorMax: "" });
    }
  };

  // handle change CPSensorMin value
  const handleChangeCPSensorMin = (text) => {
    if (text) {
      const validText = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      // Ensure the length is 4
      if (validText.length > 4) {
        Toast.show({
          type: "error",
          text1: "Warning",
          text2: "The max value must be 4 digits",
          visibilityTime: 3000,
        });
        dispatchSettings({ CPSensorMin: "" });
      } else {
        dispatchSettings({ CPSensorMin: validText });
      }
    } else {
      dispatchSettings({ CPSensorMin: "" });
    }
  };

  // handle change CPVoltageMax value
  const handleChangeCPVoltageMax = (text) => {
    const MAX_VALUE = 9.9;

    if (text) {
      // Remove all non-numeric characters except decimal points
      let validText = text.replace(/[^0-9.]/g, "");

      // Find the position of the first decimal point
      const decimalIndex = validText.indexOf(".");

      // Allow only one digit before and one digit after the decimal point
      if (decimalIndex !== -1) {
        // Keep one digit before the decimal and one after
        validText = validText.substring(0, decimalIndex + 2);
      } else {
        // Ensure only one digit before the decimal point
        validText = validText.substring(0, 1);
      }

      // Remove any additional decimal points
      validText = validText.replace(/\.(?=.*\.)/g, "");

      const numericValue = parseFloat(validText);

      if (!isNaN(numericValue)) {
        if (numericValue > MAX_VALUE) {
          Toast.show({
            type: "error",
            text1: "Warning",
            text2: "The max value must be 9.9",
            visibilityTime: 3000,
          });
          dispatchSettings({ CPVoltageMax: "" });
        } else {
          dispatchSettings({ CPVoltageMax: validText });
        }
      } else {
        dispatchSettings({ CPVoltageMax: "" });
      }
    } else {
      dispatchSettings({ CPVoltageMax: "" });
    }
  };

  // handle change CPVoltageMin value
  const handleChangeCPVoltageMin = (text) => {
    const MAX_VALUE = 9.9;

    if (text) {
      // Remove all non-numeric characters except decimal points
      let validText = text.replace(/[^0-9.]/g, "");

      // Find the position of the first decimal point
      const decimalIndex = validText.indexOf(".");

      // Allow only one digit before and one digit after the decimal point
      if (decimalIndex !== -1) {
        // Keep one digit before the decimal and one after
        validText = validText.substring(0, decimalIndex + 2);
      } else {
        // Ensure only one digit before the decimal point
        validText = validText.substring(0, 1);
      }

      // Remove any additional decimal points
      validText = validText.replace(/\.(?=.*\.)/g, "");

      const numericValue = parseFloat(validText);

      if (!isNaN(numericValue)) {
        if (numericValue > MAX_VALUE) {
          Toast.show({
            type: "error",
            text1: "Warning",
            text2: "The max value must be 9.9",
            visibilityTime: 3000,
          });
          dispatchSettings({ CPVoltageMin: "" });
        } else {
          dispatchSettings({ CPVoltageMin: validText });
        }
      } else {
        dispatchSettings({ CPVoltageMin: "" });
      }
    } else {
      dispatchSettings({ CPVoltageMin: "" });
    }
  };

  // handle change TPSensorMax value
  const handleChangeTPSensorMax = (text) => {
    if (text) {
      const validText = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      // Ensure the length is 4
      if (validText.length > 4) {
        Toast.show({
          type: "error",
          text1: "Warning",
          text2: "The max value must be 4 digits",
          visibilityTime: 3000,
        });
        dispatchSettings({ TPSensorMax: "" });
      } else {
        dispatchSettings({ TPSensorMax: validText });
      }
    } else {
      dispatchSettings({ TPSensorMax: "" });
    }
  };

  // handle change TPSensorMin value
  const handleChangeTPSensorMin = (text) => {
    if (text) {
      const validText = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      // Ensure the length is 4
      if (validText.length > 4) {
        Toast.show({
          type: "error",
          text1: "Warning",
          text2: "The max value must be 4 digits",
          visibilityTime: 3000,
        });
        dispatchSettings({ TPSensorMin: "" });
      } else {
        dispatchSettings({ TPSensorMin: validText });
      }
    } else {
      dispatchSettings({ TPSensorMin: "" });
    }
  };

  // handle change TPVoltageMax value
  const handleChangeTPVoltageMax = (text) => {
    const MAX_VALUE = 9.9;

    if (text) {
      // Remove all non-numeric characters except decimal points
      let validText = text.replace(/[^0-9.]/g, "");

      // Find the position of the first decimal point
      const decimalIndex = validText.indexOf(".");

      // Allow only one digit before and one digit after the decimal point
      if (decimalIndex !== -1) {
        // Keep one digit before the decimal and one after
        validText = validText.substring(0, decimalIndex + 2);
      } else {
        // Ensure only one digit before the decimal point
        validText = validText.substring(0, 1);
      }

      // Remove any additional decimal points
      validText = validText.replace(/\.(?=.*\.)/g, "");

      const numericValue = parseFloat(validText);

      if (!isNaN(numericValue)) {
        if (numericValue > MAX_VALUE) {
          Toast.show({
            type: "error",
            text1: "Warning",
            text2: "The max value must be 9.9",
            visibilityTime: 3000,
          });
          dispatchSettings({ TPVoltageMax: "" });
        } else {
          dispatchSettings({ TPVoltageMax: validText });
        }
      } else {
        dispatchSettings({ TPVoltageMax: "" });
      }
    } else {
      dispatchSettings({ TPVoltageMax: "" });
    }
  };

  // handle change TPVoltageMin value
  const handleChangeTPVoltageMin = (text) => {
    const MAX_VALUE = 9.9;

    if (text) {
      // Remove all non-numeric characters except decimal points
      let validText = text.replace(/[^0-9.]/g, "");

      // Find the position of the first decimal point
      const decimalIndex = validText.indexOf(".");

      // Allow only one digit before and one digit after the decimal point
      if (decimalIndex !== -1) {
        // Keep one digit before the decimal and one after
        validText = validText.substring(0, decimalIndex + 2);
      } else {
        // Ensure only one digit before the decimal point
        validText = validText.substring(0, 1);
      }

      // Remove any additional decimal points
      validText = validText.replace(/\.(?=.*\.)/g, "");

      const numericValue = parseFloat(validText);

      if (!isNaN(numericValue)) {
        if (numericValue > MAX_VALUE) {
          Toast.show({
            type: "error",
            text1: "Warning",
            text2: "The max value must be 9.9",
            visibilityTime: 3000,
          });
          dispatchSettings({ TPVoltageMin: "" });
        } else {
          dispatchSettings({ TPVoltageMin: validText });
        }
      } else {
        dispatchSettings({ TPVoltageMin: "" });
      }
    } else {
      dispatchSettings({ TPVoltageMin: "" });
    }
  };

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
      console.log("index is ", settings.productionMethodIndex);
      const buffer = Buffer.from(arr + "\n", "utf-8");
      props.connectedDevice?.writeCharacteristicWithResponseForService(
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
      fetchDataSettings();
    } catch (error) {
      console.log(
        "Error with writeCharacteristicWithResponseForService :",
        error
      );
    }
  };

  // send array of HiLo values to device
  const handleSendHiLo = async () => {
    if (
      settings.hiLoHigh === "" ||
      settings.hiLoLow === "" ||
      settings.hiLoDelay === ""
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "All fields (HiLo high, HiLo low and HiLo Delay) must be filled",
        visibilityTime: 4000,
      });
      return; // Exit the function if validation fails
    } else if (Number(settings.hiLoLow) > Number(settings.hiLoHigh)) {
      Toast.show({
        type: "error",
        text1: "Warning",
        text2: "The HiLo high value must be more than HiLo low value",
        visibilityTime: 4000,
      });
    } else {
      try {
        const arr = JSON.stringify([
          3,
          122,
          settings.hiLoModeIndex,
          123,
          Number(settings.hiLoHigh),
          124,
          Number(settings.hiLoLow),
          155,
          Number(settings.hiLoDelay),
        ]);
        const buffer = Buffer.from(arr + "\n", "utf-8");
        props.connectedDevice?.writeCharacteristicWithResponseForService(
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
        fetchDataSettings();
      } catch (error) {
        console.log(
          "Error with writeCharacteristicWithResponseForService :",
          error
        );
      }
    }
  };

  // send array of PID values to device
  const handleSendPID = async () => {
    if (
      settings.pidSP === "" ||
      settings.pidKP === "" ||
      settings.pidKI === "" ||
      settings.pidKD === "" ||
      settings.pidINIT === "" ||
      settings.pidDB === "" ||
      settings.pidLL === ""
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "All fields of PID must be filled",
        visibilityTime: 4000,
      });
      return; // Exit the function if validation fails
    } else {
      try {
        const arr = JSON.stringify([
          3,
          133,
          settings.pidOverrideIndex,
          134,
          Number(settings.pidSP),
          135,
          Number(settings.pidKP),
          136,
          Number(settings.pidKI),
          137,
          Number(settings.pidKD),
          138,
          Number(settings.pidINIT),
          139,
          Number(settings.pidDB),
          140,
          Number(settings.pidLL),
        ]);
        const buffer = Buffer.from(arr + "\n", "utf-8");
        props.connectedDevice?.writeCharacteristicWithResponseForService(
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
        fetchDataSettings();
      } catch (error) {
        console.log(
          "Error with writeCharacteristicWithResponseForService :",
          error
        );
      }
    }
  };

  // send array of AUTOCATCHER values to device
  const handleSendAutocatcher = async () => {
    if (settings.autocatcherDelay === "") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "All fields of AUTOCATCHER must be filled",
        visibilityTime: 4000,
      });
      return; // Exit the function if validation fails
    } else {
      try {
        const arr = JSON.stringify([
          3,
          141,
          settings.autocatcherIndex,
          143,
          Number(settings.autocatcherDelay),
          158,
          settings.BValveTwinIndex,
        ]);
        const buffer = Buffer.from(arr + "\n", "utf-8");
        props.connectedDevice?.writeCharacteristicWithResponseForService(
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
        fetchDataSettings();
      } catch (error) {
        console.log(
          "Error with writeCharacteristicWithResponseForService :",
          error
        );
      }
    }
  };

  // send array of Pressure Intermit values to device
  const handleSendPressureIntermit = async () => {
    if (
      settings.receivedPressureMaxPSI === "" ||
      settings.receivedPressureMinPSI === ""
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Max PSI & Min PSI must be filled",
        visibilityTime: 3000,
      });
      return; // Exit the function if validation fails
    } else if (
      Number(settings.receivedPressureMinPSI) >
      Number(settings.receivedPressureMaxPSI)
    ) {
      Toast.show({
        type: "error",
        text1: "Warning",
        text2: "The Max PSI must be more than Min PSI",
        visibilityTime: 4000,
      });
    } else {
      try {
        const arr = JSON.stringify([
          3,
          159,
          settings.receivedPressureSourceIndex,
          160,
          Number(settings.receivedPressureMaxPSI),
          161,
          Number(settings.receivedPressureMinPSI),
        ]);
        const buffer = Buffer.from(arr + "\n", "utf-8");
        props.connectedDevice?.writeCharacteristicWithResponseForService(
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
        fetchDataSettings();
      } catch (error) {
        console.log(
          "Error with writeCharacteristicWithResponseForService :",
          error
        );
      }
    }
  };

  // send array of LP values to device
  const handleSendLP = async () => {
    if (
      settings.LPSensorMax === "" ||
      settings.LPSensorMin === "" ||
      settings.LPVoltageMax === "" ||
      settings.LPVoltageMin === ""
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "All fields (LP sensor and LP Voltage) must be filled",
        visibilityTime: 4000,
      });
      return; // Exit the function if validation fails
    } else if (Number(settings.LPSensorMin) > Number(settings.LPSensorMax)) {
      Toast.show({
        type: "error",
        text1: "Warning",
        text2: "The LP Sensor max must be more than LP Sensor min",
        visibilityTime: 4000,
      });
    } else if (Number(settings.LPVoltageMin) > Number(settings.LPVoltageMax)) {
      Toast.show({
        type: "error",
        text1: "Warning",
        text2: "The LP Voltage max must be more than LP Voltage min",
        visibilityTime: 4000,
      });
    } else {
      try {
        const arr = JSON.stringify([
          3,
          100,
          settings.LPTypeIndex,
          101,
          Number(settings.LPSensorMax),
          102,
          Number(settings.LPSensorMin),
          116,
          Number(settings.LPVoltageMax * 10),
          117,
          Number(settings.LPVoltageMin * 10),
        ]);
        const buffer = Buffer.from(arr + "\n", "utf-8");
        props.connectedDevice?.writeCharacteristicWithResponseForService(
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
        fetchDataSettings();
      } catch (error) {
        console.log(
          "Error with writeCharacteristicWithResponseForService :",
          error
        );
      }
    }
  };

  // send array of CP values to device
  const handleSendCP = async () => {
    if (
      settings.CPSensorMax === "" ||
      settings.CPSensorMin === "" ||
      settings.CPVoltageMax === "" ||
      settings.CPVoltageMin === ""
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "All fields (CP sensor and CP Voltage) must be filled",
        visibilityTime: 3000,
      });
      return; // Exit the function if validation fails
    } else if (Number(settings.CPSensorMin) > Number(settings.CPSensorMax)) {
      Toast.show({
        type: "error",
        text1: "Warning",
        text2: "The CP Sensor max must be more than CP Sensor min",
        visibilityTime: 4000,
      });
    } else if (Number(settings.CPVoltageMin) > Number(settings.CPVoltageMax)) {
      Toast.show({
        type: "error",
        text1: "Warning",
        text2: "The CP Voltage max must be more than CP Voltage min",
        visibilityTime: 4000,
      });
    } else {
      try {
        const arr = JSON.stringify([
          3,
          103,
          settings.CPTypeIndex,
          104,
          Number(settings.CPSensorMax),
          105,
          Number(settings.CPSensorMin),
          118,
          Number(settings.CPVoltageMax * 10),
          119,
          Number(settings.CPVoltageMin * 10),
        ]);
        const buffer = Buffer.from(arr + "\n", "utf-8");
        props.connectedDevice?.writeCharacteristicWithResponseForService(
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
        fetchDataSettings();
      } catch (error) {
        console.log(
          "Error with writeCharacteristicWithResponseForService :",
          error
        );
      }
    }
  };

  // send array of TP values to device
  const handleSendTP = async () => {
    if (
      settings.TPSensorMax === "" ||
      settings.TPSensorMin === "" ||
      settings.TPVoltageMax === "" ||
      settings.TPVoltageMin === ""
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "All fields (TP sensor and TP Voltage) must be filled",
        visibilityTime: 3000,
      });
      return; // Exit the function if validation fails
    } else if (Number(settings.TPSensorMin) > Number(settings.TPSensorMax)) {
      Toast.show({
        type: "error",
        text1: "Warning",
        text2: "The TP Sensor max must be more than TP Sensor min",
        visibilityTime: 4000,
      });
    } else if (Number(settings.TPVoltageMin) > Number(settings.TPVoltageMax)) {
      Toast.show({
        type: "error",
        text1: "Warning",
        text2: "The TP Voltage max must be more than TP Voltage min",
        visibilityTime: 4000,
      });
    } else {
      try {
        const arr = JSON.stringify([
          3,
          106,
          settings.TPTypeIndex,
          107,
          Number(settings.TPSensorMax),
          108,
          Number(settings.TPSensorMin),
          120,
          Number(settings.TPVoltageMax * 10),
          121,
          Number(settings.TPVoltageMin * 10),
        ]);
        const buffer = Buffer.from(arr + "\n", "utf-8");
        props.connectedDevice?.writeCharacteristicWithResponseForService(
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
        fetchDataSettings();
      } catch (error) {
        console.log(
          "Error with writeCharacteristicWithResponseForService :",
          error
        );
      }
    }
  };

  // function called in useEffect when load component to fetch data
  const fetchDataSettings = async () => {
    try {
      await Receive.SettingsReceivedData(
        props.connectedDevice,
        dispatchSettings, // Replace all individual setters with just this
        setLoading,
        setTitle
      );
    } catch (error) {
      console.error("Error in receiving data in settings page:", error);
    }
  };

  // Initial load, call fetchData function with the corresponding data
  useEffect(() => {
    // fetcha data if the device is connected
    if (props.connectedDevice) {
      const cleanup = fetchDataSettings();
      return () => cleanup; // Clean up subscription on component unmount or when device changes
    }
  }, [props.connectedDevice]);

  // function run when clicking on refresh button
  const onRefreshSettings = async () => {
    try {
      // call function to send request to device to get data
      await Receive.sendReqToGetData(props.connectedDevice, 2);
      // start receiving data
      await Receive.SettingsReceivedData(
        props.connectedDevice,
        dispatchSettings, // Replace all individual setters with just this
        setLoading,
        setTitle
      );
    } catch (error) {
      console.error("Error during refresh:", error);
    }
  };

  // all settings sections by bloc
  // production method
  const card1 = (
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
          onChangeText={handleChangeMissrunMax}
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>Detect false arrivals :</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={falseArrivals_hiLoMode}
          selectedIndex={settings.falseArrivalsIndex}
          setSelectedIndex={(index) =>
            dispatchSettings({ falseArrivalsIndex: index })
          }
        />
        <Text style={styles.titleSettings(width)}>Well depth :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.wellDepth?.toString() || ""}
          onChangeText={handleChangeWellDepth}
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
  // PID
  const card3 = (
    <View style={styles.settingsSection(width)} key="card3">
      <View style={styles.inputContainer}>
        <Text style={styles.titleSettings(width)}>PID Override :</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={falseArrivals_hiLoMode}
          selectedIndex={settings.pidOverrideIndex}
          setSelectedIndex={(index) =>
            dispatchSettings({ pidOverrideIndex: index })
          }
        />
        <Text style={styles.titleSettings(width)}>PID Set Point (SP) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.pidSP?.toString() || ""}
          onChangeText={handleChangePidSP}
          keyboardType="numeric"
        />
        <View style={styles.pidInputsContainer}>
          <View style={styles.pidInputs}>
            <Text style={styles.titleSettings(width)}>Kp (%) :</Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={settings.pidKP?.toString() || ""}
              onChangeText={handleChangePidKP}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.pidInputs}>
            <Text style={styles.titleSettings(width)}>Ki (%) :</Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={settings.pidKI?.toString() || ""}
              onChangeText={handleChangePidKI}
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={styles.pidInputsContainer}>
          <View style={styles.pidInputs}>
            <Text style={styles.titleSettings(width)}>Kd (%) :</Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={settings.pidKD?.toString() || ""}
              onChangeText={handleChangePidKD}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.pidInputs}>
            <Text style={styles.titleSettings(width)}>INIT (%) :</Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={settings.pidINIT?.toString() || ""}
              onChangeText={handleChangePidINIT}
              keyboardType="numeric"
            />
          </View>
        </View>
        <Text style={styles.titleSettings(width)}>PID Deadband (PSI) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.pidDB?.toString() || ""}
          onChangeText={handleChangePidDB}
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>PID Low Limit (PSI) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.pidLL?.toString() || ""}
          onChangeText={handleChangePidLL}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.containerBtnText}>
        <ButtonUI
          onPress={() => handleSendPID()}
          title={"Send"}
          btnStyle={styles.btnSendText(width)}
          txtStyle={styles.TextSendStyle(width)}
        />
      </View>
    </View>
  );
  // LP
  const card6 = (
    <View style={styles.settingsSection(width)} key="card6">
      <View style={styles.inputContainer}>
        <Text style={styles.titleSettings(width)}>LP Sensor type :</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={LP_CP_TP_type}
          selectedIndex={settings.LPTypeIndex}
          setSelectedIndex={(index) => dispatchSettings({ LPTypeIndex: index })}
        />
        <Text style={styles.titleSettings(width)}>LP Sensor max (PSI) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.LPSensorMax?.toString() || ""}
          onChangeText={handleChangeLPSensorMax}
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>LP Sensor min (PSI) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.LPSensorMin?.toString() || ""}
          onChangeText={handleChangeLPSensorMin}
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>LP voltage max (V) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.LPVoltageMax?.toString() || ""}
          onChangeText={handleChangeLPVoltageMax}
          keyboardType="numbers-and-punctuation"
        />
        <Text style={styles.titleSettings(width)}>LP voltage min (V) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.LPVoltageMin?.toString() || ""}
          onChangeText={handleChangeLPVoltageMin}
          keyboardType="numbers-and-punctuation"
        />
      </View>
      <View style={styles.containerBtnText}>
        <ButtonUI
          onPress={() => handleSendLP()}
          title={"Send"}
          btnStyle={styles.btnSendText(width)}
          txtStyle={styles.TextSendStyle(width)}
        />
      </View>
    </View>
  );
  // CP
  const card7 = (
    <View style={styles.settingsSection(width)} key={"card7"}>
      <View style={styles.inputContainer}>
        <Text style={styles.titleSettings(width)}>CP Sensor type :</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={LP_CP_TP_type}
          selectedIndex={settings.CPTypeIndex}
          setSelectedIndex={(index) => dispatchSettings({ CPTypeIndex: index })}
        />
        <Text style={styles.titleSettings(width)}>CP Sensor max (PSI) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.CPSensorMax?.toString() || ""}
          onChangeText={handleChangeCPSensorMax}
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>CP Sensor min (PSI) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.CPSensorMin?.toString() || ""}
          onChangeText={handleChangeCPSensorMin}
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>CP voltage max (V) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.CPVoltageMax?.toString() || ""}
          onChangeText={handleChangeCPVoltageMax}
          keyboardType="numbers-and-punctuation"
        />
        <Text style={styles.titleSettings(width)}>CP voltage min (V) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.CPVoltageMin?.toString() || ""}
          onChangeText={handleChangeCPVoltageMin}
          keyboardType="numbers-and-punctuation"
        />
      </View>
      <View style={styles.containerBtnText}>
        <ButtonUI
          onPress={() => handleSendCP()}
          title={"Send"}
          btnStyle={styles.btnSendText(width)}
          txtStyle={styles.TextSendStyle(width)}
        />
      </View>
    </View>
  );
  // TP
  const card8 = (
    <View style={styles.settingsSection(width)} key={"card8"}>
      <View style={styles.inputContainer}>
        <Text style={styles.titleSettings(width)}>TP Sensor type :</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={LP_CP_TP_type}
          selectedIndex={settings.TPTypeIndex}
          setSelectedIndex={(index) => dispatchSettings({ TPTypeIndex: index })}
        />
        <Text style={styles.titleSettings(width)}>TP Sensor max (PSI) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.TPSensorMax?.toString() || ""}
          onChangeText={handleChangeTPSensorMax}
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>TP Sensor min (PSI) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.TPSensorMin?.toString() || ""}
          onChangeText={handleChangeTPSensorMin}
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>TP voltage max (V) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.TPVoltageMax?.toString() || ""}
          onChangeText={handleChangeTPVoltageMax}
          keyboardType="numbers-and-punctuation"
        />
        <Text style={styles.titleSettings(width)}>TP voltage min (V) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.TPVoltageMin?.toString() || ""}
          onChangeText={handleChangeTPVoltageMin}
          keyboardType="numbers-and-punctuation"
        />
      </View>
      <View style={styles.containerBtnText}>
        <ButtonUI
          onPress={() => handleSendTP()}
          title={"Send"}
          btnStyle={styles.btnSendText(width)}
          txtStyle={styles.TextSendStyle(width)}
        />
      </View>
    </View>
  );
  // HILO
  const card2 = (
    <View style={styles.settingsSection(width)} key={"card2"}>
      <View style={styles.inputContainer}>
        <Text style={styles.titleSettings(width)}>HiLo mode :</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={falseArrivals_hiLoMode}
          selectedIndex={settings.hiLoModeIndex}
          setSelectedIndex={(index) =>
            dispatchSettings({ hiLoModeIndex: index })
          }
        />
        <Text style={styles.titleSettings(width)}>HiLo high Threshold :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.hiLoHigh?.toString() || ""}
          onChangeText={handleChangeHiLoHigh}
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>HiLo low Threshold :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.hiLoLow?.toString() || ""}
          onChangeText={handleChangeHiLoLow}
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>HiLo Delay :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.hiLoDelay?.toString() || ""}
          onChangeText={handleChangeHiLoDelay}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.containerBtnText}>
        <ButtonUI
          onPress={() => handleSendHiLo()}
          title={"Send"}
          btnStyle={styles.btnSendText(width)}
          txtStyle={styles.TextSendStyle(width)}
        />
      </View>
    </View>
  );
  // AUTOCATCHER
  const card4 = (
    <View style={styles.settingsSection(width)} key={"card4"}>
      <View style={styles.inputContainer}>
        <Text style={styles.titleSettings(width)}>AUTOCATCHER :</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={falseArrivals_hiLoMode}
          selectedIndex={settings.autocatcherIndex}
          setSelectedIndex={(index) =>
            dispatchSettings({ autocatcherIndex: index })
          }
        />
        <Text style={styles.titleSettings(width)}>Delay (sec) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.autocatcherDelay?.toString() || ""}
          onChangeText={handleChangeAutocatcherDelay}
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>B Valve Twin :</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={falseArrivals_hiLoMode}
          selectedIndex={settings.BValveTwinIndex}
          setSelectedIndex={(index) =>
            dispatchSettings({ BValveTwinIndex: index })
          }
        />
      </View>
      <View style={styles.containerBtnText}>
        <ButtonUI
          onPress={() => handleSendAutocatcher()}
          title={"Send"}
          btnStyle={styles.btnSendText(width)}
          txtStyle={styles.TextSendStyle(width)}
        />
      </View>
    </View>
  );
  // PRESURE INTERMIT
  const card5 = (
    <View style={styles.settingsSection(width)} key={"card5"}>
      <View style={styles.inputContainer}>
        <Text style={styles.titleSettings(width)}>
          Pressure intermit source :
        </Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={["Line", "Tubing", "Casing"]}
          selectedIndex={settings.receivedPressureSourceIndex}
          setSelectedIndex={(index) =>
            dispatchSettings({ receivedPressureSourceIndex: index })
          }
        />
        <Text style={styles.titleSettings(width)}>
          Pressure intermit Max PSI :
        </Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.receivedPressureMaxPSI?.toString() || ""}
          onChangeText={handleChangeMaxPSI}
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>
          Pressure intermit Min PSI :
        </Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={settings.receivedPressureMinPSI?.toString() || ""}
          onChangeText={handleChangeMinPSI}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.containerBtnText}>
        <ButtonUI
          onPress={() => handleSendPressureIntermit()}
          title={"Send"}
          btnStyle={styles.btnSendText(width)}
          txtStyle={styles.TextSendStyle(width)}
        />
      </View>
    </View>
  );

  // render all columns based in width
  const renderColumns = () => {
    if (numColumns === 1) {
      return (
        <View style={styless.column}>
          {card1}
          {card2}
          {card3}
          {card4}
          {card5}
          {card6}
          {card7}
          {card8}
        </View>
      );
    } else if (numColumns === 2) {
      return (
        <>
          <View style={styless.column}>
            {card1}
            {card3}
            {card5}
            {card7}
          </View>
          <View style={styless.column}>
            {card2}
            {card4}
            {card6}
            {card8}
          </View>
        </>
      );
    } else if (numColumns === 3) {
      return (
        <>
          <View style={styless.column}>
            {card1}
            {card4}
            {card7}
          </View>
          <View style={styless.column}>
            {card2}
            {card5}
            {card8}
          </View>
          <View style={styless.column}>
            {card3}
            {card6}
          </View>
        </>
      );
    } else {
      // For 4 or more columns, assign each card to its own column if possible.
      return (
        <>
          <View style={styless.column}>{card1}</View>
          <View style={styless.column}>{card2}</View>
          <View style={styless.column}>{card3}</View>
          <View style={styless.column}>{card4}</View>
          <View style={styless.column}>{card5}</View>
          <View style={styless.column}>{card6}</View>
          <View style={styless.column}>{card7}</View>
          <View style={styless.column}>{card8}</View>
        </>
      );
    }
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={135} // Space above the keyboard
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      enableResetScrollToCoords={false}
      enableOnAndroid={true}
      contentContainerStyle={{ flexGrow: 1 }}
      extraHeight={100}
      enableAutomaticScroll={true}
    >
      <RefreshBtn onPress={() => onRefreshSettings()} />
      <View style={styles.valveContainer}>
        <View
          style={{
            flex: 1,
          }}
        >
          <Valve
            connectedDevice={props.connectedDevice}
            fetchDataSettings={fetchDataSettings}
            title={"Valve A"}
            status={settings.valveA === 1 ? true : false}
            valve={"A"}
          />
        </View>
        <View
          style={{
            flex: 1,
          }}
        >
          <Valve
            connectedDevice={props.connectedDevice}
            fetchDataSettings={fetchDataSettings}
            title={"Valve B"}
            status={settings.valveB === 1 ? true : false}
            valve={"B"}
          />
        </View>
      </View>

      <View style={[styles.settingsWrapper, styles.marginBottomContainer]}>
        <Text style={styles.valveTitle}>Controller configuration</Text>
        <View style={styles.settingsSectionContainer(width)}>
          <View style={styless.masonryContainer}>{renderColumns()}</View>
        </View>
      </View>
      <Loading loading={loading} title={title} />
    </KeyboardAwareScrollView>
  );
};

const styless = StyleSheet.create({
  masonryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default SettingsTab2;
