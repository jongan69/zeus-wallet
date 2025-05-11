import { BTC_DECIMALS } from "@/utils/constant";
import { formatValue } from "@/utils/format";
import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";

// Simple Tooltip replacement using Modal (customize as needed)
const Tooltip = ({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <Modal transparent visible={isOpen} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.tooltipContainer}>{children}</View>
      </View>
    </Modal>
  );
};

export const DepositTooltip = ({
  totalBalance,
  availableUtxoAmount,
  unavailableUtxoAmount,
  isOpen,
}: {
  isOpen: boolean;
  totalBalance: number;
  availableUtxoAmount: number;
  unavailableUtxoAmount: number;
}) => {
  return (
    <Tooltip isOpen={isOpen}>
      <View style={styles.bodyContainer}>
        <View style={styles.rowPrimary}>
          <Text style={styles.label}>Total Balance</Text>
          <Text style={styles.value}>{formatValue(totalBalance / 10 ** BTC_DECIMALS, 6)}</Text>
        </View>
        <View style={styles.rowSecondary}>
          <Text style={styles.label}>Available UTXO Amount</Text>
          <Text style={styles.value}>{formatValue(availableUtxoAmount / 10 ** BTC_DECIMALS, 6)}</Text>
        </View>
        <View style={styles.rowSecondary}>
          <Text style={styles.label}>Unavailable UTXO Amount</Text>
          <Text style={styles.value}>{formatValue(unavailableUtxoAmount / 10 ** BTC_DECIMALS, 6)}</Text>
        </View>
      </View>
    </Tooltip>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tooltipContainer: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 20,
    width: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  bodyContainer: {
    flexDirection: 'column',
    gap: 16,
  },
  rowPrimary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rowSecondary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 24,
    marginBottom: 8,
  },
  label: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  value: {
    color: '#fff',
    fontSize: 16,
  },
});
