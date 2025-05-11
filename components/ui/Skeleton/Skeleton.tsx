import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

type SkeletonProps = {
  height?: string | number;
  width?: string | number;
  radius?: string | number;
  style?: ViewStyle;
};

function parseDimension(value?: string | number): number | `${number}%` {
  if (typeof value === "string") {
    if (value.endsWith("px")) return parseFloat(value);
    if (value.endsWith("%")) return value as `${number}%`;
    return parseFloat(value); // fallback for other strings
  }
  return value ?? 0;
}

export default function Skeleton({
  height = 32,
  width = 100,
  radius = 8,
  style,
}: SkeletonProps) {
  const skeletonStyle: ViewStyle = {
    ...(height !== undefined && { height: parseDimension(height) }),
    ...(width !== undefined && { width: parseDimension(width) }),
    ...(radius !== undefined && { borderRadius: parseDimension(radius) }),
  };

  return (
    <View
      style={[
        styles.skeleton,
        skeletonStyle,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E1E9EE',
    opacity: 0.7,
  },
});
