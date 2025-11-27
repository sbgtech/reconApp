import React, { useEffect, useReducer, useState } from "react";
import { View, useWindowDimensions, StyleSheet } from "react-native";
import { styles } from "./style/styles";
import { Receive } from "../Utils/Receive";
import Loading from "./blocs/Loading";
import RefreshBtn from "./blocs/RefreshBtn";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Alarm from "./blocs/Alarm/Alarm";

const AlarmTab = ({ route }) => {
  // declare initial states
  const { width } = useWindowDimensions();
  const { connectedDevice } = route.params;
  // the loading state, default is false
  const [loading, setLoading] = useState(false);
  // title of loading modal
  const [title, setTitle] = useState("");

  const initialalarmState = {
    LPAlarmLimitMin: "",
    LPAlarmLimitMax: "",
    TPAlarmLimitMin: "",
    TPAlarmLimitMax: "",
    CPAlarmLimitMin: "",
    CPAlarmLimitMax: "",
  };

  const alarmReducer = (state, action) => ({
    ...state,
    ...action, // Merge new values
  });

  const [alarm, dispatchAlarm] = useReducer(alarmReducer, initialalarmState);

  // function called in useEffect when load component to fetch data
  const fetchDataAlarm = async () => {
    try {
      dispatchAlarm(initialalarmState);
      const dataPromise = Receive.AlarmReceivedData(
        connectedDevice,
        dispatchAlarm,
        setLoading,
        setTitle
      );
      await Receive.sendReqToGetData(connectedDevice, 8);
      // start receiving data
      await dataPromise;
    } catch (error) {
      console.error("Error during fetching alarm data:", error);
    }
  };

  // Initial load, call fetchData function with the corresponding data
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (connectedDevice && isMounted) {
        await fetchDataAlarm();
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Prevent state update after unmount
    };
  }, [connectedDevice]);

  // all settings sections by bloc

  // Trigger Commun settings
  const card1 = (
    <Alarm
      connectedDevice={connectedDevice}
      alarm={alarm}
      dispatchAlarm={dispatchAlarm}
      fetchDataAlarm={fetchDataAlarm}
      setLoading={setLoading}
    />
  );

  // render all columns based in width
  const renderColumns = () => {
    return <View style={styless.column}>{card1}</View>;
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={120} // Space above the keyboard
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      enableResetScrollToCoords={false}
      enableOnAndroid={true}
      contentContainerStyle={{ flexGrow: 1 }}
      extraHeight={100}
      enableAutomaticScroll={true}
    >
      <View>
        <RefreshBtn onPress={() => fetchDataAlarm()} />

        <View style={[styles.settingsWrapper, styles.marginBottomContainer]}>
          <View style={styles.settingsSectionContainer(width)}>
            <View style={styless.masonryContainer}>{renderColumns()}</View>
          </View>
        </View>
        <Loading loading={loading} title={title} />
      </View>
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

export default AlarmTab;
