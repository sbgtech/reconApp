import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  useWindowDimensions,
  Dimensions,
  StyleSheet,
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

const SettingsTab = (props) => {
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
  // value of valve A, default 0 (OFF)
  const [valveA, setValveA] = useState(0);
  // value of valve B, default 0 (OFF)
  const [valveB, setValveB] = useState(0);
  // display the name of the productionMethod based on the received index
  const [productionMethodIndex, setProductionMethodIndex] = useState(null);
  const productionMethod = [
    "Timer mode",
    "Timer Intermit mode",
    "Pressure Intermit mode",
  ];
  // prepare variables to set them the received data
  const [missrunMax, setMissrunMax] = useState("");
  const [falseArrivalsIndex, setFalseArrivalsIndex] = useState(null);
  const falseArrivals_hiLoMode = ["Disable", "Enable"];
  const [wellDepth, setWellDepth] = useState("");
  // states of HiLo mode
  const [hiLoModeIndex, setHiLoModeIndex] = useState(null);
  const [hiLoHigh, setHiLoHigh] = useState("");
  const [hiLoLow, setHiLoLow] = useState("");
  const [hiLoDelay, setHiLoDelay] = useState("");
  // states of PID
  const [pidOverrideIndex, setPidOverrideIndex] = useState(null);
  const [pidSP, setPidSP] = useState("");
  const [pidKP, setPidKP] = useState("");
  const [pidKI, setPidKI] = useState("");
  const [pidKD, setPidKD] = useState("");
  const [pidINIT, setPidINIT] = useState("");
  const [pidDB, setPidDB] = useState("");
  const [pidLL, setPidLL] = useState("");
  // states of AUTOCATCHER
  const [autocatcherIndex, setAutocatcherIndex] = useState(null);
  const [autocatcherDelay, setAutocatcherDelay] = useState("");
  const [BValveTwinIndex, setBValveTwinIndex] = useState(null);
  // declare initial states for the source, max pis and min psi for pressure intermit mode
  const [receivedPressureSourceIndex, setReceivedPressureSourceIndex] =
    useState(null);
  const [receivedPressureMaxPSI, setReceivedPressureMaxPSI] = useState("");
  const [receivedPressureMinPSI, setReceivedPressureMinPSI] = useState("");
  // states of LP
  const LP_CP_TP_type = ["Voltage"];
  const [LPTypeIndex, setLPTypeIndex] = useState(null);
  const [LPSensorMax, setLPSensorMax] = useState("");
  const [LPSensorMin, setLPSensorMin] = useState("");
  const [LPVoltageMax, setLPVoltageMax] = useState("");
  const [LPVoltageMin, setLPVoltageMin] = useState("");
  // states of CP
  const [CPTypeIndex, setCPTypeIndex] = useState(null);
  const [CPSensorMax, setCPSensorMax] = useState("");
  const [CPSensorMin, setCPSensorMin] = useState("");
  const [CPVoltageMax, setCPVoltageMax] = useState("");
  const [CPVoltageMin, setCPVoltageMin] = useState("");
  // states of TP
  const [TPTypeIndex, setTPTypeIndex] = useState(null);
  const [TPSensorMax, setTPSensorMax] = useState("");
  const [TPSensorMin, setTPSensorMin] = useState("");
  const [TPVoltageMax, setTPVoltageMax] = useState("");
  const [TPVoltageMin, setTPVoltageMin] = useState("");

  // handle change missrunMax value
  const handleChangeMissrunMax = (text) => {
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
        setMissrunMax("");
      } else {
        setMissrunMax(validText);
      }
    } else {
      setMissrunMax("");
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
        setWellDepth("");
      } else {
        setWellDepth(validText);
      }
    } else {
      setWellDepth("");
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
        setHiLoHigh("");
      } else {
        setHiLoHigh(validText);
      }
    } else {
      setHiLoHigh("");
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
        setHiLoLow("");
      } else {
        setHiLoLow(validText);
      }
    } else {
      setHiLoLow("");
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
        setHiLoDelay("");
      } else {
        setHiLoDelay(validText);
      }
    } else {
      setHiLoDelay("");
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
        setPidSP("");
      } else {
        setPidSP(validText);
      }
    } else {
      setPidSP("");
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
        setPidKP("");
      } else {
        setPidKP(validText);
      }
    } else {
      setPidKP("");
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
        setPidKI("");
      } else {
        setPidKI(validText);
      }
    } else {
      setPidKI("");
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
        setPidKD("");
      } else {
        setPidKD(validText);
      }
    } else {
      setPidKD("");
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
        setPidINIT("");
      } else {
        setPidINIT(validText);
      }
    } else {
      setPidINIT("");
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
        setPidDB("");
      } else {
        setPidDB(validText);
      }
    } else {
      setPidDB("");
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
        setPidLL("");
      } else {
        setPidLL(validText);
      }
    } else {
      setPidLL("");
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
        setAutocatcherDelay("");
      } else {
        setAutocatcherDelay(validText);
      }
    } else {
      setAutocatcherDelay("");
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
        setReceivedPressureMaxPSI("");
      } else {
        setReceivedPressureMaxPSI(validText);
      }
    } else {
      setReceivedPressureMaxPSI("");
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
        setReceivedPressureMinPSI("");
      } else {
        setReceivedPressureMinPSI(validText);
      }
    } else {
      setReceivedPressureMinPSI("");
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
        setLPSensorMax("");
      } else {
        setLPSensorMax(validText);
      }
    } else {
      setLPSensorMax("");
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
        setLPSensorMin("");
      } else {
        setLPSensorMin(validText);
      }
    } else {
      setLPSensorMin("");
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
          setLPVoltageMax(""); // Clear or reset the value
        } else {
          setLPVoltageMax(validText);
        }
      } else {
        setLPVoltageMax(""); // Clear or reset the value
      }
    } else {
      setLPVoltageMax(""); // Handle empty input case
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
          setLPVoltageMin(""); // Clear or reset the value
        } else {
          setLPVoltageMin(validText);
        }
      } else {
        setLPVoltageMin(""); // Clear or reset the value
      }
    } else {
      setLPVoltageMin(""); // Handle empty input case
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
        setCPSensorMax("");
      } else {
        setCPSensorMax(validText);
      }
    } else {
      setCPSensorMax("");
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
        setCPSensorMin("");
      } else {
        setCPSensorMin(validText);
      }
    } else {
      setCPSensorMin("");
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
          setCPVoltageMax(""); // Clear or reset the value
        } else {
          setCPVoltageMax(validText);
        }
      } else {
        setCPVoltageMax(""); // Clear or reset the value
      }
    } else {
      setCPVoltageMax(""); // Handle empty input case
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
          setCPVoltageMin(""); // Clear or reset the value
        } else {
          setCPVoltageMin(validText);
        }
      } else {
        setCPVoltageMin(""); // Clear or reset the value
      }
    } else {
      setCPVoltageMin(""); // Handle empty input case
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
        setTPSensorMax("");
      } else {
        setTPSensorMax(validText);
      }
    } else {
      setTPSensorMax("");
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
        setTPSensorMin("");
      } else {
        setTPSensorMin(validText);
      }
    } else {
      setTPSensorMin("");
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
          setTPVoltageMax(""); // Clear or reset the value
        } else {
          setTPVoltageMax(validText);
        }
      } else {
        setTPVoltageMax(""); // Clear or reset the value
      }
    } else {
      setTPVoltageMax(""); // Handle empty input case
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
          setTPVoltageMin(""); // Clear or reset the value
        } else {
          setTPVoltageMin(validText);
        }
      } else {
        setTPVoltageMin(""); // Clear or reset the value
      }
    } else {
      setTPVoltageMin(""); // Handle empty input case
    }
  };

  // send array of prod method, missrun max, false arrivals and well depth values to device with their addresses
  const handleSendFirstBloc = async () => {
    if (missrunMax === "" || wellDepth === "") {
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
        productionMethodIndex,
        109,
        Number(missrunMax),
        110,
        falseArrivalsIndex,
        125,
        Number(wellDepth),
      ]);
      console.log("index is ", productionMethodIndex);
      const buffer = Buffer.from(arr + "\n", "utf-8");
      await props.connectedDevice?.writeCharacteristicWithResponseForService(
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
      await fetchDataSettings();
    } catch (error) {
      console.log(
        "Error with writeCharacteristicWithResponseForService :",
        error
      );
    }
  };

  // send array of HiLo values to device
  const handleSendHiLo = async () => {
    if (hiLoHigh === "" || hiLoLow === "" || hiLoDelay === "") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "All fields (HiLo high, HiLo low and HiLo Delay) must be filled",
        visibilityTime: 4000,
      });
      return; // Exit the function if validation fails
    } else if (Number(hiLoLow) > Number(hiLoHigh)) {
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
          hiLoModeIndex,
          123,
          Number(hiLoHigh),
          124,
          Number(hiLoLow),
          155,
          Number(hiLoDelay),
        ]);
        const buffer = Buffer.from(arr + "\n", "utf-8");
        await props.connectedDevice?.writeCharacteristicWithResponseForService(
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
        await fetchDataSettings();
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
      pidSP === "" ||
      pidKP === "" ||
      pidKI === "" ||
      pidKD === "" ||
      pidINIT === "" ||
      pidDB === "" ||
      pidLL === ""
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
          pidOverrideIndex,
          134,
          Number(pidSP),
          135,
          Number(pidKP),
          136,
          Number(pidKI),
          137,
          Number(pidKD),
          138,
          Number(pidINIT),
          139,
          Number(pidDB),
          140,
          Number(pidLL),
        ]);
        const buffer = Buffer.from(arr + "\n", "utf-8");
        await props.connectedDevice?.writeCharacteristicWithResponseForService(
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
        await fetchDataSettings();
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
    if (autocatcherDelay === "") {
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
          autocatcherIndex,
          143,
          Number(autocatcherDelay),
          158,
          BValveTwinIndex,
        ]);
        const buffer = Buffer.from(arr + "\n", "utf-8");
        await props.connectedDevice?.writeCharacteristicWithResponseForService(
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
        await fetchDataSettings();
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
    if (receivedPressureMaxPSI === "" || receivedPressureMinPSI === "") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Max PSI & Min PSI must be filled",
        visibilityTime: 3000,
      });
      return; // Exit the function if validation fails
    } else if (
      Number(receivedPressureMinPSI) > Number(receivedPressureMaxPSI)
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
          receivedPressureSourceIndex,
          160,
          Number(receivedPressureMaxPSI),
          161,
          Number(receivedPressureMinPSI),
        ]);
        const buffer = Buffer.from(arr + "\n", "utf-8");
        await props.connectedDevice?.writeCharacteristicWithResponseForService(
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
        await fetchDataSettings();
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
      LPSensorMax === "" ||
      LPSensorMin === "" ||
      LPVoltageMax === "" ||
      LPVoltageMin === ""
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "All fields (LP sensor and LP Voltage) must be filled",
        visibilityTime: 4000,
      });
      return; // Exit the function if validation fails
    } else if (Number(LPSensorMin) > Number(LPSensorMax)) {
      Toast.show({
        type: "error",
        text1: "Warning",
        text2: "The LP Sensor max must be more than LP Sensor min",
        visibilityTime: 4000,
      });
    } else if (Number(LPVoltageMin) > Number(LPVoltageMax)) {
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
          LPTypeIndex,
          101,
          Number(LPSensorMax),
          102,
          Number(LPSensorMin),
          116,
          Number(LPVoltageMax * 10),
          117,
          Number(LPVoltageMin * 10),
        ]);
        const buffer = Buffer.from(arr + "\n", "utf-8");
        await props.connectedDevice?.writeCharacteristicWithResponseForService(
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
        await fetchDataSettings();
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
      CPSensorMax === "" ||
      CPSensorMin === "" ||
      CPVoltageMax === "" ||
      CPVoltageMin === ""
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "All fields (CP sensor and CP Voltage) must be filled",
        visibilityTime: 3000,
      });
      return; // Exit the function if validation fails
    } else if (Number(CPSensorMin) > Number(CPSensorMax)) {
      Toast.show({
        type: "error",
        text1: "Warning",
        text2: "The CP Sensor max must be more than CP Sensor min",
        visibilityTime: 4000,
      });
    } else if (Number(CPVoltageMin) > Number(CPVoltageMax)) {
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
          CPTypeIndex,
          104,
          Number(CPSensorMax),
          105,
          Number(CPSensorMin),
          118,
          Number(CPVoltageMax * 10),
          119,
          Number(CPVoltageMin * 10),
        ]);
        const buffer = Buffer.from(arr + "\n", "utf-8");
        await props.connectedDevice?.writeCharacteristicWithResponseForService(
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
        await fetchDataSettings();
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
      TPSensorMax === "" ||
      TPSensorMin === "" ||
      TPVoltageMax === "" ||
      TPVoltageMin === ""
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "All fields (TP sensor and TP Voltage) must be filled",
        visibilityTime: 3000,
      });
      return; // Exit the function if validation fails
    } else if (Number(TPSensorMin) > Number(TPSensorMax)) {
      Toast.show({
        type: "error",
        text1: "Warning",
        text2: "The TP Sensor max must be more than TP Sensor min",
        visibilityTime: 4000,
      });
    } else if (Number(TPVoltageMin) > Number(TPVoltageMax)) {
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
          TPTypeIndex,
          107,
          Number(TPSensorMax),
          108,
          Number(TPSensorMin),
          120,
          Number(TPVoltageMax * 10),
          121,
          Number(TPVoltageMin * 10),
        ]);
        const buffer = Buffer.from(arr + "\n", "utf-8");
        await props.connectedDevice?.writeCharacteristicWithResponseForService(
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
        await fetchDataSettings();
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
      await Receive.SettingsReceivedData(props.connectedDevice, {
        setValveA,
        setValveB,
        setProductionMethodIndex,
        setMissrunMax,
        setFalseArrivalsIndex,
        setWellDepth,
        setHiLoModeIndex,
        setHiLoHigh,
        setHiLoLow,
        setHiLoDelay,
        setPidOverrideIndex,
        setPidSP,
        setPidKP,
        setPidKI,
        setPidKD,
        setPidINIT,
        setPidDB,
        setPidLL,
        setAutocatcherIndex,
        setAutocatcherDelay,
        setBValveTwinIndex,
        setReceivedPressureSourceIndex,
        setReceivedPressureMaxPSI,
        setReceivedPressureMinPSI,
        setLPTypeIndex,
        setLPSensorMax,
        setLPSensorMin,
        setLPVoltageMax,
        setLPVoltageMin,
        setCPTypeIndex,
        setCPSensorMax,
        setCPSensorMin,
        setCPVoltageMax,
        setCPVoltageMin,
        setTPTypeIndex,
        setTPSensorMax,
        setTPSensorMin,
        setTPVoltageMax,
        setTPVoltageMin,
        setLoading,
        setTitle,
      });
    } catch (error) {
      console.error("Error in receiving data:", error);
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
      Receive.sendReqToGetData(props.connectedDevice, 2);
      // start receiving data
      await Receive.SettingsReceivedData(props.connectedDevice, {
        setValveA,
        setValveB,
        setProductionMethodIndex,
        setMissrunMax,
        setFalseArrivalsIndex,
        setWellDepth,
        setHiLoModeIndex,
        setHiLoHigh,
        setHiLoLow,
        setHiLoDelay,
        setPidOverrideIndex,
        setPidSP,
        setPidKP,
        setPidKI,
        setPidKD,
        setPidINIT,
        setPidDB,
        setPidLL,
        setAutocatcherIndex,
        setAutocatcherDelay,
        setBValveTwinIndex,
        setReceivedPressureSourceIndex,
        setReceivedPressureMaxPSI,
        setReceivedPressureMinPSI,
        setLPTypeIndex,
        setLPSensorMax,
        setLPSensorMin,
        setLPVoltageMax,
        setLPVoltageMin,
        setCPTypeIndex,
        setCPSensorMax,
        setCPSensorMin,
        setCPVoltageMax,
        setCPVoltageMin,
        setTPTypeIndex,
        setTPSensorMax,
        setTPSensorMin,
        setTPVoltageMax,
        setTPVoltageMin,
        setLoading,
        setTitle,
      });
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
          selectedIndex={productionMethodIndex}
          setSelectedIndex={setProductionMethodIndex}
        />
        <Text style={styles.titleSettings(width)}>Missrun max :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={missrunMax.toString()}
          onChangeText={handleChangeMissrunMax}
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>Detect false arrivals :</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={falseArrivals_hiLoMode}
          selectedIndex={falseArrivalsIndex}
          setSelectedIndex={setFalseArrivalsIndex}
        />
        <Text style={styles.titleSettings(width)}>Well depth :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={wellDepth.toString()}
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
          selectedIndex={pidOverrideIndex}
          setSelectedIndex={setPidOverrideIndex}
        />
        <Text style={styles.titleSettings(width)}>PID Set Point (SP) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={pidSP.toString()}
          onChangeText={handleChangePidSP}
          keyboardType="numeric"
        />
        <View style={styles.pidInputsContainer}>
          <View style={styles.pidInputs}>
            <Text style={styles.titleSettings(width)}>Kp (%) :</Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={pidKP.toString()}
              onChangeText={handleChangePidKP}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.pidInputs}>
            <Text style={styles.titleSettings(width)}>Ki (%) :</Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={pidKI.toString()}
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
              value={pidKD.toString()}
              onChangeText={handleChangePidKD}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.pidInputs}>
            <Text style={styles.titleSettings(width)}>INIT (%) :</Text>
            <TextInput
              style={styles.inputSettings(width)}
              value={pidINIT.toString()}
              onChangeText={handleChangePidINIT}
              keyboardType="numeric"
            />
          </View>
        </View>
        <Text style={styles.titleSettings(width)}>PID Deadband (PSI) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={pidDB.toString()}
          onChangeText={handleChangePidDB}
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>PID Low Limit (PSI) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={pidLL.toString()}
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
          selectedIndex={LPTypeIndex}
          setSelectedIndex={setLPTypeIndex}
        />
        <Text style={styles.titleSettings(width)}>LP Sensor max (PSI) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={LPSensorMax.toString()}
          onChangeText={handleChangeLPSensorMax}
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>LP Sensor min (PSI) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={LPSensorMin.toString()}
          onChangeText={handleChangeLPSensorMin}
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>LP voltage max (V) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={LPVoltageMax.toString()}
          onChangeText={handleChangeLPVoltageMax}
          keyboardType="numbers-and-punctuation"
        />
        <Text style={styles.titleSettings(width)}>LP voltage min (V) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={LPVoltageMin.toString()}
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
          selectedIndex={CPTypeIndex}
          setSelectedIndex={setCPTypeIndex}
        />
        <Text style={styles.titleSettings(width)}>CP Sensor max (PSI) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={CPSensorMax.toString()}
          onChangeText={handleChangeCPSensorMax}
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>CP Sensor min (PSI) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={CPSensorMin.toString()}
          onChangeText={handleChangeCPSensorMin}
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>CP voltage max (V) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={CPVoltageMax.toString()}
          onChangeText={handleChangeCPVoltageMax}
          keyboardType="numbers-and-punctuation"
        />
        <Text style={styles.titleSettings(width)}>CP voltage min (V) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={CPVoltageMin.toString()}
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
          selectedIndex={TPTypeIndex}
          setSelectedIndex={setTPTypeIndex}
        />
        <Text style={styles.titleSettings(width)}>TP Sensor max (PSI) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={TPSensorMax.toString()}
          onChangeText={handleChangeTPSensorMax}
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>TP Sensor min (PSI) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={TPSensorMin.toString()}
          onChangeText={handleChangeTPSensorMin}
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>TP voltage max (V) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={TPVoltageMax.toString()}
          onChangeText={handleChangeTPVoltageMax}
          keyboardType="numbers-and-punctuation"
        />
        <Text style={styles.titleSettings(width)}>TP voltage min (V) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={TPVoltageMin.toString()}
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
          selectedIndex={hiLoModeIndex}
          setSelectedIndex={setHiLoModeIndex}
        />
        <Text style={styles.titleSettings(width)}>HiLo high Threshold :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={hiLoHigh.toString()}
          onChangeText={handleChangeHiLoHigh}
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>HiLo low Threshold :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={hiLoLow.toString()}
          onChangeText={handleChangeHiLoLow}
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>HiLo Delay :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={hiLoDelay.toString()}
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
          selectedIndex={autocatcherIndex}
          setSelectedIndex={setAutocatcherIndex}
        />
        <Text style={styles.titleSettings(width)}>Delay (sec) :</Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={autocatcherDelay.toString()}
          onChangeText={handleChangeAutocatcherDelay}
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>B Valve Twin :</Text>
        <Dropdown
          dropdownTitle={"Select option"}
          list={falseArrivals_hiLoMode}
          selectedIndex={BValveTwinIndex}
          setSelectedIndex={setBValveTwinIndex}
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
          selectedIndex={receivedPressureSourceIndex}
          setSelectedIndex={setReceivedPressureSourceIndex}
        />
        <Text style={styles.titleSettings(width)}>
          Pressure intermit Max PSI :
        </Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={receivedPressureMaxPSI.toString()}
          onChangeText={handleChangeMaxPSI}
          keyboardType="numeric"
        />
        <Text style={styles.titleSettings(width)}>
          Pressure intermit Min PSI :
        </Text>
        <TextInput
          style={styles.inputSettings(width)}
          value={receivedPressureMinPSI.toString()}
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
      extraScrollHeight={height * 0.2} // Space above the keyboard
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      enableResetScrollToCoords={false}
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
            status={valveA === 1 ? true : false}
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
            status={valveB === 1 ? true : false}
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

export default SettingsTab;
