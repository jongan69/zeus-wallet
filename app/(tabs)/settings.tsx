import React, { useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Switch,
  useWindowDimensions,
} from 'react-native';

import Modal from '@/components/ui/Modal/Modal';
import ModalHeader from '@/components/ui/Modal/ModalHeader';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { ThemedText as Text } from '@/components/ui/ThemedText';
import { ThemedView as View } from '@/components/ui/ThemedView';
import { useSolanaWallet, WalletService } from '@/contexts/SolanaWalletProvider';
import { useTheme } from '@/hooks/theme/useTheme';
import { PublicKey } from '@solana/web3.js';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import Toast from 'react-native-toast-message';

export async function RequestAirdrop(publicKey: PublicKey) {
  if (!publicKey) {
    return null;
  }
  try {
    const res = await fetch(`/api/airdrop?address=${publicKey.toBase58()}`);
    const data = await res.json();
    if (data.result) {
      Toast.show({ text1: 'Airdrop requested!', type: 'success' });
    } else {
      Toast.show({ text1: 'Airdrop failed', text2: data.error?.message || 'Unknown error', type: 'error' });
    }
  } catch (e) {
    Toast.show({ text1: 'Airdrop failed', text2: String(e), type: 'error' });
  }
}

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle} type="title">{title}</Text>
    {children}
  </View>
);

// --- Tabs ---
const GeneralTab = () => {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const { publicKey, login } = useSolanaWallet();
  const [loading, setLoading] = useState(false);

  const handleAirdrop = async () => {
    setLoading(true);
    if (!publicKey) {
      await login().then(() => {
        if (publicKey) {
          RequestAirdrop(publicKey);
        }
        setLoading(false);
      });
    } else {
      setLoading(true);
      await RequestAirdrop(publicKey);
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.tabContent, { backgroundColor: theme === 'dark' ? '#121212' : '#fff' }]}>
      <Section title="Preferences">
        <View style={styles.row}>
          <Text style={styles.label} type="subtitle">Dark Mode</Text>
          <Switch value={theme === 'dark'} onValueChange={toggleTheme} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label} type="subtitle">Notifications</Text>
          <Switch value={notifications} onValueChange={setNotifications} />
        </View>
        <View style={{ marginTop: 24 }}>
          <ThemedButton title={loading ? 'Requesting Airdrop...' : 'Request 1 SOL Airdrop'} onPress={handleAirdrop} disabled={loading} />
          <View style={{ marginTop: 8, alignItems: 'center' }}>
            <Text
              style={styles.link}
              onPress={async () => {
                if (publicKey) {
                  await Clipboard.setStringAsync(publicKey.toBase58());
                  Toast.show({ text1: 'Address copied!', type: 'success' });
                }
                Linking.openURL('https://faucet.solana.com/');
              }}
            >
              Devnet Faucet
            </Text>
          </View>
        </View>
      </Section>
    </ScrollView>
  );
};

