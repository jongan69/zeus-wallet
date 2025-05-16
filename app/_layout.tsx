import 'react-native-reanimated';
import "../polyfills";

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Toast, { BaseToast } from 'react-native-toast-message';


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
            <Toast 
              config={{
                warning: (props) => (
                  <BaseToast
                    {...props}
                    style={{ borderLeftColor: 'orange' }}
                    contentContainerStyle={{ backgroundColor: '#FFFBEA' }}
                    text1Style={{
                      color: '#B7791F',
                      fontWeight: 'bold',
                    }}
                    text2Style={{
                      color: '#B7791F',
                    }}
                  />
                ),
                txSuccess: ({ props }) => (
                  <BaseToast
                    style={{ borderLeftColor: '#22c55e' }}
                    contentContainerStyle={{ backgroundColor: '#F0FFF4' }}
                    text1="Transaction Successful"
                    text1Style={{ color: '#166534', fontWeight: 'bold' }}
                    text2Style={{ color: '#166534' }}
                    text2={
                      props?.txId && props?.solanaNetwork
                        ? `Network: ${props.solanaNetwork} | TxID: ${props.txId}`
                        : props?.txId
                        ? `TxID: ${props.txId}`
                        : props?.chain
                        ? `Network: ${props.chain}`
                        : ''
                    }
                  />
                ),
                txFail: ({ props }) => (
                  <BaseToast
                    style={{ borderLeftColor: '#ef4444' }}
                    contentContainerStyle={{ backgroundColor: '#FFF0F0' }}
                    text1="Transaction Failed"
                    text1Style={{ color: '#991b1b', fontWeight: 'bold' }}
                    text2Style={{ color: '#991b1b' }}
                    text2={props?.chain ? `Network: ${props.chain}` : ''}
                  />
                ),
              }}
            />

          </BitcoinWalletProvider>
        </ZplClientProvider>
      </SolanaWalletProvider>
    </ThemeProvider>
  );
}
