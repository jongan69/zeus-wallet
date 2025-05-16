import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import * as Clipboard from 'expo-clipboard';
import QRCode from "react-native-qrcode-svg";

import Icon from "@/components/ui/Icons";
import { ThemedButton as Button } from "@/components/ui/ThemedButton";
import { ThemedText } from '@/components/ui/ThemedText';
import ClaimWidget from "@/components/Widgets/ClaimWidget/ClaimWidget";

import { useBitcoinWallet } from "@/contexts/BitcoinWalletProvider";
import { useSolanaWallet } from "@/contexts/SolanaWalletProvider";
import { useHoldings } from "@/hooks/misc/useHoldings";
import { capitalizeFirstLetter } from "@/utils/format";
import { notifyError } from "@/utils/notification";

function HoldingCard({ holding }: { holding: any }) {
  const [meta, setMeta] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    async function fetchMeta() {
      setLoading(true);
      setError(null);
      try {
        if (holding.content?.json_uri) {
          const res = await fetch(holding.content.json_uri);
          const data = await res.json();
          if (isMounted) setMeta(data);
        }
      } catch (e: any) {
        if (isMounted) {
          setError('Failed to load metadata');
          notifyError(`Failed to load metadata: ${e.message}`);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchMeta();
    return () => { isMounted = false; };
  }, [holding]);

  return (
    <View style={{
      width: '100%',
      backgroundColor: '#292b32',
      borderRadius: 10,
      padding: 12,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#ffa794',
      shadowOpacity: 0.08,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
    }}>
      {loading ? (
        <Icon name="Processing" size={32} color="#ffa794" />
      ) : error ? (
        <Icon name="Error" size={32} color="#ffa794" />
      ) : meta && meta.image ? (
        <Image source={{ uri: meta.image }} style={{ width: 48, height: 48, borderRadius: 8, marginRight: 12 }} />
      ) : (
        <Icon name="Unknown" size={32} color="#aaa" />
      )}
      <View style={{ flex: 1 }}>
        <ThemedText type="subtitle" style={{ color: '#fff', marginBottom: 2 }}>
          {meta?.name || holding.id.slice(0, 8) + '...'}
        </ThemedText>
        <ThemedText style={{ color: '#aaa', fontSize: 13 }}>
          {holding.id.slice(0, 16) + '...'}
        </ThemedText>
      </View>
      <TouchableOpacity onPress={() => Clipboard.setStringAsync(holding.id)} style={{ marginLeft: 8 }}>
        <Icon name="Copy" size={20} color="#ffa794" />
      </TouchableOpacity>
    </View>
  );
}

export default function RecieveScreen() {
  const { publicKey, getCurrentWallet, isAuthenticated: solanaWalletConnected, login: loginSolana } = useSolanaWallet();
  const { holdings, loading: isHoldingsLoading, error: holdingsError, refetch: refetchHoldings } = useHoldings(publicKey!);
  
  const {
    wallet: bitcoinWallet,
    connectDerivedWallet,
    connected: bitcoinWalletConnected,
    connecting,
    connected,
  } = useBitcoinWallet();

  const isAllConnected = bitcoinWalletConnected && solanaWalletConnected;

  const [copiedSolana, setCopiedSolana] = useState(false);
  const [copiedBitcoin, setCopiedBitcoin] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<"bitcoin" | "solana">("bitcoin");
  const solanaWallet = getCurrentWallet();
  const solanaAddress = solanaWallet?.publicKey.toBase58();
  const bitcoinAddress = bitcoinWallet?.p2tr;

  const connectBothWallets = async () => {
    await loginSolana();
    await connectDerivedWallet();
  }
  useEffect(() => {
    if (!isAllConnected) {
      connectBothWallets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAllConnected]);


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

  const handleShare = async (address: string) => {
    if (address) {
      try {
        await Share.share({ message: address });
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
        <Button onPress={connectBothWallets} disabled={connecting || connected} title={connecting ? "Connecting..." : "Connect Wallets"} />
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
              <TouchableOpacity onPress={() => handleShare(bitcoinAddress)} style={styles.iconButton}>
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
              <TouchableOpacity onPress={() => handleShare(solanaAddress)} style={styles.iconButton}>
                <Icon name="Link" size={18} color="#ffa794" />
              </TouchableOpacity>
            </>
          ) : null}
        </View>
        {copiedSolana && <Text style={styles.copiedText}>Copied!</Text>}
      </View>

      {/* Holdings UI */}
      <View style={styles.holdingsContainer}>
        <Button
          title={isHoldingsLoading ? 'Refreshing...' : 'Refresh Holdings'}
          onPress={refetchHoldings}
          disabled={isHoldingsLoading}
          style={{ marginBottom: 10, alignSelf: 'flex-end', minWidth: 140 }}
        />
        <Text style={styles.holdingsHeader}>Your Solana Holdings</Text>
        {isHoldingsLoading ? (
          <View style={styles.holdingsLoading}><Icon name="Processing" size={20} color="#ffa794" /><Text style={styles.holdingsLoadingText}>Loading holdings...</Text></View>
        ) : holdingsError ? (
          <Text style={styles.holdingsError}>Failed to load holdings: {holdingsError}</Text>
        ) : holdings && holdings.length === 0 ? (
          <Text style={styles.holdingsEmpty}>No holdings found.</Text>
        ) : (
          holdings.map((holding, idx) => (
            <HoldingCard key={holding.id || idx} holding={holding} />
          ))
        )}
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
  holdingsContainer: {
    width: "100%",
    backgroundColor: "#23242a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  holdingsHeader: {
    color: "#ffa794",
    fontWeight: "600",
    marginBottom: 6,
    fontSize: 15,
  },
  holdingsLoading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  holdingsLoadingText: {
    color: "#fff",
    marginLeft: 8,
  },
  holdingsError: {
    color: "#ffa794",
    marginTop: 4,
    fontSize: 13,
  },
  holdingsEmpty: {
    color: "#aaa",
    marginTop: 4,
    fontSize: 13,
  },
});