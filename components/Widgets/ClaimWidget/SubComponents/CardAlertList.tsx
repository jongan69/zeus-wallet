import { ExternalLink } from "@/components/ui/ExternalLink";
import { ThemedText as Text } from "@/components/ui/ThemedText";
import { useBitcoinWallet } from "@/contexts/BitcoinWalletProvider";
import { useSolanaWallet } from "@/contexts/SolanaWalletProvider";
import { useTheme } from "@/hooks/theme/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

export default function CardAlertList() {
  const { theme } = useTheme();
  const { isAuthenticated: solanaWalletConnected } = useSolanaWallet();
  const { connected: bitcoinWalletConnected } = useBitcoinWallet();

  const isAllConnected = bitcoinWalletConnected && solanaWalletConnected;

  // Helper for step status
  const getStepStatus = (step: number) => {
    if (step === 1) return solanaWalletConnected ? "done" : "current";
    if (step === 2) return solanaWalletConnected && bitcoinWalletConnected ? "done" : (solanaWalletConnected ? "current" : "locked");
    if (step === 3) return isAllConnected ? "current" : "locked";
    return "locked";
  };

  if (isAllConnected) {
    return (
      <View style={[styles.alertList, { paddingBottom: 69, backgroundColor: theme === "light" ? "#f8fafc" : "#111827" }]}>
        <View style={styles.readyCard}>
        <Image
            source={require("@/assets/images/zeus-logo.png")}
            style={styles.connectedImage}
            resizeMode="contain"
          />

          <View style={styles.rowContainer}>
          <View style={styles.celebrateIconContainer}>
            <Ionicons name="checkmark-circle" size={48} color="#4ade80" style={styles.celebrateIcon} />
          </View>
         
          <View style={styles.readyTextContainer}>
            <Text style={styles.readyTitle} lightColor="#222" darkColor="#fff">Connection Complete</Text>
            <Text style={styles.readySubtitle}>
              You are <Text style={styles.readyHighlight}>ready to claim</Text> your tBTC below
            </Text>
          </View>
          </View>
        </View>
        <View style={styles.claimLine} />
      </View>
    );
  } else {
    return (
      <View style={[styles.alertList, { paddingBottom: 48 }]}>
        <View style={styles.progressLineContainer}>
          <View style={styles.progressLine} />
        </View>
        {/* Step 1 */}
        <View style={styles.alertItem}>
          <View style={[styles.alertNumber, getStepStatus(1) === "done" && styles.alertNumberDone, getStepStatus(1) === "current" && styles.alertNumberCurrent]}>
            {solanaWalletConnected ? (
              <Ionicons name="checkmark" size={20} color="#fff" />
            ) : (
              <Text style={styles.alertNumberText}>1</Text>
            )}
          </View>
          <View style={styles.alertTitle}><Text><Text style={styles.bold}>Connect </Text>Solana Wallet</Text></View>
        </View>
        {/* Step 2 */}
        <View style={styles.alertItem}>
          <View style={[styles.alertNumber, getStepStatus(2) === "done" && styles.alertNumberDone, getStepStatus(2) === "current" && styles.alertNumberCurrent, getStepStatus(2) === "locked" && styles.opacity25]}>
            {bitcoinWalletConnected && solanaWalletConnected ? (
              <Ionicons name="checkmark" size={20} color="#fff" />
            ) : (
              <Text style={styles.alertNumberText}>2</Text>
            )}
          </View>
          <View style={styles.alertTitle}><Text><Text style={styles.bold}>Connect </Text>Bitcoin Wallet</Text></View>
        </View>
        {/* Step 3 */}
        <View style={[styles.alertItem, styles.itemsStart]}>
          <View style={[styles.alertNumber, getStepStatus(3) === "current" && styles.alertNumberCurrent, getStepStatus(3) === "locked" && styles.opacity25]}>
            <Text style={styles.alertNumberText}>3</Text>
          </View>
          <View style={styles.alertTitle}>
            <Text><Text style={styles.bold}>Bind </Text>Bitcoin Wallet</Text>
            <ExternalLink
              href="https://faucet.solana.com/"
              style={styles.link}
            >
              <Text style={styles.linkText}>
                Collect devnetSOL for Service Fee
              </Text>
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

    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  readyCard: {
    borderRadius: 18,
    alignItems: "center",
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 16,
  },
  celebrateIconContainer: {
    marginBottom: 8,
  },
  celebrateIcon: {
    shadowColor: "#4ade80",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  connectedImage: {
    width: 220,
    height: 48,
    marginBottom: 12,
  },
  readyTextContainer: {
    alignItems: "center",
  },
  readyTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  readySubtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  readyHighlight: {
    color: "#ff7e5f",
    fontWeight: "bold",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  claimLine: {
    height: 2,
    backgroundColor: "#e0e7ef",
    width: "100%",
    marginTop: 16,
    borderRadius: 1,
  },
  progressLineContainer: {
    position: "absolute",
    left: 15,
    top: 36,
    bottom: 36,
    width: 2,
    zIndex: 0,
    alignItems: "center",
  },
  progressLine: {
    flex: 1,
    width: 2,
    backgroundColor: "#e0e7ef",
    borderRadius: 1,
  },
  alertItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
    zIndex: 1,
  },
  alertNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e0e7ef",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#e0e7ef",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  alertNumberDone: {
    backgroundColor: "#4ade80",
    borderColor: "#4ade80",
  },
  alertNumberCurrent: {
    backgroundColor: "#ff7e5f",
    borderColor: "#ff7e5f",
  },
  alertNumberText: {
    fontWeight: "bold",
    fontSize: 17,
    color: "#222",
  },
  alertTitle: {
    flex: 1,
    fontSize: 17,
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
    marginTop: 6,
  },
  linkText: {
    color: "#2563eb",
    fontSize: 15,
    textDecorationLine: "underline",
    fontWeight: "500",
  },
});
