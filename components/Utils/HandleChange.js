import Toast from "react-native-toast-message";

export class HandleChange {
  static handleChanges4Digits = (text, fieldName, dispatch) => {
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
        dispatch({ [fieldName]: "" });
      } else {
        dispatch({ [fieldName]: validText });
      }
    } else {
      dispatch({ [fieldName]: "" });
    }
  };

  static handleChanges3Digits = (text, fieldName, dispatch) => {
    if (text) {
      const validText = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      // Ensure the length is 4
      if (validText.length > 3) {
        Toast.show({
          type: "error",
          text1: "Warning",
          text2: "The max value must be 3 digits",
          visibilityTime: 3000,
        });
        dispatch({ [fieldName]: "" });
      } else {
        dispatch({ [fieldName]: validText });
      }
    } else {
      dispatch({ [fieldName]: "" });
    }
  };

  static handleChangesVoltage = (text, fieldName, dispatch) => {
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
          dispatch({ [fieldName]: "" });
        } else {
          dispatch({ [fieldName]: validText });
        }
      } else {
        dispatch({ [fieldName]: "" });
      }
    } else {
      dispatch({ [fieldName]: "" });
    }
  };
}
