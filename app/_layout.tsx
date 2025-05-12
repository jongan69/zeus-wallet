import 'react-native-reanimated';
import "../polyfills";

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { BitcoinWalletProvider } from '@/contexts/BitcoinWalletProvider';
import { SolanaWalletProvider } from '@/contexts/SolanaWalletProvider';
import { ZplClientProvider } from '@/contexts/ZplClientProvider';
import { ThemeProvider } from '@/contexts/ThemeProvider';
import React from 'react';

export default function Layout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider>
      <SolanaWalletProvider>
        <ZplClientProvider>
          <BitcoinWalletProvider>

            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />

          </BitcoinWalletProvider>
        </ZplClientProvider>
      </SolanaWalletProvider>
    </ThemeProvider>
  );
}
