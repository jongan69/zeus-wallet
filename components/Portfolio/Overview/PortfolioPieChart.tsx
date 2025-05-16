import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

const SIZE = 180;
const STROKE_WIDTH = 24;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CENTER = SIZE / 2;
// const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  const d = [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
  return d;
}

const PortfolioPieChart = ({ percentFilled }: { percentFilled: number }) => {
  console.log("[PortfolioPieChart] percentFilled", percentFilled);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const targetAngle = Math.max(0, Math.min(percentFilled, 100)) * 3.6;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: targetAngle,
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [targetAngle, animatedValue]);

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE}>
        {/* Background Circle */}
        <Path
          d={describeArc(CENTER, CENTER, RADIUS, 0, 359.99)}
          stroke="#E3EAFE"
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        {/* Animated Pie Arc */}
        <AnimatedArc
          center={CENTER}
          radius={RADIUS}
          strokeWidth={STROKE_WIDTH}
          color="#546CF1"
          animatedAngle={animatedValue}
        />
      </Svg>
      {/* Optional: Add a glow or shadow effect here if desired */}
    </View>
  );
};

function AnimatedArc({ center, radius, strokeWidth, color, animatedAngle }: {
  center: number;
  radius: number;
  strokeWidth: number;
  color: string;
  animatedAngle: Animated.Value;
}) {
  const [arc, setArc] = React.useState(describeArc(center, center, radius, 0, 0.01));

  useEffect(() => {
    const id = animatedAngle.addListener(({ value }) => {
      setArc(describeArc(center, center, radius, 0, value < 0.01 ? 0.01 : value));
    });
    return () => animatedAngle.removeListener(id);
  }, [animatedAngle, center, radius]);

  return (
    <Path
      d={arc}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      fill="none"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    alignItems: "center",
    justifyContent: "center",
    // Optionally add a shadow or glow here
  },
});

export default PortfolioPieChart; 