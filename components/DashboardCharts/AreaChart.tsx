import { max, min } from "d3-array";
import { scaleLinear, scaleTime } from "d3-scale";
import { curveMonotoneX, line as d3_line, area as d3area } from "d3-shape";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from "react-native-svg";

import { ChartDataPoint } from "@/types/chart";


const CHART_WIDTH = 350;
const CHART_HEIGHT = 200;
const MARGIN = 32;

export function AreaChart({
  data,
  theme = "primary",
  btcPrice,
  showHourlyTimestamps = false,
  showDecimals = true,
}: {
  data: ChartDataPoint[];
  theme?: "primary" | "secondary";
  btcPrice?: number;
  showHourlyTimestamps?: boolean;
  showDecimals?: boolean;
}) {
  const xScale = scaleTime()
    .domain([data[0].date, data[data.length - 1].date])
    .range([MARGIN, CHART_WIDTH - MARGIN]);

  const maxValue = max(data.map((d) => d.value)) ?? 0;
  const minValue = min(data.map((d) => d.value)) ?? 0;

  const dataRange = maxValue - minValue;
  const yScale = scaleLinear()
    .domain([0, max(data.map((d) => d.value)) ?? 0])
    .range([CHART_HEIGHT - MARGIN, MARGIN]);

  const line = d3_line<ChartDataPoint>()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.value))
    .curve(curveMonotoneX);

  const d = line(data);

  // Tooltip state
  const [tooltip, setTooltip] = useState<null | { x: number; y: number; d: ChartDataPoint }>(null);

  if (!d) {
    return null;
  }

  const area = d3area<ChartDataPoint>()
    .x((d) => xScale(d.date))
    .y0(yScale(0))
    .y1((d) => yScale(d.value))
    .curve(curveMonotoneX);

  const areaPath = area(data) ?? "";

  const isSmallRange = dataRange / maxValue < 0.01;

  const getDecimalPlaces = (min: number, max: number): number => {
    const range = max - min;
    if (range === 0) return showDecimals ? 1 : 0;

    // For very small ranges relative to the values, show more decimal places
    if (isSmallRange) return 3;
    if (range < 0.1) return 3;
    if (range < 1) return 2;
    return showDecimals ? 1 : 0;
  };

  const getNiceMaxValue = (value: number, min: number): number => {
    if (isSmallRange) {
      // For small ranges, add a small percentage to ensure max is above all data points
      return value + (value - min) * 0.1;
    }

    const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
    const ratio = value / magnitude;

    if (ratio < 1.1) return magnitude;
    if (ratio < 1.5) return 1.5 * magnitude;
    if (ratio < 2) return 2 * magnitude;
    if (ratio < 2.5) return 2.5 * magnitude;
    if (ratio < 3) return 3 * magnitude;
    if (ratio < 4) return 4 * magnitude;
    if (ratio < 5) return 5 * magnitude;
    return 10 * magnitude;
  };

  const getNiceMinValue = (min: number, max: number): number => {
    if (min === max) return min * 0.9; // If min equals max, return slightly lower value

    if (isSmallRange) {
      // For small ranges, subtract a small percentage to ensure min is below all data points
      return min - (max - min) * 0.1;
    }

    // For normal ranges, we can start from 0 if min is close to 0
    if (min / maxValue < 0.1) return 0;

    // Otherwise, round down to a nice value
    const magnitude = Math.pow(10, Math.floor(Math.log10(min)));
    return Math.floor(min / magnitude) * magnitude;
  };

  const niceMax = getNiceMaxValue(maxValue, minValue);
  const niceMin = getNiceMinValue(minValue, maxValue);

  const formatNumber = (value: number): string => {
    const decimalPlaces = getDecimalPlaces(niceMin, niceMax);

    // Format numbers without showing decimal places if they're all zeros
    const formatWithOptionalDecimals = (num: number): string => {
      // First format to the specified decimal places
      const formatted = num.toFixed(decimalPlaces);

      // Check if all digits after decimal point are zeros
      if (decimalPlaces > 0 && !/\.0+$/.test(formatted)) {
        // If not all zeros, keep the original format
        return formatted;
      }

      // If all zeros, remove decimal point and trailing zeros
      return Math.round(num).toString();
    };

    if (value >= 1_000_000_000) {
      return `${formatWithOptionalDecimals(value / 1_000_000_000)}B`;
    } else if (value >= 1_000_000) {
      return `${formatWithOptionalDecimals(value / 1_000_000)}M`;
    } else if (value >= 1_000) {
      return `${formatWithOptionalDecimals(value / 1_000)}K`;
    } else {
      return formatWithOptionalDecimals(value);
    }
  };

  // X axis ticks (show 7 evenly spaced)
  const numDatesToShow = 7;
  const interval = Math.max(1, Math.floor((data.length - 1) / (numDatesToShow - 1)));
  const indicesToShow = Array.from({ length: numDatesToShow }, (_, i) =>
    Math.min(data.length - 1, Math.round(i * interval))
  );

  return (
    <View style={styles.container}>
      {/* Y axis labels */}
      <View style={styles.yAxis}>
        {yScale.ticks(6).map((tick, i) => (
          <Text
            key={i}
            style={[
              styles.yAxisLabel,
              { top: yScale(tick) - 8, color: "#888" },
            ]}
          >
            {formatNumber(tick)}
          </Text>
        ))}
      </View>
      {/* Chart */}
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        <Defs>
          <LinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={theme === "primary" ? "#6366f1" : "#f59e42"} stopOpacity={0.2} />
            <Stop offset="100%" stopColor={theme === "primary" ? "#6366f1" : "#f59e42"} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        {/* Grid lines */}
        {yScale.ticks(6).map((tick, i) => (
          <Line
            key={i}
            x1={MARGIN}
            x2={CHART_WIDTH - MARGIN}
            y1={yScale(tick)}
            y2={yScale(tick)}
            stroke="#eee"
            strokeWidth={1}
          />
        ))}
        {/* Area */}
        <Path d={areaPath} fill="url(#areaGradient)" />
        {/* Line */}
        <Path d={d} stroke={theme === "primary" ? "#6366f1" : "#f59e42"} strokeWidth={2} fill="none" />
        {/* Circles for data points */}
        {data.map((d, i) => (
          <TouchableOpacity
            key={i}
            activeOpacity={0.7}
            onPress={() => setTooltip({ x: xScale(d.date), y: yScale(d.value), d })}
            style={{ position: "absolute", left: xScale(d.date) - 12, top: yScale(d.value) - 12, width: 24, height: 24 }}
          >
            <Circle
              cx={xScale(d.date)}
              cy={yScale(d.value)}
              r={4}
              fill={theme === "primary" ? "#6366f1" : "#f59e42"}
              stroke="#fff"
              strokeWidth={2}
            />
          </TouchableOpacity>
        ))}
      </Svg>
      {/* X axis labels */}
      <View style={styles.xAxis}>
        {indicesToShow.map((i) => (
          <Text key={i} style={styles.xAxisLabel}>
            {data[i].date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </Text>
        ))}
      </View>
      {/* Tooltip Modal */}
      <Modal visible={!!tooltip} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setTooltip(null)}>
          {tooltip && (
            <View style={[styles.tooltip, { left: tooltip.x, top: tooltip.y }]}>
              <Text style={{ color: "#333" }}>
                {tooltip.d.date.toLocaleString()}
              </Text>
              <Text style={{ color: "#6366f1", fontWeight: "bold" }}>
                {formatNumber(tooltip.d.value)}
              </Text>
              {btcPrice && (
                <Text style={{ color: "#f59e42" }}>
                  {(tooltip.d.value / btcPrice).toFixed(6)} BTC
                </Text>
              )}
            </View>
          )}
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: CHART_WIDTH, height: CHART_HEIGHT + 40, backgroundColor: "#fff" },
  yAxis: { position: "absolute", left: 0, top: 0, width: MARGIN, height: CHART_HEIGHT, zIndex: 1 },
  yAxisLabel: { position: "absolute", left: 0, fontSize: 12 },
  xAxis: { flexDirection: "row", justifyContent: "space-between", marginTop: 4, marginLeft: MARGIN, marginRight: MARGIN },
  xAxisLabel: { fontSize: 12, color: "#888" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.1)", justifyContent: "center", alignItems: "center" },
  tooltip: { backgroundColor: "#fff", padding: 12, borderRadius: 8, elevation: 4, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 4 },
});
