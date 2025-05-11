import { BigNumber } from "bignumber.js";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Icon from "@/components/ui/Icons";
import { Colors } from "@/constants/Colors";
import { BTC_DECIMALS } from "@/utils/constant";
import { formatValue } from "@/utils/format";

import PortfolioPieChart from "./PortfolioPieChart";

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

  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <View style={styles.contentContainer}>
          {/* Total Balance */}
          <View style={styles.balanceSection}>
            <Text style={styles.balanceTitle}><Text style={{ fontWeight: "bold" }}>Total Balance</Text></Text>
            <View style={styles.balanceRow}>
              <View style={styles.balanceIconRow}>
                <Icon name="zbtc" size={18} />
                <Text style={styles.balanceValue}>
                  <Text style={styles.balanceValueNumber}>
                    {totalBalance.gt(0)
                      ? formatValue(totalBalance.div(10 ** BTC_DECIMALS), 6)
                      : 0}
                  </Text>{" "}zBTC
                </Text>
              </View>
              <Text style={styles.usdValue}>
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
                  <View style={styles.availableDot} />
                  <Text style={styles.keyLabel}>Available</Text>
                </View>
                <Text style={styles.keyPercent}>
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
                  <View style={styles.custodialDot} />
                  <Text style={styles.keyLabel}>Custodial</Text>
                </View>
                <Text style={styles.keyPercent}>
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
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderRadius: 25,
    backgroundColor: Colors.light.background,
  },
  innerContainer: {
    borderWidth: 1,
    borderColor: "#E3EAFE", // fallback for apollo-border-15
    backgroundColor: Colors.light.background,
    borderRadius: 15,
    paddingHorizontal: 32,
    paddingVertical: 28,
    width: "100%",
    maxWidth: 475,
  },
  contentContainer: {
    flexDirection: "column",
    gap: 48,
  },
  balanceSection: {
    flexDirection: "column",
    gap: 12,
    marginBottom: 24,
  },
  balanceTitle: {
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  balanceIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  balanceValue: {
    fontSize: 24,
    color: Colors.light.text,
    fontWeight: "bold",
  },
  balanceValueNumber: {
    fontSize: 24,
    color: Colors.light.text,
    fontWeight: "bold",
  },
  usdValue: {
    fontSize: 16,
    color: Colors.light.text,
    marginTop: 4,
  },
  chartAndKeyRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 32,
    marginTop: 24,
  },
  keyContainer: {
    flex: 1,
    flexDirection: "column",
    gap: 8,
    marginLeft: 24,
  },
  keyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 175,
    marginBottom: 8,
  },
  keyLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  availableDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#546CF1", // fallback for apollo-brand-primary-blue
    marginRight: 8,
  },
  custodialDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#F8F9FB", // fallback for sys-color-background-card
    borderWidth: 1,
    borderColor: "#C7D9FE",
    marginRight: 8,
  },
  keyLabel: {
    fontSize: 16,
    color: Colors.light.text,
  },
  keyPercent: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: "bold",
  },
});

export default PortfolioBalance;
