import { ThemedText as Text } from "@/components/ui/ThemedText";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function CardActionsHeader() {
  return (
    <View style={styles.cardActionsTitle}>
      <Text style={styles.titleText} lightColor="#fff">Claim your free tBTC</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cardActionsTitle: {
    paddingBottom: 44, // pb-11 in Tailwind is 44px
    // Add any other container styles here
  },
  titleText: {
    // Add your text styles here, e.g. fontWeight, fontSize, color, etc.
    fontSize: 18,
    fontWeight: "bold",
  },
});
