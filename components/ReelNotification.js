import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  View,
  ToastAndroid,
} from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";

const ReelNotification = ({ message, onDismiss }) => {
  const [visible, setVisible] = useState(true);
  const slideAnim = new Animated.Value(-100); // Start offscreen (above)

  // Slide the notification down
  const showNotification = () => {
    Animated.spring(slideAnim, {
      toValue: 0, // Target position for the notification (0 is at the top)
      useNativeDriver: true,
    }).start();
  };

  // Hide the notification with a sliding up animation
  const hideNotification = () => {
    Animated.spring(slideAnim, {
      toValue: -100, // Move it offscreen
      useNativeDriver: true,
    }).start(() => {
      setVisible(false); // Hide it completely after animation
      if (onDismiss) onDismiss(); // Call the dismiss handler if provided
    });
  };

  const copyMessage = () => {
    Clipboard.setString(message); // Copy the message to clipboard
    // Show a success message (using Toast for Android as an example)
    ToastAndroid.show("Message copied to clipboard!", ToastAndroid.SHORT);
    // Or use any custom Toast/notification component instead of ToastAndroid
    hideNotification(); // Optionally hide the notification after copying
  };

  React.useEffect(() => {
    if (visible) {
      showNotification();
    }
  }, [visible]);

  return (
    visible && (
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.notification,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View>
            <Text style={styles.message}>The WellName PIN is : {message}</Text>
          </View>
          <View>
            <TouchableOpacity onPress={copyMessage} style={styles.copyButton}>
              <Text style={styles.copyText}>Copy PIN</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.33)", // Transparent black background
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  notification: {
    width: "90%", // Set a width for the notification
    backgroundColor: "#fff",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: "#0055a4",
    borderRadius: 8,
    zIndex: 1001, // Ensure it sits above the overlay
  },
  message: {
    color: "#0055a4",
    fontSize: 16,
    fontWeight: "bold",
  },
  copyButton: {
    backgroundColor: "#0055a4",
    padding: 5,
    borderRadius: 5,
    height: 28,
  },
  copyText: {
    color: "#fff",
    fontSize: 12,
  },
});

export default ReelNotification;