const SecurityTab = () => {
  const { theme } = useTheme();
  const { exportPrivateKey, logout } = useSolanaWallet();
  const [showExportModal, setShowExportModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

  const handleExport = async () => {
    setExportError(null);
    try {
      const key = await exportPrivateKey();
      setPrivateKey(key);
      setShowExportModal(true);
    } catch (e) {
      setExportError('Failed to export private key: ' + e);
    }
  };

  const handleCopy = () => {
    if (privateKey) {
      Clipboard.setStringAsync(privateKey);
      Alert.alert('Copied', 'Private key copied to clipboard.');
    }
  };

  const handleReset = async () => {
    setResetting(true);
    try {
      await logout();
      const wallet = await WalletService.loadWallet();
      console.log('wallet', wallet);
      setShowResetModal(false);
      Toast.show({
        text1: 'Wallet reset!',
        type: 'success',
      });
    } catch (e) {
      Alert.alert('Error', 'Failed to reset wallet: ' + e);
    } finally {
      setResetting(false);
      router.replace('/welcome');
    }
  };

  return (
    <ScrollView style={[styles.tabContent, { backgroundColor: theme === 'dark' ? '#121212' : '#fff' }]}>
      <Section title="Security Settings">
        <View style={styles.row}>
          <Text style={styles.label}>Biometric Login</Text>
          <Switch value={true} disabled />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Auto-Lock After 1 Minute</Text>
          <Switch value={true} disabled />
        </View>
        <View style={{ marginTop: 24 }}>
          <ThemedButton title="Export Wallet Private Key" onPress={handleExport} />
        </View>
        <View style={{ marginTop: 12 }}>
          <ThemedButton title="Reset Wallet" onPress={() => setShowResetModal(true)} />
        </View>
      </Section>
      {/* Export Private Key Modal */}
      <Modal isOpen={showExportModal} onClose={() => setShowExportModal(false)} isCentered={true}>
        <ModalHeader title="Export Private Key" onBtnClick={() => setShowExportModal(false)} />
        <Text style={{ marginBottom: 12, color: '#d9534f', fontWeight: 'bold' }}>Warning: Never share your private key with anyone.</Text>
        {privateKey ? (
          <>
            <Text selectable style={{ marginBottom: 16, fontSize: 14 }}>{privateKey}</Text>
            <ThemedButton title="Copy to Clipboard" onPress={handleCopy} />
          </>
        ) : (
          <Text style={{ color: 'red' }}>{exportError || 'No private key found.'}</Text>
        )}
      </Modal>
      {/* Reset Wallet Modal */}
      <Modal isOpen={showResetModal} onClose={() => setShowResetModal(false)} isCentered={true}>
        <ModalHeader title="Reset Wallet" onBtnClick={() => setShowResetModal(false)} />
        <Text style={{ marginBottom: 16, color: '#d9534f', fontWeight: 'bold' }}>Are you sure you want to reset your wallet? This action cannot be undone.</Text>
        <ThemedButton title={resetting ? 'Resetting...' : 'Yes, Reset Wallet'} onPress={handleReset} disabled={resetting} />
        <ThemedButton title="Cancel" onPress={() => setShowResetModal(false)} style={{ marginTop: 8 }} />
      </Modal>
    </ScrollView>
  );
};

const AboutTab = () => {
  const { theme } = useTheme();
  return (
    <ScrollView style={[styles.tabContent, { backgroundColor: theme === 'dark' ? '#121212' : '#fff' }]}>
      <Section title="App Info">
        <Text style={styles.text}>Version: 1.0.0</Text>
        <Text style={styles.text}>Build: 100</Text>
      </Section>
      <Section title="Legal">
        <Text
          style={styles.link}
          onPress={() => Linking.openURL('https://example.com/privacy')}>
          Privacy Policy
        </Text>
        <Text
          style={styles.link}
          onPress={() => Linking.openURL('https://example.com/terms')}>
          Terms of Service
        </Text>
      </Section>
    </ScrollView>
  );
};

// --- Main ---
export default function SettingsScreen() {
  const { theme } = useTheme();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'general', title: 'General' },
    { key: 'security', title: 'Security' },
    { key: 'about', title: 'About' },
  ]);

  const renderScene = SceneMap({
    general: GeneralTab,
    security: SecurityTab,
    about: AboutTab,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        lazy
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={styles.indicator}
            style={[styles.tabBar, { backgroundColor: theme === 'dark' ? '#121212' : '#fff' }]}
            activeColor="#1E90FF"
            inactiveColor="#888"
            pressColor="#ddd"
          />
        )}
      />
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
  },
  header: {
    padding: 16,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  tabBar: {
    // backgroundColor: 'white',
    elevation: 0,
    borderBottomWidth: 1,
    // borderBottomColor: '#eee',
  },
  tabLabel: {
    fontWeight: '600',
    fontSize: 14,
  },
  indicator: {
    backgroundColor: '#1E90FF',
    height: 3,
    borderRadius: 2,
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    padding: 16,

    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,

  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    color: '#444',
  },
  text: {
    fontSize: 15,
    color: '#444',
    marginBottom: 6,
  },
  link: {
    fontSize: 15,
    color: '#1E90FF',
    marginBottom: 6,
  },
});
