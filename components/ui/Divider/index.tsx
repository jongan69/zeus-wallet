import React from "react";
import { StyleSheet, View } from "react-native";

export default function Divider({ style = {} }) {
  return (
    <View style={[styles.divider, style]}>
      <View style={styles.dividerLine} />
      <View style={styles.dividerLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 4,
  },
});
