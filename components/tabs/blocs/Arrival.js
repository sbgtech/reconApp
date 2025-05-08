import React from "react";
import { Text, View, ScrollView, useWindowDimensions } from "react-native";
import { styles } from "../style/styles";
import { Receive } from "../../Utils/Receive";

const Arrival = ({ arrivals }) => {
  const { width } = useWindowDimensions();
  const formattedTimeArrivals = (value) => {
    if (Number(value) == 65535) {
      return "FAIL";
    } else if (Number(value) == 0) {
      return 0;
    } else {
      return Receive.convertToHMS(value);
    }
  };
  return (
    <ScrollView style={styles.arrivalWrapper(width)} nestedScrollEnabled={true}>
      <View style={styles.arrivalItemsContainer(width)}>
        {arrivals.map((data, index) => {
          // const { formattedHours, formattedMinutes, formattedSeconds } =
          //   formattedTimeArrivals(data.value);
          return (
            <View key={index} style={styles.arrivalItems(width)}>
              <Text style={styles.arrivalName(width)}>{data.name}</Text>
              <Text style={styles.arrivalValue(width)}>
                {formattedTimeArrivals(data.value)}
              </Text>
            </View>
          );
        })}
        <View style={styles.emptyArrivalItems(width)}></View>
      </View>
    </ScrollView>
  );
};

export default Arrival;
