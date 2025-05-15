import { ThemedText as Text } from '@/components/ui/ThemedText';
import TransactionCard from '@/components/ui/TransactionCard/TransactionCard';
import { useSolanaWallet } from '@/contexts/SolanaWalletProvider';
import { useNetworkConfig } from '@/hooks/misc/useNetworkConfig';
import { useTransactions } from '@/hooks/misc/useTransactions';
import { useTheme } from '@/hooks/theme/useTheme';
import { AccountData, Transaction } from '@/types/transaction';
import { isMobile } from "@/utils/misc";
import { FlashList } from '@shopify/flash-list';

import React, { useCallback, useState } from 'react';
import {
  Linking,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const FILTERS = ['All', 'Income', 'Expenses'];

export default function TransactionsScreen() {
  const { theme } = useTheme();
  const { publicKey: address, network } = useSolanaWallet();
  const networkConfig = useNetworkConfig();
  const { transactions, loading, error, refetch } = useTransactions(address!);
  const [filter, setFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = transactions.filter((tx: Transaction) => {
    if (filter === 'All') return true;
    const accountData = tx.accountData?.find((a: AccountData) => a.account === address?.toBase58());
    const net = accountData?.nativeBalanceChange ?? 0;
    return filter === 'Income' ? net > 0 : net < 0;
  });

  const sorted = filtered.sort((a: Transaction, b: Transaction) => (b.timestamp || 0) - (a.timestamp || 0));

  const renderItem = useCallback(
    ({ item }: { item: Transaction }) => (
      <TransactionCard
        networkConfig={networkConfig}
        transaction={item}
        address={address!}
        onPress={() =>
          Linking.openURL(
            `https://solscan.io/tx/${item.signature}?cluster=${network}`,
          )
        }
      />
    ),
    [address, network, networkConfig],
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#121212' : '#fff', paddingTop: isMobile ? "20%" : 0 }]}>
      <Text style={styles.header}>Transactions</Text>

      <View style={styles.filterRow}>
        {FILTERS.map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterBtn,
              filter === type && styles.filterBtnActive,
            ]}
            onPress={() => setFilter(type)}>
            <Text
              style={[
                styles.filterText,
                filter === type && styles.filterTextActive,
              ]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && <Text style={styles.loading}>Loading...</Text>}
      {error && <Text style={styles.end}>Error: {error}</Text>}
      {!loading && !error && (
        <FlashList
          data={sorted}
          estimatedItemSize={72}
          renderItem={renderItem}
          keyExtractor={item => item.signature}
          ListEmptyComponent={<Text style={styles.end}>No transactions found</Text>}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme === 'dark' ? '#fff' : '#000'}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  header: {
    paddingTop: '1%',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 12
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginRight: 8,
  },
  filterBtnActive: {
    backgroundColor: '#000'
  },
  filterText: {
    fontSize: 14,
    color: '#333'
  },
  filterTextActive: {
    color: '#fff'
  },
  loading: {
    textAlign: 'center',
    paddingVertical: 10,
    color: '#666'
  },
  end: {
    textAlign: 'center',
    paddingVertical: 10,
    color: '#999'
  },
});
