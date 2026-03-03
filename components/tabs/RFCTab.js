import { useEffect, useReducer, useState } from "react";
import { View, useWindowDimensions, StyleSheet } from "react-native";
import { styles } from "./style/styles";
import { Receive } from "../Utils/Receive";
import Loading from "./blocs/Loading";
import RefreshBtn from "./blocs/RefreshBtn";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RFCTotalizerData from "./blocs/RFC/RFCTotalizerData";
import RFCPID from "./blocs/RFC/RFCPID";
import RFCKickOff from "./blocs/RFC/RFCKickOff1";
import CP from "./blocs/Settings/CP";
import RFCKickOff1 from "./blocs/RFC/RFCKickOff1";
import RFCKickOff2 from "./blocs/RFC/RFCKickOff2";

const RFCTab = ({ route }) => {
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

  const initialRFCState = {
    // Totalizer data
    rfcFlowRate: "",
    rfcVolumeToday: "",
    rfcVolumeYesterday: "",
    rfcAccVol: "",
    rfcDiffPressure: "",
    rfcStaticPresure: "",
    rfcCasingPressure: "",
    rfcPID: "",
    // PID settings
    rfcPidSP: "",
    rfcPidKP: "",
    rfcPidKI: "",
    rfcPidKD: "",
    rfcPidINIT: "",
    rfcPidDB: "",
    rfcPidLL: "",
    // KickOff
    rfcKickOff1EnableIndex: null,
    rfcKickOff1Period: "",
    rfcKickOff1CPStep: "",
    rfcKickOff1CPMax: "",
    rfcKickOff1mAStep: "",
    rfcKickOff2EnableIndex: null,
    rfcKickOff2Period: "",
    rfcKickOff2CPStep: "",
    rfcKickOff2CPMax: "",
    rfcKickOff2mAStep: "",
    // CP
    CPTypeIndex: null,
    CPSensorMax: "",
    CPSensorMin: "",
    CPVoltageMax: "",
    CPVoltageMin: "",
  };

  const RFCReducer = (state, action) => ({
    ...state,
    ...action, // Merge new values
  });

  const [RFC, dispatchRFC] = useReducer(RFCReducer, initialRFCState);

  // function called in useEffect when load component to fetch data
  const fetchDataRFC = async () => {
    try {
      dispatchRFC(initialRFCState);
      const dataPromise = Receive.RFCReceivedData(
        connectedDevice,
        dispatchRFC,
        setLoading,
        setTitle,
      );
      await Receive.sendReqToGetData(connectedDevice, 9);
      // start receiving data
      await dataPromise;
    } catch (error) {
      console.error("Error during fetching RFC data:", error);
    }
  };

  // Initial load, call fetchData function with the corresponding data
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (connectedDevice && isMounted) {
        await fetchDataRFC();
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Prevent state update after unmount
    };
  }, [connectedDevice]);

  // all settings sections by bloc

  // Totalizer data
  const card1 = (
    <RFCTotalizerData
      RFC={RFC}
    />
  );

  // PID settings
  const card2 = (
    <RFCPID
      connectedDevice={connectedDevice}
      RFC={RFC}
      dispatchRFC={dispatchRFC}
      fetchDataRFC={fetchDataRFC}
      setLoading={setLoading}
    />
  );

  // KickOff1 settings
  const card3 = (
    <RFCKickOff1
      connectedDevice={connectedDevice}
      RFC={RFC}
      dispatchRFC={dispatchRFC}
      fetchDataRFC={fetchDataRFC}
      setLoading={setLoading}
    />
  );
  
  // KickOff2 settings
  const card4 = (
    <RFCKickOff2
      connectedDevice={connectedDevice}
      RFC={RFC}
      dispatchRFC={dispatchRFC}
      fetchDataRFC={fetchDataRFC}
      setLoading={setLoading}
    />
  );

  // CP
  const card5 = (
    <CP
      connectedDevice={connectedDevice}
      data={RFC}
      dispatchData={dispatchRFC}
      fetchData={fetchDataRFC}
      setLoading={setLoading}
      registers={{
        pageNumber: 9,
        CPTypeIndex: 103,
        CPSensorMax: 104,
        CPSensorMin: 105,
        CPVoltageMax: 120,
        CPVoltageMin: 121,
      }}
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
    } else {
      // For 3 or more columns, assign each card to its own column if possible.
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
        <RefreshBtn onPress={() => fetchDataRFC()} />

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

export default RFCTab;
