import React from "react";
import {
  View,
  Modal,
  TextInput,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  useWindowDimensions,
  Image,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import ButtonUI from "../../ButtonUI";
import { styles } from "../style/styles";
import AntDesign from "@expo/vector-icons/AntDesign";

const Wellname_modal = ({
  wellNameModalVisible,
  setWellNameModalVisible,
  wellname,
  setWellname,
  handleSubmitWellName,
  isWellNameIndicatorShown,
}) => {
  const { width } = useWindowDimensions();
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={wellNameModalVisible}
      onRequestClose={() => setWellNameModalVisible(false)}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.PINContainer}>
            <View style={styles.PINContent(width)}>
              <TouchableOpacity
                style={styles.closeIconContainer}
                onPress={() => {
                  setWellNameModalVisible(false);
                }}
              >
                <AntDesign
                  name="closesquare"
                  size={
                    width < 600 ? 26 : width < 800 ? 28 : width < 950 ? 38 : 38
                  }
                  color="#0055a4"
                />
              </TouchableOpacity>
              <Text style={styles.PINTitle(width)}>Enter WellName :</Text>
              <TextInput
                style={styles.PINinput(width)}
                placeholder="Enter WellName..."
                value={wellname}
                onChangeText={setWellname}
                autoFocus={true}
              />
              {!isWellNameIndicatorShown ? (
                <ButtonUI
                  onPress={() => handleSubmitWellName()}
                  title={"Send"}
                  btnStyle={styles.btnSendText(width)}
                  txtStyle={styles.TextSendStyle(width)}
                />
              ) : (
                <Image
                  alt="App Logo"
                  resizeMode="center"
                  style={styles.loginImgLoad(width)}
                  source={require("../../../assets/load.gif")}
                />
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default Wellname_modal;
