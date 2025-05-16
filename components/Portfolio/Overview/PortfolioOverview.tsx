import { BigNumber } from "bignumber.js";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from "react-native";

import useBalance from "@/hooks/misc/useBalance";
import usePrice from "@/hooks/misc/usePrice";
import usePositions from "@/hooks/zpl/usePositions";
import { isMobile } from "@/utils/misc";

import SwapToSolanaToken from "@/components/Swap/SwapInput";
import { useBitcoinWallet } from "@/contexts/BitcoinWalletProvider";
import { useSolanaWallet } from "@/contexts/SolanaWalletProvider";
import { useHoldings } from "@/hooks/misc/useHoldings";
import { useTbtcBalance } from "@/hooks/misc/useTbtcBalance";
import { useTheme } from "@/hooks/theme/useTheme";
import { SOLANA_TX_FEE_IN_LAMPORT } from "@/utils/constant";
import { notifyWarning } from "@/utils/notification";
import PortfolioBalance from "./PortfolioBalance";
import PortfolioDetails from "./PortfolioDetails";

export default function PortfolioOverview() {
  const { publicKey: solanaPubkey } = useSolanaWallet();
  const { wallet: bitcoinWallet, signPsbt } = useBitcoinWallet();
  const { nativeBalance, refetch: refetchNativeBalance } = useHoldings(solanaPubkey!);
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
      refetchNativeBalance?.(),
    ]);
    setRefreshing(false);
  }, [refetchBtcPrice, refetchTbtcBalance, refetchZbtcBalance, refetchPositions, refetchNativeBalance]);

  const zbtcBalanceInVault =
    positions?.reduce(
      (acc, cur) =>
        acc
          .plus(cur.storedAmount.toString())
          .minus(cur.frozenAmount.toString()),
      new BigNumber(0)
    ) ?? new BigNumber(0);

  useEffect(() => {
    if (nativeBalance.lamports < SOLANA_TX_FEE_IN_LAMPORT) {
      notifyWarning("Insufficient balance to create a new hot reserve bucket");
    }
  }, [nativeBalance]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme === 'dark' ? '#121212' : '#fff', paddingTop: isMobile ? "20%" : 0 }]}
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
        nativeBalance={nativeBalance}
      />
      <PortfolioDetails
        btcPrice={btcPrice}
        tbtcBalance={tbtcBalance}
        positions={positions}
        zbtcBalance={zbtcBalance}
        zbtcBalanceInVault={zbtcBalanceInVault}
        signPsbt={signPsbt}
      />
      <SwapToSolanaToken />
      <View style={{ paddingBottom: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
