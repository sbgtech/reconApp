import React, { useEffect, useReducer, useState } from "react";
import { View, useWindowDimensions } from "react-native";
import Timer from "./blocs/Timer";
import { styles } from "./style/styles";
import { Receive } from "../Utils/Receive";
import RefreshBtn from "./blocs/RefreshBtn";
import Loading from "./blocs/Loading";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useCallback } from "react";

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

  // Fetch timer data
  const fetchDataTimer = async () => {
    try {
      // Clear previous state before fetching fresh data
      dispatchTimers(initialTimersState);

      // Request fresh data
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

  // Initial load when device is connected
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (props.connectedDevice && isMounted) {
        await fetchDataTimer();
      }
    };
    fetchData();
    return () => {
      isMounted = false; // Prevent state update after unmount
    };
  }, [props.connectedDevice]);

  // Refresh logic
  const onRefreshTimer = async () => {
    try {
      // Clear previous state for actual refresh
      dispatchTimers(initialTimersState);
      const dataPromise = Receive.TimerReceivedData(
        props.connectedDevice,
        dispatchTimers,
        setLoading,
        setTitle
      );
      // Request new data from the device
      await Receive.sendReqToGetData(props.connectedDevice, 1);

      // Receive and parse data again
      await dataPromise;
    } catch (error) {
      console.error("Error during refresh:", error);
    }
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={135} // You may need to tweak this
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      enableResetScrollToCoords={false}
      enableOnAndroid={true}
      contentContainerStyle={{ flexGrow: 1 }}
      extraHeight={100}
      enableAutomaticScroll={true}
    >
      <View>
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
