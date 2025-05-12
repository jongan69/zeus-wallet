import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '@/components/ui/Icons';

export default function TransactionCard({ transaction, onPress }: { transaction: any, onPress: () => void }) {
  const isIncome = transaction.amount > 0;

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.card}>
      <View style={styles.left}>
        <Icon
          name={transaction.category}
          size={14}
          color={isIncome ? '#32CD32' : '#FF4C61'}
          style={{ marginRight: 10 }}
        />
        <View>
          <Text style={styles.title}>{transaction.title}</Text>
          <Text style={styles.sub}>{transaction.category}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: isIncome ? '#32CD32' : '#FF4C61' }]}>
          {isIncome ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
    elevation: 2,
  },
  left: { flexDirection: 'row', alignItems: 'center' },
  right: {},
  title: { fontSize: 16, fontWeight: '600', color: '#333' },
  sub: { fontSize: 12, color: '#999' },
  amount: { fontSize: 16, fontWeight: '600' },
});
