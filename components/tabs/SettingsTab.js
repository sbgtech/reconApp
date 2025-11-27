import { useEffect, useReducer, useState } from "react";
import { View, Text, useWindowDimensions, StyleSheet } from "react-native";
import { styles } from "./style/styles";
import { Receive } from "../Utils/Receive";
import Loading from "./blocs/Loading";
import Valve from "./blocs/Valve";
import RefreshBtn from "./blocs/RefreshBtn";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ProductionMethod from "./blocs/Settings/ProductionMethod";
import Hilo from "./blocs/Settings/Hilo";
import ValveSelection from "./blocs/Settings/ValveSelection";
import Autocatcher from "./blocs/Settings/Autocatcher";
import PresureIntermit from "./blocs/Settings/PresureIntermit";
import LP from "./blocs/Settings/LP";
import TP from "./blocs/Settings/TP";
import CP from "./blocs/Settings/CP";

const SettingsTab = ({ route }) => {
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
    primaryValveSelection: null,
    hiloValveSelection: null,
  };

  const settingsReducer = (state, action) => ({
    ...state,
    ...action, // Merge new values
  });

  const [settings, dispatchSettings] = useReducer(
    settingsReducer,
    initialSettingsState
  );

  // function called in useEffect when load component to fetch data
  const fetchDataSettings = async () => {
    try {
      dispatchSettings(initialSettingsState);
      const dataPromise = Receive.SettingsReceivedData(
        connectedDevice,
        dispatchSettings,
        setLoading,
        setTitle
      );
      await Receive.sendReqToGetData(connectedDevice, 3);
      // start receiving data
      await dataPromise;
    } catch (error) {
      console.error("Error during fetching settings data:", error);
    }
  };

  // Initial load, call fetchData function with the corresponding data
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (connectedDevice && isMounted) {
        await fetchDataSettings();
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Prevent state update after unmount
    };
  }, [connectedDevice]);

  // all settings sections by bloc
  // production method
  const card1 = (
    <ProductionMethod
      connectedDevice={connectedDevice}
      settings={settings}
      dispatchSettings={dispatchSettings}
      fetchDataSettings={fetchDataSettings}
      setLoading={setLoading}
    />
  );
  // Valve selection
  const card3 = (
    <ValveSelection
      connectedDevice={connectedDevice}
      settings={settings}
      dispatchSettings={dispatchSettings}
      fetchDataSettings={fetchDataSettings}
      setLoading={setLoading}
    />
  );
  // LP
  const card6 = (
    <LP
      connectedDevice={connectedDevice}
      settings={settings}
      dispatchSettings={dispatchSettings}
      fetchDataSettings={fetchDataSettings}
      setLoading={setLoading}
    />
  );
  // CP
  const card7 = (
    <CP
      connectedDevice={connectedDevice}
      settings={settings}
      dispatchSettings={dispatchSettings}
      fetchDataSettings={fetchDataSettings}
      setLoading={setLoading}
    />
  );
  // TP
  const card8 = (
    <TP
      connectedDevice={connectedDevice}
      settings={settings}
      dispatchSettings={dispatchSettings}
      fetchDataSettings={fetchDataSettings}
      setLoading={setLoading}
    />
  );
  // HILO
  const card2 = (
    <Hilo
      connectedDevice={connectedDevice}
      settings={settings}
      dispatchSettings={dispatchSettings}
      fetchDataSettings={fetchDataSettings}
      setLoading={setLoading}
    />
  );
  // AUTOCATCHER
  const card4 = (
    <Autocatcher
      connectedDevice={connectedDevice}
      settings={settings}
      dispatchSettings={dispatchSettings}
      fetchDataSettings={fetchDataSettings}
      setLoading={setLoading}
    />
  );
  // PRESURE INTERMIT
  const card5 = (
    <PresureIntermit
      connectedDevice={connectedDevice}
      settings={settings}
      dispatchSettings={dispatchSettings}
      fetchDataSettings={fetchDataSettings}
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
        <RefreshBtn onPress={() => fetchDataSettings()} />
        <View style={styles.valveContainer}>
          <View
            style={{
              flex: 1,
            }}
          >
            <Valve
              connectedDevice={connectedDevice}
              fetchDataSettings={fetchDataSettings}
              title={"Valve A"}
              status={settings.valveA === 1 ? true : false}
              valve={"A"}
              setLoading={setLoading}
            />
          </View>
          <View
            style={{
              flex: 1,
            }}
          >
            <Valve
              connectedDevice={connectedDevice}
              fetchDataSettings={fetchDataSettings}
              title={"Valve B"}
              status={settings.valveB === 1 ? true : false}
              valve={"B"}
              setLoading={setLoading}
            />
          </View>
        </View>

        <View style={[styles.settingsWrapper, styles.marginBottomContainer]}>
          <Text style={styles.valveTitle(width)}>Controller configuration</Text>
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

export default SettingsTab;
