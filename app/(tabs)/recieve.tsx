import { Wallet } from "@/bitcoin/wallet";
import Icon from "@/components/ui/Icons";
import { ThemedButton as Button } from "@/components/ui/ThemedButton";
import ClaimWidget from "@/components/Widgets/ClaimWidget/ClaimWidget";
import { BaseConnector } from "@/connector";
import { useBitcoinWallet } from "@/contexts/BitcoinWalletProvider";
import { useSolanaWallet } from "@/contexts/SolanaWalletProvider";
import { capitalizeFirstLetter } from "@/utils/format";
import { notifyError } from "@/utils/notification";
import * as Clipboard from 'expo-clipboard';
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function ClaimPage() {
  const { getCurrentWallet } = useSolanaWallet();
  const {
    wallet: bitcoinWallet,
    connectConnectorWallet,
    connectDerivedWallet,
    connected: bitcoinWalletConnected,
    handleConnectorId,
    connectors,
    connector,
    connecting,
    connected,
  } = useBitcoinWallet();  

  const [copiedSolana, setCopiedSolana] = useState(false);
  const [copiedBitcoin, setCopiedBitcoin] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<"bitcoin" | "solana">("bitcoin");
  const solanaWallet = getCurrentWallet();
  const solanaAddress = solanaWallet?.publicKey.toBase58();
  const bitcoinAddress = bitcoinWallet?.p2tr;

  const onConnectorConnect = React.useCallback(
    async (
      wallet: Wallet,
      connector: BaseConnector
    ) => {
      // console.log("onConnectorConnect", wallet, connector);
      if (connector?.isReady() && wallet?.type === "connector") {
        await handleConnectorId(connector.metadata.id);
      }
      try {
        await connectConnectorWallet(connector);
      } catch (error) {
        const walletError = error as { code: number };
        if (walletError?.code === 4001) {
          notifyError(
            "You must have at least one account in the Bitcoin wallet."
          );
        }
      }
    },
    [connectConnectorWallet, handleConnectorId]
  );

  const onDerivedWalletConnect = React.useCallback(
    async () => {
      try {
        // console.log("onDerivedWalletConnect");
        await connectDerivedWallet();
      } catch (error) {
        console.error("onDerivedWalletConnect error", error);
      }
    },
    [connectDerivedWallet]
  );

  const connectWallet = React.useCallback(
    async (wallet: Wallet) => {
      // console.log("connectWallet", wallet);
      if (wallet?.type === "connector") {
        const connector = connectors[0];
        if (connector?.isReady()) {
          await onConnectorConnect(wallet, connector);
        } else {
          window.open(wallet.url, "_blank");
        }
      } else {
        onDerivedWalletConnect();
      }
    },
    [connectors, onConnectorConnect, onDerivedWalletConnect]
  );

  useEffect(() => {
    // console.log("solanaAddress", solanaAddress);
    // console.log("bitcoinAddress", bitcoinAddress);
    // console.log("bitcoinConnected", bitcoinWalletConnected);
    // console.log("connectors", connectors);

    // console.log("connectors", connectors[0]);
    if (!bitcoinWallet) {
      connectWallet(bitcoinWallet as any);
    }
  }, [bitcoinAddress, bitcoinWallet, bitcoinWalletConnected, connectWallet, connector, connectors, solanaAddress]);


  const handleCopy = (type: "bitcoin" | "solana") => {
    if (type === "bitcoin" && bitcoinAddress) {
      Clipboard.setStringAsync(bitcoinAddress);
      setCopiedBitcoin(true);
      setTimeout(() => setCopiedBitcoin(false), 1500);
    }
    if (type === "solana" && solanaAddress) {
      Clipboard.setStringAsync(solanaAddress);
      setCopiedSolana(true);
      setTimeout(() => setCopiedSolana(false), 1500);
    }
  };

  const handleShare = async () => {
    if (bitcoinAddress) {
      try {
        await Share.share({ message: bitcoinAddress });
      } catch {
        Alert.alert("Error", "Failed to share address");
      }
    }
  };

  if (!bitcoinAddress) {
    return (
      <View style={styles.centeredContainer}>
        <Icon name="Error" size={18} color="#ffa794" />
        <Text style={styles.unavailableTitle}>Feature Unavailable</Text>
        <Text style={styles.unavailableDesc}>
          Claim feature is only available on Regtest network. Please connect to Regtest network to use this feature.
        </Text>
        <Button onPress={connectDerivedWallet} disabled={connecting || connected} title={connecting ? "Connecting..." : "Connect Derived Bitcoin Wallet"} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Receive {capitalizeFirstLetter(selectedNetwork)}</Text>
      <Text style={styles.description}>
        Share your {capitalizeFirstLetter(selectedNetwork)} address or QR code to receive payments. For Bitcoin, only Regtest network is supported.
      </Text>
      <View style={{ flexDirection: "row", marginBottom: 16 }}>
        <TouchableOpacity
          style={[
            styles.switchButton,
            selectedNetwork === "bitcoin" && styles.switchButtonActive,
          ]}
          onPress={() => setSelectedNetwork("bitcoin")}
        >
          <Text style={selectedNetwork === "bitcoin" ? styles.switchTextActive : styles.switchText}>Bitcoin</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.switchButton,
            selectedNetwork === "solana" && styles.switchButtonActive,
          ]}
          onPress={() => setSelectedNetwork("solana")}
        >
          <Text style={selectedNetwork === "solana" ? styles.switchTextActive : styles.switchText}>Solana</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.qrContainer}>
        {selectedNetwork === "bitcoin" && bitcoinAddress ? (
          <QRCode value={`bitcoin:${bitcoinAddress}`} size={180} />
        ) : selectedNetwork === "solana" && solanaAddress ? (
          <QRCode value={`solana:${solanaAddress}`} size={180} />
        ) : (
          <View style={styles.qrPlaceholder} />
        )}
      </View>
      <View style={styles.addressContainer}>
        <Text style={styles.addressLabel}>Your Bitcoin Address</Text>
        <View style={styles.addressRow}>
          <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="middle">{bitcoinAddress || "Not connected"}</Text>
          {bitcoinAddress ? (
            <>
              <TouchableOpacity onPress={() => handleCopy("bitcoin")} style={styles.iconButton}>
                <Icon name={copiedBitcoin ? "Success" : "Copy"} size={18} color={copiedBitcoin ? "#4caf50" : "#ffa794"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
                <Icon name="Link" size={18} color="#ffa794" />
              </TouchableOpacity>
            </>
          ) : null}
        </View>
        {copiedBitcoin && <Text style={styles.copiedText}>Copied!</Text>}
        <Text style={styles.addressLabel}>Your Solana Address</Text>
        <View style={styles.addressRow}>
          <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="middle">{solanaAddress || "Not connected"}</Text>
          {solanaAddress ? (
            <>
              <TouchableOpacity onPress={() => handleCopy("solana")} style={styles.iconButton}>
                <Icon name={copiedSolana ? "Success" : "Copy"} size={18} color={copiedSolana ? "#4caf50" : "#ffa794"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
                <Icon name="Link" size={18} color="#ffa794" />
              </TouchableOpacity>
            </>
          ) : null}
        </View>
        {copiedSolana && <Text style={styles.copiedText}>Copied!</Text>}
      </View>

      <View style={styles.claimWidgetWrapper}>
        <ClaimWidget />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 24,
    backgroundColor: "#181A20",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#181A20",
    padding: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 24,
    marginBottom: 8,
  },
  description: {
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  qrContainer: {
    backgroundColor: "#23242a",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#ffa794",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  qrPlaceholder: {
    width: 180,
    height: 180,
    backgroundColor: "#333",
    borderRadius: 16,
  },
  addressContainer: {
    width: "100%",
    backgroundColor: "#23242a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  addressLabel: {
    color: "#ffa794",
    fontWeight: "600",
    marginBottom: 6,
    fontSize: 15,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },
  addressText: {
    color: "#fff",
    fontSize: 15,
    flex: 1,
    marginRight: 8,
  },
  iconButton: {
    marginLeft: 6,
    padding: 4,
  },
  copiedText: {
    color: "#4caf50",
    marginTop: 4,
    fontSize: 13,
  },
  claimWidgetWrapper: {
    width: "100%",
    marginTop: 12,
  },
  unavailableTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 24,
    marginBottom: 8,
    textAlign: "center",
  },
  unavailableDesc: {
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  switchButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#23242a",
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  switchButtonActive: {
    backgroundColor: "#ffa794",
  },
  switchText: {
    color: "#fff",
    fontWeight: "600",
  },
  switchTextActive: {
    color: "#181A20",
    fontWeight: "700",
  },
});