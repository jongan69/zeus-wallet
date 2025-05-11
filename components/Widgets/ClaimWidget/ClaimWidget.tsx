import "../../../polyfills";

import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";

import { satoshiToBtc } from "@/bitcoin";
import { useBitcoinWallet } from "@/contexts/BitcoinWalletProvider";
import { useSolanaWallet } from "@/contexts/SolanaWalletProvider";
import { useFetchers } from "@/hooks/misc/useFetchers";
import usePersistentStore from "@/stores/persistentStore";
import useStore from "@/stores/store";
import { claimTBTCSchema } from "@/types/api";
import { createAxiosInstances } from "@/utils/axios";
import { MODAL_NAMES } from "@/utils/constant";
import { notifyError } from "@/utils/notification";

import SuccessfulClaim from "@/components/SuccessfulClaim/SuccessfulClaim";

import CardActionsFooter from "./SubComponents/CardActionsFooter";
import CardActionsHeader from "./SubComponents/CardActionsHeader";
import CardAlertList from "./SubComponents/CardAlertList";

const CLAIM_AMOUNT_LIMIT = 5000000; // satoshis

export default function ClaimWidget() {
  const { solanaNetwork, bitcoinNetwork } = usePersistentStore();
  const [claimableTimes, setClaimableTimes] = useState(5);
  const [isClaiming, setIsClaiming] = useState(false);
  const { wallet: bitcoinWallet, connected: bitcoinWalletConnected } =
    useBitcoinWallet();
  const { isAuthenticated: solanaWalletConnected } = useSolanaWallet();
  const { aegleFetcher } = useFetchers();
  const openModalByName = useStore((state) => state.openModalByName);

  // Animation (optional)
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    if (!bitcoinWallet) return;
    const fetchClaimableAmount = async () => {
      try {
        const response = await aegleFetcher(
          `api/v1/bitcoin-regtest-wallet/${bitcoinWallet.p2tr}`,
          claimTBTCSchema
        );
        if (!response) return;

        setClaimableTimes(response.remainingClaimCounts);
      } catch (error) {
        console.error("Error fetching claimable amount:", error);
      }
    };
    fetchClaimableAmount();
  }, [bitcoinWallet, aegleFetcher]);

  const handleClaim = () => {
    if (!bitcoinWallet) return;

    setIsClaiming(true);

    const { aegleApi } = createAxiosInstances(solanaNetwork, bitcoinNetwork);

    const claimUrl = `api/v1/bitcoin-regtest-wallet/${bitcoinWallet.p2tr}/claim`;

    aegleApi
      .post(claimUrl, {
        amount: CLAIM_AMOUNT_LIMIT,
      })
      .then((response) => {
        if (response.status === 200) {
          openModalByName(MODAL_NAMES.SUCCESSFUL_CLAIM);
        } else if (response.status === 429) {
          notifyError("You have reached the daily claim limit.");
        }
      })
      .catch((error) => {
        console.error("Claim error:", error);
        notifyError("Claim failed. Please try again later.");
      })
      .finally(() => {
        setIsClaiming(false);
      });
  };

  return (
    <View style={styles.claimWidget}>
      <View style={styles.claimWidgetCard}>
        <Animated.View style={[styles.cardContent, { opacity: fadeAnim }]}>
          <View style={styles.cardAlert}>
            <CardActionsHeader />
            <CardAlertList />
          </View>
          <CardActionsFooter
            claimableTimes={claimableTimes}
            claimedProgress={(claimableTimes / 5) * 100}
            handleClaim={handleClaim}
            isClaiming={isClaiming}
            isAllConnected={solanaWalletConnected && bitcoinWalletConnected}
          />
        </Animated.View>
      </View>
      <SuccessfulClaim
        claimedAmount={satoshiToBtc(CLAIM_AMOUNT_LIMIT)}
        onClose={() => {}}
        onTryStaking={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  claimWidget: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  claimWidgetCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    margin: 16,
  },
  cardContent: {
  },
  cardAlert: {
    marginBottom: 16,
  },
});
