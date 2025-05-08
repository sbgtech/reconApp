import React, { useEffect, useReducer, useState } from "react";
import { View, useWindowDimensions } from "react-native";
import Timer from "./blocs/Timer";
import { styles } from "./style/styles";
import { Receive } from "../Utils/Receive";
import RefreshBtn from "./blocs/RefreshBtn";
import Loading from "./blocs/Loading";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const TimerTab = (props) => {
  const { width } = useWindowDimensions();
  // the loading state, default is false
  const [loading, setLoading] = useState(false);
  // title of loading modal
  const [title, setTitle] = useState("");

  const initialTimersState = {
    receivedOpenTimer: "",
    receivedShutinTimer: "",
    receivedAfterflowTimer: "",
    receivedMandatoryTimer: "",
  };

  const timersReducer = (state, action) => ({
    ...state,
    ...action, // Merge new values
  });

  const [timers, dispatchTimers] = useReducer(
    timersReducer,
    initialTimersState
  );

  const fetchDataTimer = async () => {
    try {
      await Receive.TimerReceivedData(
        props.connectedDevice,
        dispatchTimers,
        setLoading,
        setTitle
      );
    } catch (error) {
      console.error("Error in receiving data in timer page:", error);
    }
  };

  // Initial load, call TimerReceivedData function with the corresponding data of timers
  useEffect(() => {
    // fetcha data if the device is connected
    if (props.connectedDevice) {
      const cleanup = fetchDataTimer();
      return () => cleanup; // Clean up subscription on component unmount or when device changes
    }
  }, [props.connectedDevice]);

  // function run when clicking on refresh button
  const onRefreshTimer = async () => {
    try {
      // call function to send request to device to get data
      await Receive.sendReqToGetData(props.connectedDevice, 1);
      // start receiving data
      await Receive.TimerReceivedData(
        props.connectedDevice,
        dispatchTimers,
        setLoading,
        setTitle
      );
    } catch (error) {
      console.error("Error during refresh:", error);
    }
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={135} // Space above the keyboard
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      enableResetScrollToCoords={false}
    >
      <View style={styles.container}>
        <RefreshBtn onPress={() => onRefreshTimer()} />
        <View style={styles.timersContainer(width)}>
          <Timer
            connectedDevice={props.connectedDevice}
            title={"Open timer"}
            address1={200}
            address2={201}
            totalSec={timers.receivedOpenTimer}
            setTitle={setTitle}
            fetchDataTimer={fetchDataTimer}
          />
          <Timer
            connectedDevice={props.connectedDevice}
            title={"Shutin timer"}
            address1={202}
            address2={203}
            totalSec={timers.receivedShutinTimer}
            setTitle={setTitle}
            fetchDataTimer={fetchDataTimer}
          />
          <Timer
            connectedDevice={props.connectedDevice}
            title={"Afterflow timer"}
            address1={204}
            address2={205}
            totalSec={timers.receivedAfterflowTimer}
            setTitle={setTitle}
            fetchDataTimer={fetchDataTimer}
          />
          <Timer
            connectedDevice={props.connectedDevice}
            title={"Mandatory shutin timer"}
            address1={206}
            address2={207}
            totalSec={timers.receivedMandatoryTimer}
            setTitle={setTitle}
            fetchDataTimer={fetchDataTimer}
          />
        </View>
      </View>
      <Loading loading={loading} title={title} />
    </KeyboardAwareScrollView>
  );
};

export default TimerTab;
