import { ThemedText as Text } from "@/components/ui/ThemedText";

import { ThemedButton as Button } from "@/components/ui/ThemedButton";
import { Position } from "@/types/zplClient";
import { BTC_DECIMALS } from "@/utils/constant";
import { formatValue } from "@/utils/format";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { satoshiToBtc } from "@/bitcoin";
import Icon from "@/components/ui/Icons";
import { useTheme } from "@/hooks/theme/useTheme";
import { getEstimatedLockToColdTransactionFee } from "@/utils/interaction";
import DepositModal from "../Modals/Deposit";
import RedeemModal from "../Modals/Redeem";

const PortfolioDetails = ({
  btcPrice,
  btcBalance,
  positions,
  zbtcBalance,
  zbtcBalanceInVault,
  signPsbt,
  feeRate,
}: {
  btcPrice: number;
  btcBalance: number;
  positions: Position[] | undefined;
  zbtcBalance: BigNumber;
  zbtcBalanceInVault: BigNumber;
  signPsbt: (psbt: any) => Promise<string>;
  feeRate: number;
}) => {
  const [provideAmountValue, setProvideAmountValue] = useState("");
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const { theme } = useTheme();

  const estimatedLockToColdFeeInSatoshis =
  getEstimatedLockToColdTransactionFee(feeRate);

const estimatedLockToColdFeeInBtc = satoshiToBtc(
  estimatedLockToColdFeeInSatoshis
);

  const provideAmount = parseFloat(provideAmountValue) || 0;

  const resetProvideAmountValue = () => {
    setProvideAmountValue("");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#121212' : '#fff' }]}>
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

      {/* BTC Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}><Text style={{ fontWeight: "bold" }}>BTC</Text></Text>
        <View style={styles.row}>
          <Icon name="btc" size={18} />
          <Text style={styles.balanceText}>
            {btcBalance > 0 ? formatValue(btcBalance / 10 ** BTC_DECIMALS, 6) : 0}{" "}
            <Text style={styles.tokenText}>BTC</Text>
          </Text>
         
        </View>
        <Text style={styles.usdText}>
          ~${btcBalance > 0
            ? formatValue((btcBalance / 10 ** BTC_DECIMALS) * btcPrice, 2)
            : 0} USD
        </Text>
        <Button
          style={{ zIndex: 10 }}
          title="Deposit"
          onPress={() => {
            setIsDepositModalOpen(true);
            console.log("[PortfolioDetails] Deposit button pressed");
          }}
        />
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
          onPress={() => {
            setIsRedeemModalOpen(true);
            console.log("[PortfolioDetails] Redeem button pressed");
          }}
        />
      </View>

      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        btcPrice={btcPrice}
        balance={btcBalance > 0 ? btcBalance / 10 ** BTC_DECIMALS : 0}
        max={btcBalance > 0 ? btcBalance / 10 ** BTC_DECIMALS : 0}
        minerFee={feeRate}
        setAssetFromAmount={setProvideAmountValue}
        assetFrom={{ name: "BTC", amount: provideAmountValue, isLocked: true }}
        assetTo={{ name: "zBTC", amount: provideAmount - estimatedLockToColdFeeInBtc > 0 ? formatValue(provideAmount - estimatedLockToColdFeeInBtc, 6) : "0", isLocked: false }}
        isDepositAll={false}
        signPsbt={signPsbt}
        updateTransactions={async () => { }}
        resetProvideAmountValue={resetProvideAmountValue}
      />

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
    padding: 12,
    gap: 32,
    paddingBottom: 100,
  },
  card: {
    borderRadius: 15,
    padding: 16,
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
