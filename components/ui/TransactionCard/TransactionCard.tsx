import { Collapsible } from '@/components/ui/Collapsible';
import Icon from '@/components/ui/Icons';
import { NetworkConfig } from '@/types/network';
import { AccountData, Transaction } from '@/types/transaction';
import { capitalizeFirstLetter, formatSolanaAddress } from '@/utils/format';
import { PublicKey } from '@solana/web3.js';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconName } from '../Icons/icons';
import { ThemedButton as Button } from '../ThemedButton';
import { ThemedText as Text } from '../ThemedText';


const formatDescription = (description: string, address: PublicKey) => {
  const addressString = address.toBase58();
  // Regex for base58 Solana addresses (usually 32-44 chars, but we'll use 32+ for safety)
  const addressRegex = /[1-9A-HJ-NP-Za-km-z]{32,44}/g;
  return description.replace(addressRegex, (match) => {
    if (match === addressString) {
      return 'You';
    }
    try {
      // Try to create a PublicKey to ensure it's a valid address
      return formatSolanaAddress(new PublicKey(match));
    } catch {
      return match;
    }
  }).trim();
}

export default function TransactionCard({
  networkConfig,
  transaction,
  address,
  onPress,
}: {
  networkConfig: NetworkConfig;
  transaction: Transaction;
  address: PublicKey;
  onPress: () => void;
}) {
  const guardianAddress = networkConfig.guardianSetting;
  const isZeusInteraction = transaction.accountData.some(
    (t: AccountData) => t.account === guardianAddress
  );
  console.log("isZeusInteraction", isZeusInteraction, guardianAddress, transaction.accountData);

  const userTransfer = transaction.nativeTransfers.find(
    (t) =>
      t.toUserAccount === address.toBase58() ||
      t.fromUserAccount === address.toBase58()
  );
  const isIncome = userTransfer
    ? userTransfer.toUserAccount === address.toBase58()
    : false;
  const amount = userTransfer ? userTransfer.amount : 0;
  const title = isZeusInteraction
    ? "Zeus Interaction"
    : (formatDescription(transaction.description, address) || (isIncome ? "Received" : "Sent"));
  const category = capitalizeFirstLetter(transaction.type.toLowerCase()) as IconName || "Unknown";
  const timestamp = new Date(transaction.timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Collapsible
      title={
        <View style={[styles.card, { borderLeftColor: isIncome ? "#32CD32" : "#FF4C61", borderLeftWidth: 4, shadowColor: isIncome ? '#32CD32' : '#FF4C61' }]}> 
          <View style={styles.left}>
            <View style={styles.iconCircle}>
              <Icon
                name={category}
                size={18}
                color={isIncome ? "#32CD32" : "#FF4C61"}
              />
            </View>
            <View style={{ marginLeft: 18, flex: 1 }}>
              <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
              <Text style={styles.sub} type="subtitle">{category !== "Unknown" ? category : title}</Text>
            </View>
          </View>
          <View style={styles.right}>
            <Text
              style={[
                styles.amount,
                { color: isIncome ? "#32CD32" : "#FF4C61" },
              ]}
            >
              {isIncome ? "+" : "-"}{(amount / 1e9).toLocaleString(undefined, { maximumFractionDigits: 4 })}
            </Text>
            <Text style={styles.time}>{timestamp}</Text>
          </View>
        </View>
      }
    >
      <View style={styles.divider} />
      <View style={styles.detailsCard}>
        <Text style={styles.detailLabel}>Description</Text>
        <Text style={styles.detailValue}>{transaction.description.length > 0 ? transaction.description : title}</Text>
        <Button textStyle={styles.solscanButtonText} style={styles.solscanButton} onPress={onPress} title="View on Solscan" />
        <View style={{ flexDirection: 'row', marginTop: 18 }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.detailLabel}>From</Text>
            <Text style={styles.detailValue}>{formatSolanaAddress(new PublicKey(userTransfer?.fromUserAccount || ""))}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.detailLabel}>To</Text>
            <Text style={styles.detailValue}>{formatSolanaAddress(new PublicKey(userTransfer?.toUserAccount || ""))}</Text>
          </View>
        </View>
      </View>
    </Collapsible>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 22,
    paddingBottom: 18,
    paddingHorizontal: 22,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
    marginHorizontal: 8,
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    borderLeftColor: '#32CD32',
    borderWidth: 1,
    borderColor: '#ececf2',
    flexShrink: 1,
    flexGrow: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    minHeight: 56,
  },
  iconCircle: {
    backgroundColor: '#f2f6f8',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    marginTop: '10%',
  },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1, minWidth: 0 },
  right: { alignItems: 'flex-end', marginLeft: 18, minWidth: 90 },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#181A20',
    flexShrink: 1,
    flexWrap: 'wrap',
    letterSpacing: 0.1,
    lineHeight: 18,
  },
  sub: {
    fontSize: 9,
    color: '#A0A4B8',
    fontWeight: '700',
    letterSpacing: 0.2,
    lineHeight: 10,
  },
  time: { fontSize: 12, color: '#B0B4C0', marginTop: 8, fontWeight: '500' },
  amount: { fontSize: 24, fontWeight: '900', marginTop: '10%', letterSpacing: 0.3 },
  divider: {
    height: 1,
    backgroundColor: '#ececf2',
    marginHorizontal: 22,
    marginBottom: 0,
    marginTop: 0,
  },
  detailsCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    padding: 22,
    marginTop: 14,
    marginHorizontal: 2,
    flexShrink: 1,
    flexGrow: 1,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ececf2',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  details: { marginTop: 14, paddingLeft: 10 },
  detailLabel: { fontSize: 13, color: '#888', fontWeight: 'bold', marginBottom: 2, letterSpacing: 0.2 },
  detailValue: {
    fontSize: 15,
    color: '#222',
    marginBottom: 10,
    flexShrink: 1,
    flexWrap: 'wrap',
    fontWeight: '500',
  },
  solscanButton: {
    backgroundColor: '#181A20',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  solscanButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.2,
  },
});
