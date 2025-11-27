import { useEffect, useReducer, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { styles } from "./style/styles";
import { Receive } from "../Utils/Receive";
import ButtonUI from "../ButtonUI";
import Loading from "./blocs/Loading";
import RefreshBtn from "./blocs/RefreshBtn";
import { Buffer } from "buffer";
import {
  UART_SERVICE_UUID,
  UART_TX_CHARACTERISTIC_UUID,
} from "../Utils/Constants";
import Toast from "react-native-toast-message";

const StatisticsTab = ({ route }) => {
  const { width } = useWindowDimensions();
  const { connectedDevice } = route.params;
  // the loading state, default is false
  const [loading, setLoading] = useState(false);
  // title of loading modal
  const [title, setTitle] = useState("");

  const initialStatisticsState = {
    arrivalsToday: "",
    arrivalsWeek: "",
    arrivalsTotal: "",
    missrunToday: "",
    missrunWeek: "",
    missrunTotal: "",
    onTimeToday: "",
    onTimeWeek: "",
    onTimeTotal: "",
  };

  const statisticsReducer = (state, action) => ({
    ...state,
    ...action, // Merge new values
  });

  const [statistics, dispatchStatistics] = useReducer(
    statisticsReducer,
    initialStatisticsState
  );

  // send "reset" to device to reset arrivals values
  const handleResetArrivals = async () => {
    try {
      const buffer = Buffer.from("RST1 \n", "utf-8");
      await connectedDevice?.writeCharacteristicWithResponseForService(
        UART_SERVICE_UUID,
        UART_TX_CHARACTERISTIC_UUID,
        buffer.toString("base64")
      );
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Data sent successfully",
        visibilityTime: 3000,
      });
      setLoading(true);
      await Receive.delay(2000);
      await fetchDataStatistic();
    } catch (error) {
      console.log(
        "Error with writeCharacteristicWithResponseForService :",
        error
      );
    }
  };

  // send "reset" to device to reset missrun values
  const handleResetMissrun = async () => {
    try {
      const buffer = Buffer.from("RST2 \n", "utf-8");
      await connectedDevice?.writeCharacteristicWithResponseForService(
        UART_SERVICE_UUID,
        UART_TX_CHARACTERISTIC_UUID,
        buffer.toString("base64")
      );
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Data sent successfully",
        visibilityTime: 3000,
      });
      setLoading(true);
      await Receive.delay(2000);
      await fetchDataStatistic();
    } catch (error) {
      console.log(
        "Error with writeCharacteristicWithResponseForService :",
        error
      );
    }
  };

  // send "reset" to device to reset onTime values
  const handleResetOnTime = async () => {
    try {
      const buffer = Buffer.from("RST3 \n", "utf-8");
      await connectedDevice?.writeCharacteristicWithResponseForService(
        UART_SERVICE_UUID,
        UART_TX_CHARACTERISTIC_UUID,
        buffer.toString("base64")
      );
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Data sent successfully",
        visibilityTime: 3000,
      });
      setLoading(true);
      await Receive.delay(2000);
      await fetchDataStatistic();
    } catch (error) {
      console.log(
        "Error with writeCharacteristicWithResponseForService :",
        error
      );
    }
  };

  // function called in useEffect when load component to fetch data
  const fetchDataStatistic = async () => {
    try {
      dispatchStatistics(initialStatisticsState);
      const dataPromise = Receive.StatisticsReceivedData(
        connectedDevice,
        dispatchStatistics,
        setLoading,
        setTitle
      );
      await Receive.sendReqToGetData(connectedDevice, 4);
      // start receiving data
      await dataPromise;
    } catch (error) {
      console.error("Error during fetching statistic data:", error);
    }
  };

  // Initial load, call fetchData function with the corresponding data
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (connectedDevice && isMounted) {
        await fetchDataStatistic();
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Prevent state update after unmount
    };
  }, [connectedDevice]);

  return (
    <ScrollView>
      <RefreshBtn onPress={() => fetchDataStatistic()} />
      <View style={[styles.statisticWrapper, styles.marginBottomContainer]}>
        <Text style={styles.valveTitle(width)}>Arrival statistics</Text>
        <View style={styles.statisticSectionContainer(width)}>
          <View style={[styles.rangeWrapper, styles.statisticSection(width)]}>
            <Text style={styles.titleSettings(width)}>Arrivals today :</Text>
            <TextInput
              style={styles.inputSettingsDisabled(width)}
              value={statistics.arrivalsToday.toString()}
              editable={false}
            />
            <Text style={styles.titleSettings(width)}>Arrivals week :</Text>
            <TextInput
              style={styles.inputSettingsDisabled(width)}
              value={statistics.arrivalsWeek.toString()}
              editable={false}
            />
            <Text style={styles.titleSettings(width)}>Arrivals total :</Text>
            <TextInput
              style={styles.inputSettingsDisabled(width)}
              value={statistics.arrivalsTotal.toString()}
              editable={false}
            />
            <View style={styles.StatisticContainerBtnText}>
              <ButtonUI
                onPress={() => handleResetArrivals()}
                title={"Reset"}
                btnStyle={styles.btnSendText(width)}
                txtStyle={styles.TextSendStyle(width)}
              />
            </View>
          </View>
          <View style={[styles.rangeWrapper, styles.statisticSection(width)]}>
            <Text style={styles.titleSettings(width)}>Missrun today :</Text>
            <TextInput
              style={styles.inputSettingsDisabled(width)}
              value={statistics.missrunToday.toString()}
              editable={false}
            />
            <Text style={styles.titleSettings(width)}>Missrun week :</Text>
            <TextInput
              style={styles.inputSettingsDisabled(width)}
              value={statistics.missrunWeek.toString()}
              editable={false}
            />
            <Text style={styles.titleSettings(width)}>Missrun total :</Text>
            <TextInput
              style={styles.inputSettingsDisabled(width)}
              value={statistics.missrunTotal.toString()}
              editable={false}
            />
            <View style={styles.StatisticContainerBtnText}>
              <ButtonUI
                onPress={() => handleResetMissrun()}
                title={"Reset"}
                btnStyle={styles.btnSendText(width)}
                txtStyle={styles.TextSendStyle(width)}
              />
            </View>
          </View>
          <View style={[styles.rangeWrapper, styles.statisticSection(width)]}>
            <Text style={styles.titleSettings(width)}>
              OnTime today (sec) :
            </Text>
            <TextInput
              style={styles.inputSettingsDisabled(width)}
              value={statistics.onTimeToday.toString()}
              editable={false}
            />
            <Text style={styles.titleSettings(width)}>
              OnTime week (hour) :
            </Text>
            <TextInput
              style={styles.inputSettingsDisabled(width)}
              value={statistics.onTimeWeek.toString()}
              editable={false}
            />
            <Text style={styles.titleSettings(width)}>
              OnTime total (hour) :
            </Text>
            <TextInput
              style={styles.inputSettingsDisabled(width)}
              value={statistics.onTimeTotal.toString()}
              editable={false}
            />
            <View style={styles.StatisticContainerBtnText}>
              <ButtonUI
                onPress={() => handleResetOnTime()}
                title={"Reset"}
                btnStyle={styles.btnSendText(width)}
                txtStyle={styles.TextSendStyle(width)}
              />
            </View>
          </View>
        </View>
      </View>
      <Loading loading={loading} title={title} />
    </ScrollView>
  );
};

export default StatisticsTab;
