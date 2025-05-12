import { BigNumber } from "bignumber.js";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from "react-native";

import useBalance from "@/hooks/misc/useBalance";
import usePrice from "@/hooks/misc/usePrice";
import usePositions from "@/hooks/zpl/usePositions";

import { useBitcoinWallet } from "@/contexts/BitcoinWalletProvider";
import { useSolanaWallet } from "@/contexts/SolanaWalletProvider";
import { useTbtcBalance } from "@/hooks/misc/useTbtcBalance";
import { useTheme } from "@/hooks/useTheme";
import PortfolioBalance from "./PortfolioBalance";
import PortfolioDetails from "./PortfolioDetails";

export default function PortfolioOverview() {
  const { publicKey: solanaPubkey } = useSolanaWallet();
  const { wallet: bitcoinWallet } = useBitcoinWallet();
  const { theme } = useTheme();
  const { price: btcPrice, mutate: refetchBtcPrice } = usePrice("BTCUSDC");
  const [tbtcBalance, refetchTbtcBalance] = useTbtcBalance(bitcoinWallet?.p2tr ?? "");
  const { data: zbtcBalance, mutate: refetchZbtcBalance } = useBalance(solanaPubkey);
  const { data: positions, mutate: refetchPositions } = usePositions(solanaPubkey);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      refetchBtcPrice?.(),
      refetchTbtcBalance?.(),
      refetchZbtcBalance?.(),
      refetchPositions?.(),
    ]);
    setRefreshing(false);
  }, [refetchBtcPrice, refetchTbtcBalance, refetchZbtcBalance, refetchPositions]);

  const zbtcBalanceInVault =
    positions?.reduce(
      (acc, cur) =>
        acc
          .plus(cur.storedAmount.toString())
          .minus(cur.frozenAmount.toString()),
      new BigNumber(0)
    ) ?? new BigNumber(0);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme === 'dark' ? '#121212' : '#fff' }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {refreshing && (
        <View style={{ alignItems: "center", marginBottom: 12 }}>
          <ActivityIndicator size="small" color={theme === 'dark' ? "#fff" : "#000"} />
        </View>
      )}
      <PortfolioBalance
        btcPrice={btcPrice}
        zbtcBalance={zbtcBalance}
        zbtcBalanceInVault={zbtcBalanceInVault}
      />
      <PortfolioDetails
        btcPrice={btcPrice}
        tbtcBalance={tbtcBalance}
        positions={positions}
        zbtcBalance={zbtcBalance}
        zbtcBalanceInVault={zbtcBalanceInVault}
      />
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: "20%",
  },
});
