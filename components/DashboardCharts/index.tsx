import { ChartDataPoint } from "@/types/chart";
import { SECONDS_PER_DAY } from "@/utils/constant";
import { formatValue } from "@/utils/format";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { AreaChart } from "./AreaChart";

type DashboardChartsProps = {
  isLoading: boolean;
  btcPrice: number;
  selectedTimeline: number;
  tvl: number;
  totalVolume: number;
  uniqueWallets: number;
  recentDayHourlyHotReserveBucketsChartData: ChartDataPoint[];
  recentWeekDailyHotReserveBucketsChartData: ChartDataPoint[];
  recentMonthDailyHotReserveBucketsChartData: ChartDataPoint[];
  allWeeklyHotReserveBucketsChartData: ChartDataPoint[];
  recentDayHourlyVolumeChartData: ChartDataPoint[];
  recentWeekDailyVolumeChartData: ChartDataPoint[];
  recentMonthDailyVolumeChartData: ChartDataPoint[];
  allWeeklyVolumeChartData: ChartDataPoint[];
  recentDayHourlyAmountChartData: ChartDataPoint[];
  recentWeekDailyAmountChartData: ChartDataPoint[];
  recentMonthDailyAmountChartData: ChartDataPoint[];
  allWeeklyAmountChartData: ChartDataPoint[];
  showHourlyTimestamps: boolean;
};

export default function DashboardCharts({
  isLoading,
  btcPrice,
  selectedTimeline,
  tvl,
  totalVolume,
  uniqueWallets,
  recentDayHourlyHotReserveBucketsChartData,
  recentWeekDailyHotReserveBucketsChartData,
  recentMonthDailyHotReserveBucketsChartData,
  allWeeklyHotReserveBucketsChartData,
  recentDayHourlyVolumeChartData,
  recentWeekDailyVolumeChartData,
  recentMonthDailyVolumeChartData,
  allWeeklyVolumeChartData,
  recentDayHourlyAmountChartData,
  recentWeekDailyAmountChartData,
  recentMonthDailyAmountChartData,
  allWeeklyAmountChartData,
  showHourlyTimestamps,
}: DashboardChartsProps) {
  const tvlChartDataMap: Record<number, ChartDataPoint[]> = {
    0: recentDayHourlyAmountChartData,
    1: recentWeekDailyAmountChartData,
    2: recentMonthDailyAmountChartData,
    3: allWeeklyAmountChartData.filter(
      (point) =>
        point.date >= new Date(Date.now() - SECONDS_PER_DAY * 365 * 1000)
    ),
    4: allWeeklyAmountChartData,
  };

  const volumeChartDataMap: Record<number, ChartDataPoint[]> = {
    0: recentDayHourlyVolumeChartData,
    1: recentWeekDailyVolumeChartData,
    2: recentMonthDailyVolumeChartData,
    3: allWeeklyVolumeChartData.filter(
      (point) =>
        point.date >= new Date(Date.now() - SECONDS_PER_DAY * 365 * 1000)
    ),
    4: allWeeklyVolumeChartData,
  };

  const hotReserveBucketsChartDataMap: Record<number, ChartDataPoint[]> = {
    0: recentDayHourlyHotReserveBucketsChartData,
    1: recentWeekDailyHotReserveBucketsChartData,
    2: recentMonthDailyHotReserveBucketsChartData,
    3: allWeeklyHotReserveBucketsChartData.filter(
      (point) =>
        point.date >= new Date(Date.now() - SECONDS_PER_DAY * 365 * 1000)
    ),
    4: allWeeklyHotReserveBucketsChartData,
  };

  return (
    <ScrollView style={styles.container}>
      {/* Total Value Locked */}
      <View style={styles.card}>
        <Text style={styles.title}>Total Value Locked</Text>
        {isLoading ? (
          <View style={styles.skeleton} />
        ) : (
          <View style={styles.row}>
            <Text style={styles.value}>${formatValue(tvl, 0)}</Text>
            <View style={styles.row}>
              <Text style={styles.secondaryValue}>
                {formatValue(tvl / btcPrice, 2)} BTC
              </Text>
            </View>
          </View>
        )}
        <View style={styles.chartContainer}>
          <AreaChart
            data={tvlChartDataMap[selectedTimeline]}
            theme="primary"
            btcPrice={btcPrice}
            showHourlyTimestamps={showHourlyTimestamps}
          />
        </View>
      </View>

      {/* Total Volume */}
      <View style={styles.card}>
        <Text style={styles.title}>Total Volume</Text>
        {isLoading ? (
          <View style={styles.skeleton} />
        ) : (
          <View style={styles.row}>
            <Text style={styles.value}>${formatValue(totalVolume, 0)}</Text>
            <View style={styles.row}>
              <Text style={styles.secondaryValue}>
                {formatValue(totalVolume / btcPrice, 2)} BTC
              </Text>
            </View>
          </View>
        )}
        <View style={styles.chartContainer}>
          <AreaChart
            data={volumeChartDataMap[selectedTimeline]}
            theme="secondary"
            btcPrice={btcPrice}
            showHourlyTimestamps={showHourlyTimestamps}
          />
        </View>
      </View>

      {/* Unique Wallets */}
      <View style={styles.card}>
        <Text style={styles.title}>Unique Wallets</Text>
        {isLoading ? (
          <View style={styles.skeleton} />
        ) : (
          <View style={styles.row}>
            <Text style={styles.value}>{uniqueWallets}</Text>
          </View>
        )}
        <View style={styles.chartContainer}>
          <AreaChart
            data={hotReserveBucketsChartDataMap[selectedTimeline]}
            theme="secondary"
            showHourlyTimestamps={showHourlyTimestamps}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F8F9FB",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#546CF1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#2D3A4A",
    marginBottom: 8,
  },
  value: {
    fontWeight: "bold",
    fontSize: 28,
    color: "#2D3A4A",
  },
  secondaryValue: {
    fontSize: 16,
    color: "#888",
    marginLeft: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  chartContainer: {
    height: 200,
    width: "100%",
    marginTop: 8,
  },
  skeleton: {
    height: 40,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    marginBottom: 8,
    width: "60%",
    alignSelf: "center",
  },
});
