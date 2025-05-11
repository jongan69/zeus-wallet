import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

import { Position } from "@/types/zplClient";
import { BTC_DECIMALS } from "@/utils/constant";
import { formatValue } from "@/utils/format";

import RedeemModal from "../Modals/Redeem";
import Icon from "@/components/ui/Icons";

const PortfolioDetails = ({
  btcPrice,
  positions,
  zbtcBalance,
  zbtcBalanceInVault,
}: {
  btcPrice: number;
  positions: Position[] | undefined;
  zbtcBalance: BigNumber;
  zbtcBalanceInVault: BigNumber;
}) => {
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);

  // const defiRef = useRef<HTMLDivElement>(null);
  // const redeemRef = useRef<HTMLDivElement>(null);

  return (
    <View style={styles.container}>
      {/* Available Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}><Text style={{ fontWeight: "bold" }}>Available</Text></Text>
        <View style={styles.row}>
          <Icon name="zbtc" size={18} />
          <Text style={styles.balanceText}>
            {zbtcBalance.gt(0) ? formatValue(zbtcBalance.div(10 ** BTC_DECIMALS), 6) : 0}{" "}
            <Text style={styles.tokenText}>zBTC</Text>
          </Text>
        </View>
        <Text style={styles.usdText}>
          ~${zbtcBalance.gt(0)
            ? formatValue(zbtcBalance.div(10 ** BTC_DECIMALS).multipliedBy(btcPrice), 2)
            : 0} USD
        </Text>
      </View>

      {/* Custodial Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}><Text style={{ fontWeight: "bold" }}>Custodial</Text></Text>
        <View style={styles.row}>
          <Icon name="zbtc" size={18} />
          <Text style={styles.balanceText}>
            {zbtcBalanceInVault.gt(0) ? formatValue(zbtcBalanceInVault.div(10 ** BTC_DECIMALS), 6) : 0}{" "}
            <Text style={styles.tokenText}>zBTC</Text>
          </Text>
          <Icon name="Lock" size={18} />
        </View>
        <Text style={styles.usdText}>
          ~${zbtcBalanceInVault.gt(0)
            ? formatValue(zbtcBalanceInVault.div(10 ** BTC_DECIMALS).multipliedBy(btcPrice), 2)
            : 0} USD
        </Text>
        <Button
          title="Redeem"
          onPress={() => setIsRedeemModalOpen(true)}
        />
      </View>

      <RedeemModal
        isOpen={isRedeemModalOpen}
        onClose={() => setIsRedeemModalOpen(false)}
        btcPrice={btcPrice}
        positions={positions}
        balance={zbtcBalanceInVault.div(10 ** BTC_DECIMALS).toNumber()}
        max={zbtcBalanceInVault.div(10 ** BTC_DECIMALS).toNumber()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 32,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 17,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  balanceText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  tokenText: {
    fontSize: 18,
    color: "#888",
  },
  usdText: {
    fontSize: 16,
    color: "#333",
  },
});

export default PortfolioDetails;
