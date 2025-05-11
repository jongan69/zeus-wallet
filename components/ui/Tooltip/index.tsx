import React from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

export interface TooltipProps {
  /** Is the Tooltip Open */
  isOpen?: boolean;
  /** Tooltip Inner Content */
  children: React.ReactNode;
  /** Width of Tooltip */
  width?: number;
  /** Arrow Position */
  arrowPosition?:
    | "bottom-left"
    | "bottom-middle"
    | "bottom-right"
    | "top-left"
    | "top-middle"
    | "top-right"
    | "left-top"
    | "left-middle"
    | "left-bottom"
    | "right-top"
    | "right-middle"
    | "right-bottom";
  /** Should Tooltip animate in and out */
  shouldAnimate?: boolean;
  /** Custom classNames */
  className?: string;
  /** Tooltip Theme */
  theme?: "dark" | "dark-alt";
}

export default function Tooltip({
  children = "This is example content for a multi-line tooltip component.",
  width = 300,
  arrowPosition = "top-middle",
  shouldAnimate = true,
  isOpen = false,
  className,
  theme = "dark",
}: TooltipProps) {
  if (!isOpen) return null;

  return (
    <View
      style={[
        styles.tooltip,
        theme === "dark" ? styles.dark : styles.darkAlt,
        { width },
      ]}
    >
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tooltip: {
    position: "absolute",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 1000,
    // Add more positioning logic based on arrowPosition later
  } as ViewStyle,
  dark: {
    backgroundColor: "#222831",
  } as ViewStyle,
  darkAlt: {
    backgroundColor: "#fff",
  } as ViewStyle,
  text: {
    color: "#fff",
    fontSize: 14,
  } as TextStyle,
});
