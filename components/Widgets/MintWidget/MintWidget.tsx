import "../../../polyfills";

// import React, { useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";


// import { useBitcoinWallet } from "@/contexts/BitcoinWalletProvider";
// import useDepositInteractionsWithCache from "@/hooks/hermes/useDepositInteractionsWithCache";
// import useInteractions from "@/hooks/hermes/useInteractions";
// import useBalance from "@/hooks/misc/useBalance";
// import usePrice from "@/hooks/misc/usePrice";
// import usePositions from "@/hooks/zpl/usePositions";
// import { InteractionStatus, InteractionType } from "@/types/api";


// Custom hook to encapsulate all MintWidget data and logic
// function useMintWidgetData() {
//   const { price: btcPrice } = usePrice("BTCUSDC");
//   const { publicKey: solanaPubkey, isAuthenticated: solanaWalletConnected } = useSolanaWallet();
//   const { wallet: bitcoinWallet, connected: bitcoinWalletConnected, signPsbt } = useBitcoinWallet();
//   const depositCacheParams = useMemo(() => ({
//     solanaAddress: solanaPubkey?.toBase58(),
//     bitcoinXOnlyPubkey: bitcoinWallet
//       ? toXOnly(Buffer.from(bitcoinWallet.pubkey, "hex")).toString("hex")
//       : undefined,
//   }), [solanaPubkey, bitcoinWallet]);
//   console.log('useMintWidgetData: depositCacheParams', depositCacheParams);
//   const { cachedUtxos, mutate: mutateDepositTransactions } =
//     useDepositInteractionsWithCache(depositCacheParams);
//   const interactionParams = useMemo(() => ({
//     solanaAddress: solanaPubkey?.toBase58(),
//     types: [InteractionType.Withdrawal],
//     statuses: [
//       InteractionStatus.AddWithdrawalRequest,
//       InteractionStatus.AddUnlockToUserProposal,
//       InteractionStatus.BitcoinUnlockToUser,
//       InteractionStatus.VerifyUnlockToUserTransaction,
//       InteractionStatus.SolanaUnlockToUser,
//     ],
//   }), [solanaPubkey]);
//   console.log('useMintWidgetData: interactionParams', interactionParams);
//   const { mutate: mutateWithdrawalTransactions } = useInteractions(
//     interactionParams,
//     20
//   );
//   const {
//     data: zbtcBalance,
//     mutate: mutateZbtcBalance,
//     isLoading: isLoadingZbtcBalance,
//   } = useBalance(solanaPubkey);
//   const {
//     data: positions,
//     mutate: mutatePositions,
//     isLoading: isLoadingPositions,
//   } = usePositions(solanaPubkey);
//   const isAllConnected = solanaWalletConnected && bitcoinWalletConnected;
//   console.log('useMintWidgetData: return values', {
//     btcPrice,
//     solanaPubkey,
//     solanaWalletConnected,
//     bitcoinWallet,
//     bitcoinWalletConnected,
//     signPsbt,
//     cachedUtxos,
//     isAllConnected,
//     zbtcBalance,
//     isLoadingZbtcBalance,
//     positions,
//     isLoadingPositions,
//   });
//   return {
//     btcPrice,
//     solanaPubkey,
//     solanaWalletConnected,
//     bitcoinWallet,
//     bitcoinWalletConnected,
//     signPsbt,
//     cachedUtxos,
//     mutateDepositTransactions,
//     mutateWithdrawalTransactions,
//     zbtcBalance,
//     mutateZbtcBalance,
//     isLoadingZbtcBalance,
//     positions,
//     mutatePositions,
//     isLoadingPositions,
//     isAllConnected,
//   };
// }

export default function MintWidget() {
  // const [activeTab, setActiveTab] = useState(0);
  // const widgetRef = useRef(null);
  // const tabs = [
  //   { label: "Deposit", value: "deposit" },
  //   { label: "Withdraw", value: "withdraw" },
  // ];
  // const {
  //   btcPrice,
  //   solanaPubkey,
  //   solanaWalletConnected,
  //   bitcoinWallet,
  //   signPsbt,
  //   cachedUtxos,
  //   mutateDepositTransactions,
  //   mutateWithdrawalTransactions,
  //   zbtcBalance,
  //   mutateZbtcBalance,
  //   isLoadingZbtcBalance,
  //   positions,
  //   mutatePositions,
  //   isLoadingPositions,
  //   isAllConnected,
  // } = useMintWidgetData();
  // console.log('MintWidget render', {
  //   activeTab,
  //   btcPrice,
  //   solanaPubkey,
  //   solanaWalletConnected,
  //   bitcoinWallet,
  //   signPsbt,
  //   cachedUtxos,
  //   zbtcBalance,
  //   isLoadingZbtcBalance,
  //   positions,
  //   isLoadingPositions,
  //   isAllConnected,
  // });
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.grid}>
        {/* <InteractionsList /> */}
        {/* <View style={styles.widget} ref={widgetRef}>
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onClick={(_tabValue) => {
              console.log('Tabs onClick', _tabValue);
              setActiveTab(tabs.findIndex(t => t.value === _tabValue));
            }}
            loginRequired={false}
          />
          <View style={styles.card}>
            {activeTab === 0 && (
              <Deposit
                solanaPubkey={solanaPubkey}
                bitcoinWallet={bitcoinWallet}
                isAllConnected={isAllConnected}
                signPsbt={signPsbt}
                updateDepositTransactions={async () => {
                  console.log('Deposit: updateDepositTransactions called');
                  await mutateDepositTransactions();
                }}
                btcPrice={btcPrice}
                cachedUtxos={cachedUtxos}
              />
            )}
            {activeTab === 1 &&
              !isLoadingPositions &&
              !isLoadingZbtcBalance && (
                <Withdraw
                  solanaPubkey={solanaPubkey}
                  solanaWalletConnected={solanaWalletConnected}
                  positions={positions}
                  btcPrice={btcPrice}
                  zbtcBalance={zbtcBalance}
                  updateTransactions={async () => {
                    console.log('Withdraw: updateTransactions called');
                    await mutateWithdrawalTransactions();
                  }}
                  updateZbtcBalance={async () => {
                    console.log('Withdraw: updateZbtcBalance called');
                    await mutatePositions();
                    await mutateZbtcBalance();
                  }}
                />
              )}
          </View>
        </View> */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  grid: {
    flexDirection: "column",
    gap: 16,
  },
  widget: {
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    padding: 16,
    marginTop: 16,
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#007AFF",
  },
  tabText: {
    color: "#888",
    fontWeight: "bold",
  },
  activeTabText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
});
