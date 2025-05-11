import "../polyfills";
import 'react-native-reanimated';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { BitcoinWalletProvider } from '@/contexts/BitcoinWalletProvider';
import { SolanaWalletProvider } from '@/contexts/SolanaWalletProvider';
import { ZplClientProvider } from '@/contexts/ZplClientProvider';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';

export default function Layout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <SolanaWalletProvider>
      <ZplClientProvider>
        <BitcoinWalletProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </BitcoinWalletProvider>
      </ZplClientProvider>
    </SolanaWalletProvider>
  );
}
