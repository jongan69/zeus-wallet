import { BigNumber } from "bignumber.js";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from "react-native";

import useBalance from "@/hooks/misc/useBalance";
import usePrice from "@/hooks/misc/usePrice";
import usePositions from "@/hooks/zpl/usePositions";
import { isMobile } from "@/utils/misc";

import { estimateMaxSpendableAmount } from "@/bitcoin";
import { useBitcoinWallet } from "@/contexts/BitcoinWalletProvider";
import { useSolanaWallet } from "@/contexts/SolanaWalletProvider";
import useBitcoinUTXOs from "@/hooks/ares/useBitcoinUTXOs";
import { useHoldings } from "@/hooks/misc/useHoldings";
import { useTheme } from "@/hooks/theme/useTheme";
import useTwoWayPegConfiguration from "@/hooks/zpl/useTwoWayPegConfiguration";
import { SOLANA_TX_FEE_IN_LAMPORT } from "@/utils/constant";
import { notifyWarning } from "@/utils/notification";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import PortfolioBalance from "./PortfolioBalance";
import PortfolioDetails from "./PortfolioDetails";

export default function PortfolioOverview() {
  const { publicKey: solanaPubkey } = useSolanaWallet();
  const { wallet: bitcoinWallet, signPsbt } = useBitcoinWallet();
  const { nativeBalance, refetch: refetchNativeBalance } = useHoldings(solanaPubkey!);
  const { theme } = useTheme();
  const { price: btcPrice, mutate: refetchBtcPrice } = usePrice("BTCUSDC");
  // const [tbtcBalance, refetchTbtcBalance] = useTbtcBalance(bitcoinWallet?.p2tr ?? "");
  const { data: bitcoinUTXOs, mutate: refetchBitcoinUTXOs } = useBitcoinUTXOs(bitcoinWallet?.p2tr);

  const { data: zbtcBalance, mutate: refetchZbtcBalance } = useBalance(solanaPubkey);
  const { data: positions, mutate: refetchPositions } = usePositions(solanaPubkey);
  const { feeRate } = useTwoWayPegConfiguration();

  const [refreshing, setRefreshing] = useState(false);
  const [spendableUTXOs, setSpendableUTXOs] = useState(() => estimateMaxSpendableAmount(bitcoinUTXOs ?? [], feeRate));

  useEffect(() => {
    setSpendableUTXOs(estimateMaxSpendableAmount(bitcoinUTXOs ?? [], feeRate));
  }, [bitcoinUTXOs, feeRate]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      refetchBtcPrice?.(),
      refetchBitcoinUTXOs?.(),
      refetchZbtcBalance?.(),
      refetchPositions?.(),
      refetchNativeBalance?.(),
    ]);
    setRefreshing(false);
  }, [refetchBtcPrice, refetchBitcoinUTXOs, refetchZbtcBalance, refetchPositions, refetchNativeBalance]);

  const zbtcBalanceInVault =
    positions?.reduce(
      (acc, cur) =>
        acc
          .plus(cur.storedAmount.toString())
          .minus(cur.frozenAmount.toString()),
      new BigNumber(0)
    ) ?? new BigNumber(0);

  useEffect(() => {
    if (nativeBalance.lamports && nativeBalance.lamports < SOLANA_TX_FEE_IN_LAMPORT) {
      notifyWarning(`Need ${new BigNumber(SOLANA_TX_FEE_IN_LAMPORT).div(LAMPORTS_PER_SOL).toFixed(6)} SOL to create a new hot reserve bucket`);
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
        btcBalance={spendableUTXOs}
        positions={positions}
        zbtcBalance={zbtcBalance}
        zbtcBalanceInVault={zbtcBalanceInVault}
        signPsbt={signPsbt}
        feeRate={feeRate}
      />
      {/* <SwapToSolanaToken /> */}
      {/* <View style={{ paddingBottom: 100 }} /> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
