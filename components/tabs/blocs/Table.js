import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { styles } from "../style/styles";

const Table = ({ header, data }) => {
  const { width } = useWindowDimensions();
  return (
    <View style={styles.tableContainer}>
      {/* Table Header */}
      <View style={styles.tableHeader}>
        {header.map((headerTitle, index) => (
          <Text key={index} style={styles.tableHeaderText(width)}>
            {headerTitle.name}
          </Text>
        ))}
      </View>

      {/* Table Data */}
      <View style={styles.dataTableContainer(width)}>
        {data.map((rowData, index) => (
          <View key={index} style={styles.tableRow(width)}>
            <Text style={[styles.tableCell(width), { fontWeight: "bold" }]}>
              {rowData.column1}
            </Text>
            <Text style={styles.tableCell(width)}>{rowData.column2}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Table;
