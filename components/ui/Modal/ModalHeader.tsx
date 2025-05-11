import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
// If you have a cross-platform Icon component, import it here. Otherwise, use a placeholder.
import Icon from "@/components/ui/Icons";

interface ModalHeaderProps {
  title: string;
  style?: ViewStyle;
  onBtnClick?: () => void;
}

export default function ModalHeader({
  title,
  style,
  onBtnClick,
}: ModalHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={onBtnClick} style={styles.closeBtn}>
        <Icon name="Close" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280", // Example color for text-shade-secondary
  },
  closeBtn: {
    height: 18,
    width: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});
