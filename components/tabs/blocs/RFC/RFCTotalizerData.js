import { View, Text, useWindowDimensions } from "react-native";
import { styles } from "../../style/styles";

const RFCTotalizerData = ({ RFC }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.settingsSection(width)} key="card1">
      <View style={styles.inputContainer}>
        <Text style={styles.valveTitle(width)}>Totalizer data</Text>
        <View style={styles.rfcTotalizerWrapper(width)}>
          <Text style={styles.statusText(width)}>Flow Rate</Text>
          <Text style={styles.statusValue(width)}>
            {RFC.rfcFlowRate !== "" ? `${RFC.rfcFlowRate} MCF/Day` : "--"}
          </Text>
        </View>
        <View style={styles.rfcTotalizerWrapper(width)}>
          <Text style={styles.statusText(width)}>Volume Today</Text>
          <Text style={styles.statusValue(width)}>
            {RFC.rfcVolumeToday !== "" ? `${RFC.rfcVolumeToday} MCF` : "--"}
          </Text>
        </View>
        <View style={styles.rfcTotalizerWrapper(width)}>
          <Text style={styles.statusText(width)}>Volume Yesterday</Text>
          <Text style={styles.statusValue(width)}>
            {RFC.rfcVolumeYesterday !== ""
              ? `${RFC.rfcVolumeYesterday} MCF`
              : "--"}
          </Text>
        </View>
        <View style={styles.rfcTotalizerWrapper(width)}>
          <Text style={styles.statusText(width)}>Accumulated Vol</Text>
          <Text style={styles.statusValue(width)}>
            {RFC.rfcAccVol !== "" ? `${RFC.rfcAccVol} MCF` : "--"}
          </Text>
        </View>
        <View style={styles.rfcTotalizerWrapper(width)}>
          <Text style={styles.statusText(width)}>Diff Pressure</Text>
          <Text style={styles.statusValue(width)}>
            {RFC.rfcDiffPressure !== "" ? `${RFC.rfcDiffPressure} inH2O` : "--"}
          </Text>
        </View>
        <View style={styles.rfcTotalizerWrapper(width)}>
          <Text style={styles.statusText(width)}>Static Pressure</Text>
          <Text style={styles.statusValue(width)}>
            {RFC.rfcStaticPresure !== ""
              ? `${RFC.rfcStaticPresure} PSIA`
              : "--"}
          </Text>
        </View>
        <View style={styles.rfcTotalizerWrapper(width)}>
          <Text style={styles.statusText(width)}>Casing Pressure</Text>
          <Text style={styles.statusValue(width)}>
            {RFC.rfcCasingPressure !== ""
              ? `${RFC.rfcCasingPressure} PSI`
              : "--"}
          </Text>
        </View>
        <View style={styles.rfcTotalizerWrapper(width)}>
          <Text style={styles.statusText(width)}>PID</Text>
          <Text style={styles.statusValue(width)}>
            {RFC.rfcPID !== "" ? `${RFC.rfcPID} mA` : "--"}
          </Text>
        </View>
      </View>
    </View>
  );
};
export default RFCTotalizerData;
