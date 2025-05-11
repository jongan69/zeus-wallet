import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

type BadgeProps = {
  label: string;
  style?: ViewStyle;
  theme?: "primary" | "secondary" | "outline" | "fade";
  icon?: React.ReactNode;
};

export default function Badge({
  label,
  style,
  theme = "secondary",
  icon,
}: BadgeProps) {
  const themeStyles = {
    primary: styles.badgePrimary,
    secondary: styles.badgeSecondary,
    outline: styles.badgeOutline,
    fade: styles.badgeFade,
  };

  return (
    <View style={[styles.badge, themeStyles[theme], style]}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  badgePrimary: {
    backgroundColor: "#007bff",
  },
  badgeSecondary: {
    backgroundColor: "#6c757d",
  },
  badgeOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#007bff",
  },
  badgeFade: {
    backgroundColor: "#f8f9fa",
  },
  icon: {
    marginRight: 6,
  },
  label: {
    fontSize: 14,
    color: "#222",
  },
});
