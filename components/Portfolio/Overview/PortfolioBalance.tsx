import Icon from "@/components/ui/Icons";
import { ThemedText as Text } from "@/components/ui/ThemedText";
import { BTC_DECIMALS } from "@/utils/constant";
import { formatValue } from "@/utils/format";
import { BigNumber } from "bignumber.js";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import PortfolioPieChart from "./PortfolioPieChart";

const { width } = Dimensions.get("window");

const PortfolioBalance = ({
  btcPrice,
  zbtcBalance,
  zbtcBalanceInVault,
}: {
  btcPrice: number;
  zbtcBalance: BigNumber;
  zbtcBalanceInVault: BigNumber;
}) => {
  const totalBalance = zbtcBalance.plus(zbtcBalanceInVault ?? new BigNumber(0));
  const { theme } = useTheme();

  // Theme-aware colors
  const backgroundColor = theme === 'dark' ? '#121212' : '#fff';
  const borderColor = theme === 'dark' ? '#23272F' : '#E3EAFE';
  const availableDotColor = theme === 'dark' ? '#6C8BFA' : '#546CF1';
  const custodialDotColor = theme === 'dark' ? '#23272F' : '#F8F9FB';
  const custodialDotBorderColor = theme === 'dark' ? '#3A4250' : '#C7D9FE';
  const textColor = theme === 'dark' ? '#F8F9FB' : '#23272F';

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[styles.outerContainer, { backgroundColor }]}>
        <View style={[styles.innerContainer, { backgroundColor, borderColor }]}>
          <View style={styles.contentContainer}>
            {/* Total Balance */}
            <View style={styles.balanceSection}>
              <Text style={[styles.balanceTitle, { color: textColor }]}><Text type="defaultSemiBold">Total Balance</Text></Text>
              <View style={styles.balanceRow}>
                <View style={styles.balanceIconRow}>
                  <Icon name="zbtc" size={18} />
                  <Text style={[styles.balanceValue, { color: textColor }]}>
                    <Text style={styles.balanceValueNumber}>
                      {totalBalance.gt(0)
                        ? formatValue(totalBalance.div(10 ** BTC_DECIMALS), 6)
                        : 0}
                    </Text>{" "}zBTC
                  </Text>
                </View>
                <Text style={[styles.usdValue, { color: textColor }]}>
                  ~$ {totalBalance.gt(0)
                    ? formatValue(
                        totalBalance
                          .div(10 ** BTC_DECIMALS)
                          .multipliedBy(btcPrice),
                        2
                      )
                    : 0} USD
                </Text>
              </View>
            </View>

            {/* Pie Chart and Key */}
            <View style={styles.chartAndKeyRow}>
              <PortfolioPieChart
                percentFilled={
                  totalBalance.gt(0)
                    ? zbtcBalance.div(totalBalance).multipliedBy(100).toNumber()
                    : 0
                }
              />
              <View style={styles.keyContainer}>
                {/* Available */}
                <View style={styles.keyRow}>
                  <View style={styles.keyLabelRow}>
                    <View style={[styles.availableDot, { backgroundColor: availableDotColor }]} />
                    <Text style={[styles.keyLabel, { color: textColor }]}>Available</Text>
                  </View>
                  <Text style={[styles.keyPercent, { color: textColor }]}>
                    {totalBalance.gt(0)
                      ? formatValue(
                          zbtcBalance.div(totalBalance).multipliedBy(100),
                          0
                        )
                      : "0"}
                    %
                  </Text>
                </View>
                {/* Custodial */}
                <View style={styles.keyRow}>
                  <View style={styles.keyLabelRow}>
                    <View style={[styles.custodialDot, { backgroundColor: custodialDotColor, borderColor: custodialDotBorderColor }]} />
                    <Text style={[styles.keyLabel, { color: textColor }]}>Custodial</Text>
                  </View>
                  <Text style={[styles.keyPercent, { color: textColor }]}>
                    {totalBalance.gt(0)
                      ? formatValue(
                          zbtcBalanceInVault.div(totalBalance).multipliedBy(100)
                        )
                      : "0"}
                    %
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderRadius: 25,
    minHeight: 200,
    paddingBottom: 16,
  },
  innerContainer: {
    borderWidth: 1,
    borderColor: "#E3EAFE", // fallback for apollo-border-15
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: "100%",
    maxWidth: width > 500 ? 475 : width - 32,
  },
  contentContainer: {
    flexDirection: "column",
    gap: 24,
  },
  balanceSection: {
    flexDirection: "column",
    gap: 8,
    marginBottom: 16,
  },
  balanceTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    flexWrap: "wrap",
  },
  balanceIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  balanceValue: {
    fontSize: 22,
    fontWeight: "bold",
  },
  balanceValueNumber: {
    fontSize: 22,
    fontWeight: "bold",
  },
  usdValue: {
    fontSize: 15,
    marginTop: 2,
  },
  chartAndKeyRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 16,
    marginTop: 16,
    flexWrap: "wrap",
  },
  keyContainer: {
    flexDirection: "column",
    gap: 12,
    marginLeft: 0,
    width: "100%",
  },
  keyRow: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginBottom: 12,
    width: "100%",
  },
  keyLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  availableDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#546CF1",
    marginRight: 6,
  },
  custodialDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#F8F9FB",
    borderWidth: 1,
    borderColor: "#C7D9FE",
    marginRight: 6,
  },
  keyLabel: {
    fontSize: 15,
  },
  keyPercent: {
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 18,
  },
});

export default PortfolioBalance;
