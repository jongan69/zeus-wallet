import { useBitcoinWallet } from "@/contexts/BitcoinWalletProvider";
import { useSolanaWallet } from "@/contexts/SolanaWalletProvider";
import useStore from "@/stores/store";
import { MODAL_NAMES } from "@/utils/constant";
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import React, { useRef } from "react";
import { ActivityIndicator, Animated, Platform, StyleSheet, Text, View, ViewStyle } from "react-native";
import ButtonLoader from "../Icons/icons/ButtonLoader";

type ButtonProps = {
  size?: "xs" | "sm" | "md" | "lg" | "badge" | "none";
  theme?: "primary" | "secondary" | "label" | "connected";
  onClick?: () => void;
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  solanaWalletRequired?: boolean;
  bitcoinWalletRequired?: boolean;
  truncateText?: boolean;
  style?: ViewStyle;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  textColor?: string;
  fontStyle?: object;
  customLoader?: React.ReactNode;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  accessible?: boolean;
  testID?: string;
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
  leftIcon,
  rightIcon,
  isLoading,
  disabled,
  solanaWalletRequired,
  bitcoinWalletRequired,
  truncateText,
  style,
  backgroundColor,
  borderColor,
  borderWidth,
  textColor,
  fontStyle,
  customLoader,
  accessibilityLabel,
  accessibilityRole = "button",
  accessible = true,
  testID,
}: ButtonProps) {
  const openModalByName = useStore((state) => state.openModalByName);
  const { isAuthenticated: solanaWalletConnected } = useSolanaWallet();
  const { connected: bitcoinWalletConnected } = useBitcoinWallet();
  const scale = useRef(new Animated.Value(1)).current;

  // Inline label logic
  let displayLabel = label;
  if (solanaWalletRequired && !solanaWalletConnected) {
    displayLabel = "Connect Wallet";
  } else if (
    solanaWalletRequired &&
    solanaWalletConnected &&
    bitcoinWalletRequired &&
    !bitcoinWalletConnected
  ) {
    displayLabel = "Connect Bitcoin Wallet";
  }

  const buttonStyle: ViewStyle[] = [
    styles.btn,
    SIZE_STYLES[size],
    THEME_STYLES[theme],
    disabled && styles.btnDisabled,
    isLoading && styles.btnLoading,
    style,
    backgroundColor && { backgroundColor },
    borderColor && { borderColor, borderWidth: borderWidth ?? 1, borderStyle: 'solid' as 'solid' },
  ].filter(Boolean) as ViewStyle[];

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  const handleClick = () => {
    if (solanaWalletRequired && !solanaWalletConnected) {
      // Show Solana wallet modal (implement as needed in RN)
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

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <PlatformPressable
        style={buttonStyle}
        onPress={handleClick}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || isLoading}
        android_ripple={{ color: '#d1d5db', borderless: false }}
        accessibilityRole={accessibilityRole as any}
        accessibilityLabel={accessibilityLabel || displayLabel}
        accessible={accessible}
        testID={testID}
      >
        {!isLoading ? (
          <View style={styles.btnContent}>
            {leftIcon && (
              <View style={[styles.btnIcon]}> 
                {leftIcon}
              </View>
            )}
            {displayLabel && (
              <Text
                style={[
                  styles.btnLabel,
                  textColor ? { color: textColor } : {},
                  fontStyle,
                ]}
                numberOfLines={truncateText ? 1 : undefined}
                ellipsizeMode={truncateText ? "tail" : undefined}
              >
                {displayLabel}
              </Text>
            )}
            {rightIcon && (
              <View style={[styles.btnIcon]}> 
                {rightIcon}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.btnContent}>
            {customLoader ? customLoader : ButtonLoader ? <ButtonLoader /> : <ActivityIndicator color="#fff" />}
          </View>
        )}
      </PlatformPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
    maxWidth: '90%',
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
