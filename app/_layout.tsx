import 'react-native-reanimated';
import "../polyfills";

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Toast from 'react-native-toast-message';


import { BitcoinWalletProvider } from '@/contexts/BitcoinWalletProvider';
import { SolanaWalletProvider } from '@/contexts/SolanaWalletProvider';
import { ThemeProvider } from '@/contexts/ThemeProvider';
import { ZplClientProvider } from '@/contexts/ZplClientProvider';

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: 'welcome',
};
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
              <Stack.Screen name="welcome" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
            <Toast />

          </BitcoinWalletProvider>
        </ZplClientProvider>
      </SolanaWalletProvider>
    </ThemeProvider>
  );
}
