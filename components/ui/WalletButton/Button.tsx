import { useBitcoinWallet } from "@/contexts/BitcoinWalletProvider";
import { useSolanaWallet } from "@/contexts/SolanaWalletProvider";
import useStore from "@/stores/store";
import { MODAL_NAMES } from "@/utils/constant";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import ButtonLoader from "../Icons/icons/ButtonLoader";

const getDisplayLabel = ({
  label,
  solanaWalletRequired,
  bitcoinWalletRequired,
  solanaWalletConnected,
  bitcoinWalletConnected,
}: {
  label?: string;
  solanaWalletRequired?: boolean;
  bitcoinWalletRequired?: boolean;
  solanaWalletConnected: boolean;
  bitcoinWalletConnected: boolean;
}) => {
  if (!solanaWalletRequired) return label;
  if (!solanaWalletConnected) {
    return "Connect Wallet";
  }
  if (solanaWalletConnected && !bitcoinWalletRequired) {
    return label;
  }
  if (
    solanaWalletConnected &&
    bitcoinWalletRequired &&
    !bitcoinWalletConnected
  ) {
    return "Connect Bitcoin Wallet";
  }
  return label;
};

type ButtonProps = {
  size?: "xs" | "sm" | "md" | "lg" | "badge" | "none";
  theme?: "primary" | "secondary" | "label" | "connected";
  onClick?: () => void;
  label?: string;
  icon?: React.ReactNode;
  iconSize?: number;
  iconPosition?: "left" | "right";
  hoveredIcon?: React.ReactNode;
  classes?: string; // ignored in RN
  isLoading?: boolean;
  disabled?: boolean;
  solanaWalletRequired?: boolean;
  bitcoinWalletRequired?: boolean;
  truncateText?: boolean;
  style?: ViewStyle;
};

const SIZE_STYLES: Record<string, ViewStyle> = {
  xs: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8 },
  sm: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10 },
  md: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12 },
  lg: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: 14 },
  badge: { paddingVertical: 2, paddingHorizontal: 6, borderRadius: 8 },
  none: {},
};

const THEME_STYLES: Record<string, ViewStyle> = {
  primary: { backgroundColor: '#3b82f6' },
  secondary: { backgroundColor: '#e5e7eb' },
  label: { backgroundColor: 'transparent' },
  connected: { backgroundColor: '#10b981' },
};

export default function Button({
  size = "md",
  theme = "primary",
  onClick,
  label,
  icon,
  iconPosition = "left",
  iconSize = 18,
  hoveredIcon, // ignored in RN
  isLoading,
  disabled,
  solanaWalletRequired,
  bitcoinWalletRequired,
  truncateText,
  style,
}: ButtonProps) {
  const openModalByName = useStore((state) => state.openModalByName);
  const { isAuthenticated: solanaWalletConnected } = useSolanaWallet();
  const { connected: bitcoinWalletConnected } = useBitcoinWallet();
  const [prevSolanaWalletConnected, setPrevSolanaWalletConnected] = useState(solanaWalletConnected);
  const [prevBitcoinWalletConnected, setPrevBitcoinWalletConnected] = useState(bitcoinWalletConnected);

  const displayLabel = getDisplayLabel({
    label,
    solanaWalletRequired,
    bitcoinWalletRequired,
    solanaWalletConnected,
    bitcoinWalletConnected,
  });

  const buttonStyle: ViewStyle[] = [
    styles.btn,
    SIZE_STYLES[size] || {},
    THEME_STYLES[theme] || {},
    ...(disabled ? [styles.btnDisabled] : []),
    ...(isLoading ? [styles.btnLoading] : []),
    ...(style ? [style] : []),
  ];

  const handleClick = () => {
    if (solanaWalletRequired && !solanaWalletConnected) {
      // Show Solana wallet modal (implement as needed in RN)
      // e.g., openModalByName(MODAL_NAMES.CONNECT_SOLANA_WALLET)
      return;
    } else if (
      solanaWalletConnected &&
      bitcoinWalletRequired &&
      !bitcoinWalletConnected
    ) {
      openModalByName(MODAL_NAMES.ADD_NEW_WALLET);
    } else if (onClick) {
      onClick();
    }
  };

  if (
    prevSolanaWalletConnected !== solanaWalletConnected ||
    prevBitcoinWalletConnected !== bitcoinWalletConnected
  ) {
    setPrevSolanaWalletConnected(solanaWalletConnected);
    setPrevBitcoinWalletConnected(bitcoinWalletConnected);
  }

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={handleClick}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
    >
      {!isLoading ? (
        <View style={styles.btnContent}>
          {icon && iconPosition === "left" && (
            <View style={[styles.btnIcon, { width: iconSize, height: iconSize }]}> 
              {icon}
            </View>
          )}
          {displayLabel && (
            <Text
              style={styles.btnLabel}
              numberOfLines={truncateText ? 1 : undefined}
              ellipsizeMode={truncateText ? "tail" : undefined}
            >
              {displayLabel}
            </Text>
          )}
          {icon && iconPosition === "right" && (
            <View style={[styles.btnIcon, { width: iconSize, height: iconSize }]}> 
              {icon}
            </View>
          )}
        </View>
      ) : (
        <View style={styles.btnContent}>
          {/* Use ButtonLoader or ActivityIndicator */}
          {ButtonLoader ? <ButtonLoader /> : <ActivityIndicator color="#fff" />}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
    maxWidth: 100,
    marginVertical: 4,
    marginHorizontal: 0,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnLoading: {
    opacity: 0.7,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  btnIcon: {
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginHorizontal: 4,
  },
});
