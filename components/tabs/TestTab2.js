import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  TextInput,
  useColorScheme,
  FlatList,
  Image,
  Alert,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from "react-native-reanimated";
import ButtonUI from "../ButtonUI";
import Ionicons from "@expo/vector-icons/Ionicons";
import Moment from "moment";
import { Buffer } from "buffer";
import Toast from "react-native-toast-message";
import { styles } from "./style/styles";
import {
  UART_SERVICE_UUID,
  UART_TX_CHARACTERISTIC_UUID,
} from "../Utils/Constants";
import { Receive } from "../Utils/Receive";
import Loading from "./blocs/Loading";
import PIN_modal from "./blocs/PIN_modal";

const TestTab = (props) => {
  const { setActiveTab, navigation, connectedDevice } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // state for the writing message, default empty
  const [message, setMessage] = useState("");
  // the loading state, default is false
  const [loading, setLoading] = useState(false);
  // title of loading modal
  const [title, setTitle] = useState("");
  // data received state, default empty
  const [dataReceived, setDataReceived] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  // initialize an array of sent and received data
  const [dataArray, setDataArray] = useState([]);
  // get auto width of used device
  const { width } = useWindowDimensions();

  // used this variable for the color of the screen (dark mode or light mode, default is light)
  const colorScheme = useColorScheme();
  // used for set padding when the keyboard shown
  const keyboard = useAnimatedKeyboard();
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboard.height.value }],
  }));

  // set to message state the value in the input text
  const onMessageChanged = (e) => {
    setMessage(e);
  };

  // function for sending data only for testing mode
  const sendData = async (device, data) => {
    try {
      // when this function is called when the message is submitted, set loading true to show loading modal and display success alert
      setLoading(true);
      setTitle("Sending...");
      setDataReceived(false);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Sent successfully",
        visibilityTime: 3000,
      });
      // create a new Buffer instance from the data variable, interpreting it as a UTF-8 encoded string
      // data should be a string or an array of bytes, and Buffer.from encodes it into a binary format (a Buffer object) using UTF-8 encoding
      const buffer = Buffer.from(data, "utf-8");
      // send the data to device with ble-plx write function (writeCharacteristicWithResponseForService)
      await device?.writeCharacteristicWithResponseForService(
        UART_SERVICE_UUID,
        UART_TX_CHARACTERISTIC_UUID,
        buffer.toString("base64")
      );
      // add the data sent on the array list with calling addObject function with data and type parameters
      addObject(data, "TX");
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  // function get the message variable and sent it with sendData function
  const onSendMessageSubmit = async () => {
    if (message !== "") {
      // call sentData function with two inputs (device and writting message)
      await sendData(connectedDevice, message + "\n");
      // empty the variable
      setMessage("");
    } else {
      Alert.alert("Warning", "Data required");
    }
  };

  useEffect(() => {
    setModalVisible(true);
  }, []);

  const handleSubmitPIN = () => {
    if (pin === "7707") {
      setIsAuthenticated(true);
      setModalVisible(false);
    } else {
      Alert.alert("Incorrect PIN", "Please try again.");
      setPin("");
    }
  };

  // Initial load
  useEffect(() => {
    if (loading && !dataReceived) {
      // if loading is false and dataReceived is false too
      const timer = setTimeout(() => {
        if (!dataReceived) {
          // if data no received show warning alert
          Toast.show({
            type: "error",
            text1: "Warning",
            text2: "No data received",
            visibilityTime: 3000,
          });
          setLoading(false); // set loading to false
        }
      }, 7000); // set timeout to 7 seconds to wait if data received or not
      return () => clearTimeout(timer); // clear timeout
    }
    if (!isSubscribed) {
      receiveData();
    }
  }, [loading, dataReceived, isSubscribed, connectedDevice, receiveData]);

  // function used to get the data and type of this data as parameters
  const addObject = (data, type) => {
    // create new object with the passed data and type
    const newObj = { date: Date.now(), data: data, type: type };
    // set to dataArray state the created object
    setDataArray((prevArray) => [...prevArray, newObj]);
  };

  // function for receiving data only for testing mode
  const receiveData = useCallback(() => {
    if (!isSubscribed) {
      setIsSubscribed(true);
      // call TestReceivedData function
      Receive.TestReceivedData(connectedDevice, {
        setDataArray,
        setLoading,
        setDataReceived,
      });
    }
  }, [isSubscribed]);

  const renderItem = ({ item }) => (
    <View style={styles.msgViewContainer}>
      <View style={styles.msgView}>
        <Text style={styles.itemType}>{item.type} :</Text>
      </View>
      <View style={styles.msgView}>
        <Text style={styles.itemData}>{item.data}</Text>
      </View>
      <View style={styles.msgView}>
        <Text style={styles.itemDate}>{Moment(item.date).format("lll")}</Text>
      </View>
    </View>
  );

  const handleEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}> No Data present!</Text>
        <Image
          alt="App Logo"
          resizeMode="contain"
          style={{ width: width / 2, height: width / 2 }}
          source={require("../../assets/no-data.png")}
        />
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.containerTestTab,
        animatedStyles,
        { backgroundColor: colorScheme === "light" ? "#fff" : "#fff" },
        styles.marginBottomContainer,
      ]}
    >
      <View>
        <PIN_modal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          pin={pin}
          setPin={setPin}
          handleSubmitPIN={handleSubmitPIN}
          navigation={navigation}
          setActiveTab={setActiveTab}
        />
      </View>
      {isAuthenticated ? (
        <View style={styles.box}>
          {/* <View>
            <Text style={styles.testTitle}>Test mode :</Text>
          </View> */}
          <FlatList
            style={styles.itemsList}
            data={dataArray}
            renderItem={renderItem}
            ListEmptyComponent={handleEmpty}
            keyExtractor={(item, index) => index.toString()}
          />
          <View style={styles.testContainer(width)}>
            <TextInput
              style={styles.testInput}
              value={message}
              onChangeText={onMessageChanged}
              placeholder="Message..."
            />
            <ButtonUI
              onPress={async () => await onSendMessageSubmit()}
              title={
                <Ionicons
                  name="send"
                  size={width < 600 ? 20 : 30}
                  color="white"
                />
              }
              btnStyle={styles.btnSend}
              txtStyle={styles.TextSendStyle}
              loading={false}
            />
          </View>
          <Loading loading={loading} title={title} />
        </View>
      ) : (
        <View style={styles.emptyPINContainer}>
          <Text style={styles.emptyPINText}>Advanced usage only</Text>
          <Image
            alt="App Logo"
            resizeMode="contain"
            style={{
              width: 200,
              height: 200,
            }}
            source={require("../../assets/pin.png")}
          />
        </View>
      )}
    </Animated.View>
  );
};

export default TestTab;
