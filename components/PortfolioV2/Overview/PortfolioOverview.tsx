import { BigNumber } from "bignumber.js";
import React from "react";
import { StyleSheet, View } from "react-native";

import useBalance from "@/hooks/misc/useBalance";
import usePrice from "@/hooks/misc/usePrice";
import usePositions from "@/hooks/zpl/usePositions";

import { useSolanaWallet } from "@/contexts/SolanaWalletProvider";
import PortfolioBalance from "./PortfolioBalance";
import PortfolioDetails from "./PortfolioDetails";

export default function PortfolioOverview() {
  const { publicKey: solanaPubkey } = useSolanaWallet();
  const { price: btcPrice } = usePrice("BTCUSDC");
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
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <PortfolioBalance
          btcPrice={btcPrice}
          zbtcBalance={zbtcBalance}
          zbtcBalanceInVault={zbtcBalanceInVault}
        />
        <PortfolioDetails
          btcPrice={btcPrice}
          positions={positions}
          zbtcBalance={zbtcBalance}
          zbtcBalanceInVault={zbtcBalanceInVault}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F8F9FB",
  },
  innerContainer: {
    flex: 1,
    flexDirection: "column",
    gap: 24,
  },
});
