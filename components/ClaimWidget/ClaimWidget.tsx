import "../../polyfills";

import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";

import { useBitcoinWallet } from "@/contexts/BitcoinWalletProvider";
import { useSolanaWallet } from "@/contexts/SolanaWalletProvider";
import { useFetchers } from "@/hooks/misc/useFetchers";
import usePersistentStore from "@/stores/persistentStore";
import useStore from "@/stores/store";
import { claimTBTCSchema } from "@/types/api";
import { createAxiosInstances } from "@/utils/axios";
import { MODAL_NAMES } from "@/utils/constant";
import { notifyError } from "@/utils/notification";


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
        // console.log("[fetchClaimableAmount] Called");
        const response = await aegleFetcher(
          `api/v1/bitcoin-regtest-wallet/${bitcoinWallet.p2tr}`,
          claimTBTCSchema
        );
        // console.log("[fetchClaimableAmount] Response received", response);
        if (!response) return;

        setClaimableTimes(response.remainingClaimCounts);
      } catch (error) {
        console.error("Error fetching claimable amount:", error);
      }
    };
    fetchClaimableAmount();
  }, [bitcoinWallet, aegleFetcher]);

  const handleClaim = () => {
    // console.log("[handleClaim] Called");
    if (!bitcoinWallet) {
      console.log("[handleClaim] No bitcoinWallet found");
      return;
    }

    setIsClaiming(true);
    // console.log("[handleClaim] setIsClaiming(true)");

    const { aegleApi } = createAxiosInstances(solanaNetwork, bitcoinNetwork);
    // console.log("aegleApi", aegleApi);

    // console.log("[handleClaim] Created axios instances", { solanaNetwork, bitcoinNetwork });

    const claimUrl = `api/v1/bitcoin-regtest-wallet/${bitcoinWallet.p2tr}/claim`;
    // console.log("[handleClaim] claimUrl:", claimUrl);

    aegleApi
      .post(claimUrl, {
        amount: CLAIM_AMOUNT_LIMIT,
      })
      .then((response) => {
        // console.log("[handleClaim] Response received", response);
        if (response.status === 200) {
          // console.log("[handleClaim] Claim successful, opening modal");
          openModalByName(MODAL_NAMES.SUCCESSFUL_CLAIM);
        } else if (response.status === 429) {
          // console.log("[handleClaim] Daily claim limit reached");
          notifyError("You have reached the daily claim limit.");
        } else {
          // console.log("[handleClaim] Unexpected response status", response.status);
        }
      })
      .catch((error) => {
        console.error("[handleClaim] Claim error:", error);
        notifyError("Claim failed. Please try again later.");
      })
      .finally(() => {
        setIsClaiming(false);
        // console.log("[handleClaim] setIsClaiming(false)");
      });
  };

  return (
    <View style={styles.claimWidget}>
      <View style={styles.claimWidgetCard}>
        <Animated.View style={{ opacity: fadeAnim }}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  claimWidget: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // paddingBottom: '5%',
  },
  claimWidgetCard: {
    borderRadius: 12,
    padding: 10,
    margin: 10,

  },
  cardAlert: {
    marginBottom: 10,
  },
});
