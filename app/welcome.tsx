import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import ParallaxScrollView from '@/components/ui/ParallaxScrollView';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { useBitcoinWallet } from "@/contexts/BitcoinWalletProvider";
import { WalletService } from '@/contexts/SolanaWalletProvider';
import { notifySuccess } from '@/utils/notification';

export default function WelcomeScreen() {
  const { connectDerivedWallet } = useBitcoinWallet();
  const handleGetStarted = async () => {
    // First, create a new wallet
    await WalletService.createWallet().then(async () => {
      notifySuccess('Wallet created!');
    }).then(async () => {
      await WalletService.loadWallet();
      await connectDerivedWallet();
      router.navigate('/(tabs)');
    });
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#0F0F12', dark: '#0F0F12' }}
      headerImage={
        <Image
          source={require('@/assets/images/zeus-logo.png')}
          style={styles.zeusLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.zeusTitle}>Zeus Wallet</ThemedText>
      </ThemedView>
      <ThemedView style={styles.taglineContainer}>
        <ThemedText type="subtitle" style={styles.tagline}>
          Your Secure Mobile Wallet for Bitcoin & Solana
        </ThemedText>
        <ThemedText style={styles.description}>
          Manage your Bitcoin and Solana assets with lightning speed, top-tier security, and a beautiful interface. Zeus Wallet brings the power of multi-chain to your pocket.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.featuresContainer}>
        <View style={styles.feature}>
          <Ionicons name="logo-bitcoin" size={32} color="#F7931A" />
          <ThemedText style={styles.featureText}>Bitcoin Support</ThemedText>
        </View>
        <View style={styles.feature}>
          <MaterialCommunityIcons name="currency-sign" size={32} color="#9945FF" />
          <ThemedText style={styles.featureText}>Solana Support</ThemedText>
        </View>
        <View style={styles.feature}>
          <Ionicons name="flash" size={32} color="#FFD600" />
          <ThemedText style={styles.featureText}>Lightning Fast</ThemedText>
        </View>
        <View style={styles.feature}>
          <Ionicons name="shield-checkmark" size={32} color="#4CAF50" />
          <ThemedText style={styles.featureText}>Secure & Private</ThemedText>
        </View>
      </ThemedView>
      <TouchableOpacity style={styles.ctaButton} onPress={handleGetStarted}>
        <ThemedText style={styles.ctaText}>Get Started</ThemedText>
      </TouchableOpacity>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 8,
  },
  zeusTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFD600',
    letterSpacing: 1.5,
  },
  taglineContainer: {
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  tagline: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#B0BEC5',
    textAlign: 'center',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
    marginVertical: 32,
  },
  feature: {
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    width: 100,
  },
  featureText: {
    marginTop: 8,
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
  },
  ctaButton: {
    backgroundColor: '#FFD600',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 48,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 32,
    shadowColor: '#FFD600',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaText: {
    color: '#0A1931',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  zeusLogo: {
    height: 160,
    width: 160,
    alignSelf: 'center',
    marginTop: 32,
    marginBottom: 8,
  },
}); 