import { BigNumber } from "bignumber.js";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import useBalance from "@/hooks/misc/useBalance";
import usePrice from "@/hooks/misc/usePrice";
import usePositions from "@/hooks/zpl/usePositions";

import { useSolanaWallet } from "@/contexts/SolanaWalletProvider";
import { useTheme } from "@/hooks/useTheme";
import PortfolioBalance from "./PortfolioBalance";
import PortfolioDetails from "./PortfolioDetails";
import { useBitcoinWallet } from "@/contexts/BitcoinWalletProvider";
import { useTbtcBalance } from "@/hooks/misc/useTbtcBalance";

export default function PortfolioOverview() {
  const { publicKey: solanaPubkey } = useSolanaWallet();
  const { wallet: bitcoinWallet } = useBitcoinWallet();
  const { theme } = useTheme();
  const { price: btcPrice } = usePrice("BTCUSDC");
  const tbtcBalance = useTbtcBalance(bitcoinWallet?.p2tr ?? "");
  const { data: zbtcBalance } = useBalance(solanaPubkey);
  const { data: positions } = usePositions(solanaPubkey);

  const zbtcBalanceInVault =
    positions?.reduce(
      (acc, cur) =>
        acc
          .plus(cur.storedAmount.toString())
          .minus(cur.frozenAmount.toString()),
      new BigNumber(0)
    ) ?? new BigNumber(0);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme === 'dark' ? '#121212' : '#fff' }]}>
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
    backgroundColor: "#F8F9FB",
  },
});
