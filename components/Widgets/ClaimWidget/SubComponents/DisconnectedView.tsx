import { ThemedText as Text } from "@/components/ui/ThemedText";
import { useBitcoinWallet } from "@/contexts/BitcoinWalletProvider";
import { useSolanaWallet } from "@/contexts/SolanaWalletProvider";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

export default function ConnectedView() {
  // const { theme } = useTheme();
  const { isAuthenticated: solanaWalletConnected } = useSolanaWallet();
  const { connected: bitcoinWalletConnected } = useBitcoinWallet();
  return (
    <View style={[styles.alertList, { alignItems: "center", justifyContent: "center", paddingVertical: 40 }]}>
      {!solanaWalletConnected && (
        <View style={styles.walletAlertContainer}>
          <Ionicons name="wallet" size={48} color="#ff7e5f" style={styles.walletIcon} />
          <Text style={styles.walletAlertTitle}>Solana Wallet Not Connected</Text>
          <Text style={styles.walletAlertSubtitle}>Please connect your Solana wallet to continue.</Text>
        </View>
      )}
      {!bitcoinWalletConnected && (
        <View style={styles.walletAlertContainer}>
          <Ionicons name="logo-bitcoin" size={48} color="#f7931a" style={styles.walletIcon} />
          <Text style={styles.walletAlertTitle}>Bitcoin Wallet Not Connected</Text>
          <Text style={styles.walletAlertSubtitle}>Please connect your Bitcoin wallet to continue.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  alertList: {
    width: "100%",
    borderRadius: 22,
    padding: 22,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#ececf2",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginBottom: 16,
  },
  walletAlertContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
    padding: 20,
    backgroundColor: "#f8fafc",
    borderRadius: 18,
    width: "92%",
    borderWidth: 1,
    borderColor: "#ececf2",
    shadowColor: "#546CF1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    alignSelf: "center",
  },
  walletIcon: {
    marginBottom: 14,
  },
  walletAlertTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#181A20",
    marginBottom: 6,
    textAlign: "center",
    letterSpacing: 0.1,
  },
  walletAlertSubtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 2,
  },
});