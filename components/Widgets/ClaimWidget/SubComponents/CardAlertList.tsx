import { ExternalLink } from "@/components/ExternalLink";
import { useBitcoinWallet } from "@/contexts/BitcoinWalletProvider";
import { useSolanaWallet } from "@/contexts/SolanaWalletProvider";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function CardAlertList() {
  const { isAuthenticated: solanaWalletConnected } = useSolanaWallet();
  const { connected: bitcoinWalletConnected } = useBitcoinWallet();

  const isAllConnected = bitcoinWalletConnected && solanaWalletConnected;

  if (isAllConnected) {
    return (
      <View style={[styles.alertList, { paddingBottom: 69 }]}> {/* pb-[69px] */}
        <View style={styles.readyContainer}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.connectedImage}
            resizeMode="contain"
          />
          <View style={styles.readyTextContainer}>
            <View style={styles.readyRow}>
              <Image
                source={require("@/assets/images/icon.png")} // Placeholder for tasks-complete
                style={styles.tasksCompleteIcon}
                resizeMode="contain"
              />
              <Text style={styles.readyTitle}>Connection Complete</Text>
            </View>
            <Text style={styles.readySubtitle}>
              You are <Text style={styles.readyHighlight}>ready to claim</Text> your tBTC below
            </Text>
          </View>
        </View>
        <View style={styles.claimLine} />
      </View>
    );
  } else {
    return (
      <View style={[styles.alertList, { paddingBottom: 48 }]}>
        <View style={styles.alertItem}>
          <View style={styles.alertNumber}><Text style={styles.alertNumberText}>1</Text></View>
          <View style={styles.alertTitle}><Text><Text style={styles.bold}>Connect </Text>Solana Wallet</Text></View>
        </View>
        <View style={styles.alertItem}>
          <View style={[styles.alertNumber, !bitcoinWalletConnected && styles.opacity25]}><Text style={styles.alertNumberText}>2</Text></View>
          <View style={styles.alertTitle}><Text><Text style={styles.bold}>Connect </Text>Bitcoin Wallet</Text></View>
        </View>
        <View style={[styles.alertItem, styles.itemsStart]}>
          <View style={[styles.alertNumber, !bitcoinWalletConnected && styles.opacity25]}><Text style={styles.alertNumberText}>3</Text></View>
          <View style={styles.alertTitle}>
            <Text><Text style={styles.bold}>Bind </Text>Bitcoin Wallet</Text>
            <ExternalLink
              href="https://faucet.solana.com/"
              style={styles.link}
            >
              <Text style={styles.linkText}>Collect devnetSOL for Service Fee</Text>
            </ExternalLink>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  alertList: {
    width: "100%",
    // backgroundColor: '#f9fafb', // Optional: for debugging
  },
  readyContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  connectedImage: {
    width: 286,
    height: 63,
    marginBottom: 16,
  },
  readyTextContainer: {
    alignItems: "center",
  },
  readyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tasksCompleteIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  readyTitle: {
    fontSize: 18,
    color: "#222",
    fontWeight: "600",
  },
  readySubtitle: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
  },
  readyHighlight: {
    color: "#ffa794",
    fontWeight: "bold",
  },
  claimLine: {
    height: 2,
    backgroundColor: "#eee",
    width: "100%",
    marginTop: 16,
    borderRadius: 1,
  },
  alertItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  alertNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  alertNumberText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
  },
  alertTitle: {
    flex: 1,
    fontSize: 16,
    color: "#222",
  },
  bold: {
    fontWeight: "bold",
  },
  opacity25: {
    opacity: 0.25,
  },
  itemsStart: {
    alignItems: "flex-start",
  },
  link: {
    marginTop: 4,
  },
  linkText: {
    color: "#007bff",
    fontSize: 15,
    textDecorationLine: "underline",
  },
}); 