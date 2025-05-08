import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Image,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
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
import ButtonUI from "../ButtonUI";

const TestTab2 = (props) => {
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

  const flatListRef = useRef();

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
      setTimeout(() => {
        Keyboard.dismiss();
      }, 500);
    } else {
      // Alert.alert("Warning", "Data required");
      Toast.show({
        type: "error",
        text1: "Warning",
        text2: "Data required",
        visibilityTime: 3000,
      });
      Keyboard.dismiss();
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

  const onContentSizeChange = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  // useEffect(() => {
  //   flatListRef.current?.scrollToEnd({ animated: true });
  // }, [dataArray]);

  const renderItem = ({ item }) => (
    <View style={styles.msgViewContainer}>
      <View style={styles.msgView}>
        <Text style={styles.itemType(width)}>{item.type} :</Text>
      </View>
      <View style={styles.msgView}>
        <Text style={styles.itemData(width)}>{item.data}</Text>
      </View>
      <View style={styles.msgView}>
        <Text style={styles.itemDate(width)}>
          {Moment(item.date).format("lll")}
        </Text>
      </View>
    </View>
  );

  const handleEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText(width)}> No Data present!</Text>
        <Image
          alt="App Logo"
          resizeMode="contain"
          style={styles.emptyImg(width)}
          source={require("../../assets/no-data.png")}
        />
      </View>
    );
  };

  return (
    // <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={styles.containerTestTab}>
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
          {/* Title */}
          <View>
            <Text style={styles.testTitle(width)}>Test mode :</Text>
          </View>
          {/* Input area */}
          <View style={styles.inputTestContainer(width)}>
            <TextInput
              style={styles.testInput(width)}
              placeholder="Type a message..."
              value={message}
              onChangeText={onMessageChanged}
            />
            <ButtonUI
              onPress={async () => await onSendMessageSubmit()}
              title={"Send"}
              btnStyle={styles.btnSend(width)}
              txtStyle={styles.sendButtonText(width)}
              loading={false}
            />
          </View>
          {/* FlatList to display messages */}
          <FlatList
            ref={flatListRef}
            data={dataArray}
            renderItem={renderItem}
            ListEmptyComponent={handleEmpty}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.flatListContainer}
            onContentSizeChange={onContentSizeChange}
          />
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
      <Loading loading={loading} title={title} />
    </View>
    // </TouchableWithoutFeedback>
  );
};

export default TestTab2;
