// import {
//   Text,
//   StyleSheet,
//   View,
//   Image,
//   TouchableWithoutFeedback,
//   Keyboard,
//   TouchableOpacity,
//   ActivityIndicator,
//   useWindowDimensions,
//   ScrollView,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import Toast from "react-native-toast-message";
// import OtpTextInput from "react-native-otp-textinput";
// import { styles } from "./tabs/style/styles";

// const Login = () => {
//   const { width } = useWindowDimensions();
//   const [otp, setOtp] = useState("");
//   const [isIndicatorShown, setIsIndicatorShown] = useState(false);

//   // Handle OTP change
//   const handleOtpChange = (text) => {
//     setOtp(text);
//     // Check if the OTP length is 6, and show alert
//     if (text.length === 6) {
//       setIsIndicatorShown(true);
//       setTimeout(() => {
//         Toast.show({
//           type: "success",
//           text1: "Successfully OTP",
//           text2: `Your OTP is ${text}`,
//           visibilityTime: 5000,
//         });
//         setIsIndicatorShown(false);
//       }, 2000);
//     }
//   };

//   useEffect(() => {
//     console.log("this is width", width);
//   }, [width]);

//   return (
//     <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
//       <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//         <View
//           style={{
//             flex: 1,
//           }}
//         >
//           <View style={styles.loginOTPBloc}>
//             <Image
//               alt="App Logo"
//               resizeMode="center"
//               style={styles.loginImg(width)}
//               source={require("../assets/pin.png")}
//             />
//             <Text style={styles.otpTitle(width)}>Enter Your PIN</Text>
//             <OtpTextInput
//               handleTextChange={handleOtpChange} // This will handle OTP input changes
//               inputCount={6}
//               tintColor={"#0055a4"} // blue
//               offTintColor={"#C9C9C9"} // gold
//               keyboardType="numeric"
//               containerStyle={{ padding: 4, margin: 2 }}
//               textInputStyle={styles.loginTextInputStyle(width)}
//             />
//             <TouchableOpacity style={styles.forgotBloc}>
//               <Text style={styles.forgotTxt(width)}>Forgot PIN?</Text>
//               <TouchableOpacity>
//                 <Text style={[styles.forgotTxt(width), { color: "#0055a4" }]}>
//                   Enter name
//                 </Text>
//               </TouchableOpacity>
//             </TouchableOpacity>
//             <View>
//               {isIndicatorShown && (
//                 <ActivityIndicator
//                   size={50}
//                   color={"#d7c300"}
//                   style={styles.loadingStyle}
//                 />
//               )}
//             </View>
//           </View>

//           {/* <View
//         style={{
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <Text>Enter OTP 2:</Text>
//         <OtpTextInput
//           handleTextChange={(text) => setOtp(text)} // This will handle OTP input changes
//           inputCount={6}
//           tintColor={"#0055a4"} // blue
//           offTintColor={"#C9C9C9"} // gold
//           keyboardType="numeric"
//           containerStyle={{ padding: 4, margin: 2 }}
//           textInputStyle={{
//             backgroundColor: "#fff",
//             borderWidth: 0,
//             marginHorizontal: 4,
//           }}
//         />
//       </View>

//       <View
//         style={{
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <Text>Enter OTP 3:</Text>
//         <OtpTextInput
//           handleTextChange={(text) => setOtp(text)} // This will handle OTP input changes
//           inputCount={6}
//           tintColor={"#0055a4"} // blue
//           offTintColor={"#C9C9C9"} // gold
//           keyboardType="numeric"
//           containerStyle={{ padding: 4, margin: 2 }}
//           textInputStyle={{
//             borderWidth: 0,
//             marginHorizontal: 4,
//           }}
//         />
//       </View>

//       <View
//         style={{
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <Text>Enter OTP 4:</Text>
//         <OtpTextInput
//           handleTextChange={(text) => setOtp(text)} // This will handle OTP input changes
//           inputCount={6}
//           tintColor={"#0055a4"} // blue
//           offTintColor={"#C9C9C9"} // gold
//           keyboardType="numeric"
//           containerStyle={{ padding: 4, margin: 2 }}
//           textInputStyle={{
//             backgroundColor: "#fff",
//             borderWidth: 2,
//             borderBottomWidth: 2,
//             marginHorizontal: 4,
//           }}
//         />
//       </View> */}
//         </View>
//       </ScrollView>
//     </TouchableWithoutFeedback>
//   );
// };

// export default Login;
