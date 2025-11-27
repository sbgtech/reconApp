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
import TriggerCommon from "./blocs/Trigger/TriggerCommon";
import TriggerOpenBackup from "./blocs/Trigger/TriggerOpenBackup";
import TriggerOpenADJ from "./blocs/Trigger/TriggerOpenADJ";
import TriggerCloseBackup from "./blocs/Trigger/TriggerCloseBackup";
import TriggerCloseADJ from "./blocs/Trigger/TriggerCloseADJ";

const TriggerTab = ({ route }) => {
  // declare initial states
  const { width } = useWindowDimensions();
  const { connectedDevice } = route.params;
  const cardMinWidth =
    width < 600 ? width : width > 950 ? width / 3.4 : width / 2.3;
  const numColumns = Math.max(1, Math.floor(width / cardMinWidth));
  // the loading state, default is false
  const [loading, setLoading] = useState(false);
  // title of loading modal
  const [title, setTitle] = useState("");

  const initialTriggerState = {
    closeDelayTimer: "",
    minArrivalTime: "",
    maxArrivalTime: "",
    openTriggerSelectEnable: null,
    openPressureSetpoint: "",
    openTimerSetpoint: "",
    openBackupTimerEnable: null,
    openBackupTimerMin: "",
    openBackupTimerMax: "",
    openAutoAdjustEnable: null,
    openAutoAdjustPSIMin: "",
    openAutoAdjustPSIMax: "",
    openAutoAdjustPSIIncrement: "",
    openAutoAdjustTimerMin: "",
    openAutoAdjustTimerMax: "",
    openAutoAdjustTimerIncrement: "",
    closeTriggerSelectEnable: null,
    closeFlowrateTriggerSource: null,
    closePressureSetpoint: "",
    closeTimerSetpoint: "",
    closeBackupTimerEnable: null,
    closeBackupTimerMin: "",
    closeBackupTimerMax: "",
    closeAutoAdjustEnable: null,
    closeAutoAdjustPSIMin: "",
    closeAutoAdjustPSIMax: "",
    closeAutoAdjustPSIIncrement: "",
    closeAutoAdjustTimerMin: "",
    closeAutoAdjustTimerMax: "",
    closeAutoAdjustTimerIncrement: "",
  };

  const triggerReducer = (state, action) => ({
    ...state,
    ...action, // Merge new values
  });

  const [trigger, dispatchTrigger] = useReducer(
    triggerReducer,
    initialTriggerState
  );

  // function called in useEffect when load component to fetch data
  const fetchDataTrigger = async () => {
    try {
      dispatchTrigger(initialTriggerState);
      const dataPromise = Receive.TriggerReceivedData(
        connectedDevice,
        dispatchTrigger,
        setLoading,
        setTitle
      );
      await Receive.sendReqToGetData(connectedDevice, 6);
      // start receiving data
      await dataPromise;
    } catch (error) {
      console.error("Error during fetching trigger data:", error);
    }
  };

  // Initial load, call fetchData function with the corresponding data
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (connectedDevice && isMounted) {
        await fetchDataTrigger();
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
    <TriggerCommon
      connectedDevice={connectedDevice}
      trigger={trigger}
      dispatchTrigger={dispatchTrigger}
      fetchDataTrigger={fetchDataTrigger}
      setLoading={setLoading}
    />
  );

  // Open trigger Backup
  const card2 = (
    <TriggerOpenBackup
      connectedDevice={connectedDevice}
      trigger={trigger}
      dispatchTrigger={dispatchTrigger}
      fetchDataTrigger={fetchDataTrigger}
      setLoading={setLoading}
    />
  );

  // Open Trigger Auto Adjust
  const card3 = (
    <TriggerCloseBackup
      connectedDevice={connectedDevice}
      trigger={trigger}
      dispatchTrigger={dispatchTrigger}
      fetchDataTrigger={fetchDataTrigger}
      setLoading={setLoading}
    />
  );

  // Close Trigger Backup
  const card4 = (
    <TriggerOpenADJ
      connectedDevice={connectedDevice}
      trigger={trigger}
      dispatchTrigger={dispatchTrigger}
      fetchDataTrigger={fetchDataTrigger}
      setLoading={setLoading}
    />
  );

  // Close Trigger Auto Adjust
  const card5 = (
    <TriggerCloseADJ
      connectedDevice={connectedDevice}
      trigger={trigger}
      dispatchTrigger={dispatchTrigger}
      fetchDataTrigger={fetchDataTrigger}
      setLoading={setLoading}
    />
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
        </View>
      );
    } else if (numColumns === 2) {
      return (
        <>
          <View style={styless.column}>
            {card1}
            {card3}
            {card5}
          </View>
          <View style={styless.column}>
            {card2}
            {card4}
          </View>
        </>
      );
    } else if (numColumns === 3) {
      return (
        <>
          <View style={styless.column}>
            {card1}
            {card4}
          </View>
          <View style={styless.column}>
            {card2}
            {card5}
          </View>
          <View style={styless.column}>{card3}</View>
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
        </>
      );
    }
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
        <RefreshBtn onPress={() => fetchDataTrigger()} />

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

export default TriggerTab;
