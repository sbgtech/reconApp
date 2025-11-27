import { useEffect } from "react";
import { Text, View, TextInput, useWindowDimensions } from "react-native";
import Toast from "react-native-toast-message";
import { Receive } from "../../../Utils/Receive";
import { styles } from "../../style/styles";

const TriggerTimer = ({
  hourValue,
  setHourValue,
  minValue,
  setMinValue,
  secValue,
  setSecValue,
  totalSec,
}) => {
  const { width } = useWindowDimensions();

  const handleChangeHour = (text) => {
    if (text) {
      setHourValue(text);
    } else {
      setHourValue("");
    }
  };

  const handleChangeMin = (text) => {
    if (text >= 0 && text <= 59) {
      setMinValue(text);
    } else {
      Toast.show({
        type: "error",
        text1: "Warning",
        text2: "Minutes must be entre 01 & 59",
        visibilityTime: 3000,
      });
      setMinValue("");
    }
  };

  const handleChangeSec = (text) => {
    if (text >= 0 && text <= 59) {
      setSecValue(text);
    } else {
      Toast.show({
        type: "error",
        text1: "Warning",
        text2: "Seconds must be entre 01 & 59",
        visibilityTime: 3000,
      });
      setSecValue("");
    }
  };

  const toHMS = (totalSeconds) => {
    const { formattedHours, formattedMinutes, formattedSeconds } =
      Receive.convertTimersToHMS(totalSeconds);
    setHourValue(formattedHours);
    setMinValue(formattedMinutes);
    setSecValue(formattedSeconds);
  };

  useEffect(() => {
    toHMS(totalSec);
  }, [totalSec]);

  return (
    <View style={styles.triggerTimerWrapper}>
      <TextInput
        style={styles.inputTriggerTimer(width)}
        keyboardType="numeric"
        value={hourValue}
        onChangeText={handleChangeHour}
        maxLength={2}
        selectTextOnFocus={true}
      />
      <Text style={styles.dotTriggerTimer}>:</Text>
      <TextInput
        style={styles.inputTriggerTimer(width)}
        keyboardType="numeric"
        value={minValue}
        onChangeText={handleChangeMin}
        maxLength={2}
        selectTextOnFocus={true}
      />
      <Text style={styles.dotTriggerTimer}>:</Text>
      <TextInput
        style={styles.inputTriggerTimer(width)}
        keyboardType="numeric"
        value={secValue}
        onChangeText={handleChangeSec}
        maxLength={2}
        selectTextOnFocus={true}
      />
    </View>
  );
};

export default TriggerTimer;
