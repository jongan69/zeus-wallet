import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet } from "react-native";

import { useSolanaWallet } from "@/contexts/SolanaWalletProvider";

import PortfolioTransactionsTables from "./PortfolioTransactionsTables";
import PortfolioTransactionsTabs from "./PortfolioTransactionsTabs";

export default function PortfolioTransactions() {
  const { publicKey: solanaPubkey } = useSolanaWallet();
  const [activeTab, setActiveTab] = useState(0);

  // Animation setup
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <PortfolioTransactionsTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <PortfolioTransactionsTables
        activeTab={activeTab}
        solanaPubkey={solanaPubkey}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingTop: 8,
    gap: 40, // If using React Native >= 0.71, otherwise use margin/padding
    position: "relative",
  },
});
