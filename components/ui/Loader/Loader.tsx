import React, { JSX } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native";

const { height, width } = Dimensions.get("window");

function Loader(): JSX.Element {
  return (
    <View style={styles.overlay}>
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4F46E5" style={styles.loader} />
        <Text style={styles.text}>Loading...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    zIndex: 9999,
    height,
    width,
    top: 0,
    left: 0,
    backgroundColor: "rgba(30, 41, 59, 0.5)", // Example bg-shade-background with opacity
    justifyContent: "center",
    alignItems: "center",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    // You can add custom styles for the loader if needed
  },
  text: {
    paddingTop: 16,
    fontSize: 16,
    fontWeight: "600",
    color: "#4F46E5", // Example for text-shade-primary
    textAlign: "center",
  },
});

export default Loader;
