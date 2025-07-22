import React, { useEffect, useReducer, useState } from "react";
import { View, ScrollView, Text, useWindowDimensions } from "react-native";
import Arrival from "./blocs/Arrival";
import { styles } from "./style/styles";
import Table from "./blocs/Table";
import RefreshBtn from "./blocs/RefreshBtn";
import { Receive } from "../Utils/Receive";
import Loading from "./blocs/Loading";

const WellStatus = ({ route }) => {
  const { width } = useWindowDimensions();
  const { connectedDevice } = route.params;
  // the loading state, default is false
  const [loading, setLoading] = useState(false);
  // title of loading modal
  const [title, setTitle] = useState("");

  const plungerState = [
    "POWER UP",
    "SHUTIN",
    "OPEN",
    "AFTERFLOW",
    "MANDATORY",
    "HILINE",
    "LOLINE",
  ];

  const initialWellStatusState = {
    plungerStateIndex: null,
    systemClock: 0,
    line: "",
    tubing: "",
    casing: "",
    arrivals: [],
    uniqueID: "",
    fwVersion: "",
    battery: "",
  };

  const wellStatusReducer = (state, action) => ({
    ...state,
    ...action, // Merge new values
  });

  const [wellStatus, dispatchWellStatus] = useReducer(
    wellStatusReducer,
    initialWellStatusState
  );

  const tableHeader = [{ name: "Telemetry data" }];
  const tableData = [
    { column1: "Unique ID", column2: wellStatus.uniqueID },
    { column1: "FW version", column2: wellStatus.fwVersion },
    {
      column1: "Battery voltage (V)",
      column2: wellStatus.battery / 10,
    },
  ];

  const fetchDataWellStatus = async () => {
    try {
      await Receive.sendReqToGetData(connectedDevice, 0);
      dispatchWellStatus(initialWellStatusState);
      const dataPromise = Receive.WellStatusReceivedData(
        connectedDevice,
        dispatchWellStatus,
        setLoading,
        setTitle
      );
      await dataPromise;
      // Receive and parse data again
    } catch (error) {
      console.error("Error during fetching data:", error);
    }
  };

  // Initial load, call WellStatusReceivedData function with the corresponding data
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (connectedDevice && isMounted) {
        await fetchDataWellStatus();
      }
    };
    fetchData();
    return () => {
      isMounted = false; // Prevent state update after unmount
    };
  }, [connectedDevice]);

  return (
    <ScrollView>
      <View style={[styles.container, styles.marginBottomContainer]}>
        <RefreshBtn onPress={() => fetchDataWellStatus()} />
        <View style={styles.statusContainer(width)}>
          <View style={styles.statusWrapper(width)}>
            <Text style={styles.statusText(width)}>Plunger state</Text>
            <Text style={styles.statusValue(width)}>
              {plungerState[wellStatus.plungerStateIndex]}
            </Text>
          </View>
          <View style={styles.statusWrapper(width)}>
            <Text style={styles.statusText(width)}>System clock</Text>
            <Text style={styles.statusValue(width)}>
              {wellStatus.systemClock !== null
                ? Receive.convertToHMS(wellStatus.systemClock)
                : null}
            </Text>
          </View>
          <View style={styles.statusWrapper(width)}>
            <Text style={styles.statusText(width)}>Line (PSI)</Text>
            <Text style={styles.statusValue(width)}>{wellStatus.line}</Text>
          </View>
          <View style={styles.statusWrapper(width)}>
            <Text style={styles.statusText(width)}>Tubing (PSI)</Text>
            <Text style={styles.statusValue(width)}>{wellStatus.tubing}</Text>
          </View>
          <View style={styles.statusWrapper(width)}>
            <Text style={styles.statusText(width)}>Casing (PSI)</Text>
            <Text style={styles.statusValue(width)}>{wellStatus.casing}</Text>
          </View>
          <View style={styles.emptyStatusWrapper(width)}></View>
        </View>
        <View style={styles.arrivalContainer}>
          <Arrival arrivals={wellStatus.arrivals} />
        </View>
        <View style={styles.telemetryDataContainer}>
          <Table data={tableData} header={tableHeader} />
        </View>
      </View>
      <Loading loading={loading} title={title} />
    </ScrollView>
  );
};

export default WellStatus;
