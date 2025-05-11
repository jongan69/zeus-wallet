import DashboardCharts from '@/components/DashboardCharts';
import useDashboardCharts from '@/hooks/hermes/useDashboardCharts';
import useDashboardStats from '@/hooks/hermes/useDashboardStats';
import useTwoWayPegGuardianSettings from '@/hooks/hermes/useTwoWayPegGuardianSettings';
import usePrice from '@/hooks/misc/usePrice';
import { fillChartData } from '@/utils/chart';
import { BTC_DECIMALS } from '@/utils/constant';
import React, { useState } from 'react';
import { StatusBar, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';

const defaultChartData = [{ date: new Date("2024-04-04"), value: 0 }];

const getTabChartLabel = (label: string) => (
  <View style={styles?.tabItem}>
    <Text style={styles?.tabLabel}>{label}</Text>
  </View>
);

const timelineTabs = [
  { key: 'day', title: getTabChartLabel('D') },
  { key: 'week', title: getTabChartLabel('W') },
  { key: 'month', title: getTabChartLabel('M') },
  { key: 'year', title: getTabChartLabel('Y') },
  { key: 'all', title: getTabChartLabel('All') },
];

export default function DashboardPage() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(4); // default to 'All'

  const { price: btcPrice } = usePrice("BTCUSDC");
  const { data: twoWayPegGuardianSettings } = useTwoWayPegGuardianSettings();
  const { data: statsData, isLoading: isStatsLoading } = useDashboardStats(
    twoWayPegGuardianSettings.map((item) => item.address)
  );
  const { data: chartsData, isLoading: isChartsLoading } = useDashboardCharts(
    twoWayPegGuardianSettings.map((item) => item.address)
  );

  const isLoading = isStatsLoading || isChartsLoading;

  const chartProps = {
    showHourlyTimestamps: index === 0,
    isLoading,
    btcPrice,
    selectedTimeline: index,
    tvl:
      chartsData?.recentWeekDailyAmountChartData.at(-1)?.value ??
      defaultChartData[0].value,
    totalVolume: statsData ? statsData.totalVolume * btcPrice : 0,
    uniqueWallets: statsData?.totalUniqueWallets ?? 0,

    recentDayHourlyHotReserveBucketsChartData: chartsData
      ? fillChartData(chartsData.recentDayHourlyHotReserveBucketsChartData, 24, 'hour')
      : defaultChartData,

    recentWeekDailyHotReserveBucketsChartData: chartsData
      ? fillChartData(chartsData.recentWeekDailyHotReserveBucketsChartData, 7, 'day')
      : defaultChartData,

    recentMonthDailyHotReserveBucketsChartData: chartsData
      ? fillChartData(chartsData.recentMonthDailyHotReserveBucketsChartData, 31, 'day')
      : defaultChartData,

    allWeeklyHotReserveBucketsChartData: chartsData?.allWeeklyHotReserveBucketsChartData.map((data) => ({
      date: new Date(data.time * 1000),
      value: data.value,
    })) ?? defaultChartData,

    recentDayHourlyVolumeChartData: chartsData
      ? fillChartData(chartsData.recentDayHourlyVolumeChartData, 24, 'hour', btcPrice)
      : defaultChartData,

    recentWeekDailyVolumeChartData: chartsData
      ? fillChartData(chartsData.recentWeekDailyVolumeChartData, 7, 'day', btcPrice)
      : defaultChartData,

    recentMonthDailyVolumeChartData: chartsData
      ? fillChartData(chartsData.recentMonthDailyVolumeChartData, 31, 'day', btcPrice)
      : defaultChartData,

    allWeeklyVolumeChartData: chartsData?.allWeeklyVolumeChartData.map((data) => ({
      date: new Date(data.time * 1000),
      value: (data.value / 10 ** BTC_DECIMALS) * btcPrice,
    })) ?? defaultChartData,

    recentDayHourlyAmountChartData: chartsData?.recentDayHourlyAmountChartData.map((data) => ({
      date: new Date(data.time * 1000),
      value: (data.value / 10 ** BTC_DECIMALS) * btcPrice,
    })) ?? defaultChartData,

    recentWeekDailyAmountChartData: chartsData?.recentWeekDailyAmountChartData.map((data) => ({
      date: new Date(data.time * 1000),
      value: (data.value / 10 ** BTC_DECIMALS) * btcPrice,
    })) ?? defaultChartData,

    recentMonthDailyAmountChartData: chartsData?.recentMonthDailyAmountChartData.map((data) => ({
      date: new Date(data.time * 1000),
      value: (data.value / 10 ** BTC_DECIMALS) * btcPrice,
    })) ?? defaultChartData,

    allWeeklyAmountChartData: chartsData?.allWeeklyAmountChartData.map((data) => ({
      date: new Date(data.time * 1000),
      value: (data.value / 10 ** BTC_DECIMALS) * btcPrice,
    })) ?? defaultChartData,
  };

  const renderScene = SceneMap({
    day: () => <DashboardCharts {...chartProps} />,
    week: () => <DashboardCharts {...chartProps} />,
    month: () => <DashboardCharts {...chartProps} />,
    year: () => <DashboardCharts {...chartProps} />,
    all: () => <DashboardCharts {...chartProps} />,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <TabView
        navigationState={{ index, routes: timelineTabs }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        style={styles.tabView}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 24,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  tabItem: {
    padding: 12,
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabView: {
    flex: 1,
  },
});
