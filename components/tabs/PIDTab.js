import { useEffect, useReducer, useState } from "react";
import { View, useWindowDimensions, StyleSheet } from "react-native";
import { styles } from "./style/styles";
import { Receive } from "../Utils/Receive";
import Loading from "./blocs/Loading";
import RefreshBtn from "./blocs/RefreshBtn";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PIDPortOne from "./blocs/PID/PIDPort1";
import PIDPortTwo from "./blocs/PID/PIDPort2";

const PIDTab = ({ route }) => {
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

  const initialPIDState = {
    pidOneEnableIndex: null,
    pidOneModeIndex: null,
    pidOneSP: "",
    pidOneKP: "",
    pidOneKI: "",
    pidOneKD: "",
    pidOneINIT: "",
    pidOneDB: "",
    pidOneLL: "",
    pidOnePVSource: null,
    pidOneLoopDelay: "",
    pidTwoEnableIndex: null,
    pidTwoModeIndex: null,
    pidTwoSP: "",
    pidTwoKP: "",
    pidTwoKI: "",
    pidTwoKD: "",
    pidTwoINIT: "",
    pidTwoDB: "",
    pidTwoLL: "",
    pidTwoPVSource: null,
    pidTwoLoopDelay: "",
  };

  const PIDReducer = (state, action) => ({
    ...state,
    ...action, // Merge new values
  });

  const [PID, dispatchPID] = useReducer(PIDReducer, initialPIDState);

  // function called in useEffect when load component to fetch data
  const fetchDataPID = async () => {
    try {
      dispatchPID(initialPIDState);
      const dataPromise = Receive.PIDReceivedData(
        connectedDevice,
        dispatchPID,
        setLoading,
        setTitle
      );
      await Receive.sendReqToGetData(connectedDevice, 7);
      // start receiving data
      await dataPromise;
    } catch (error) {
      console.error("Error during fetching PID data:", error);
    }
  };

  // Initial load, call fetchData function with the corresponding data
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (connectedDevice && isMounted) {
        await fetchDataPID();
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
    <PIDPortOne
      connectedDevice={connectedDevice}
      PID={PID}
      dispatchPID={dispatchPID}
      fetchDataPID={fetchDataPID}
      setLoading={setLoading}
    />
  );

  // Open trigger Backup
  const card2 = (
    <PIDPortTwo
      connectedDevice={connectedDevice}
      PID={PID}
      dispatchPID={dispatchPID}
      fetchDataPID={fetchDataPID}
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
        </View>
      );
    } else {
      return (
        <>
          <View style={styless.column}>{card1}</View>
          <View style={styless.column}>{card2}</View>
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
        <RefreshBtn onPress={() => fetchDataPID()} />

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

export default PIDTab;
