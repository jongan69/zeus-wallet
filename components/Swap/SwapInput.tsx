import Button from '@/components/ui/Button/Button';
import CryptoInput from '@/components/ui/CryptoInput/CryptoInput';
import Dropdown from '@/components/ui/CryptoInput/Dropdown';
import Icon from '@/components/ui/Icons';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { useSolanaWallet } from '@/contexts/SolanaWalletProvider';
import { useTheme } from '@/hooks/theme/useTheme';
import { fetchQuote, swapFromEvm, swapFromSolana } from '@mayanfinance/swap-sdk';
import { Transaction, VersionedTransaction } from '@solana/web3.js';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';
import { ethers } from 'ethers';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, ScrollView, StyleSheet, View } from 'react-native';

type ChainOption = 'solana' | 'ethereum';

const tokenOptions = {
  solana: [
    { label: 'SOL', type: null, icon: 'Sol', value: 'So11111111111111111111111111111111111111112' },
    { label: 'USDC', type: null, icon: 'Sol', value: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' },
    { label: 'USDT', type: null, icon: 'Sol', value: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB' },
  ],
  ethereum: [
    { label: 'ETH', type: null, icon: 'btc', value: '0x0000000000000000000000000000000000000000' },
    { label: 'USDC', type: null, icon: 'btc', value: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' },
    { label: 'USDT', type: null, icon: 'btc', value: '0xdac17f958d2ee523a2206206994597c13d831ec7' },
  ],
};

const chainOptions: { label: string; value: ChainOption; icon: string }[] = [
  { label: 'Solana', value: 'solana', icon: 'Sol' },
  { label: 'Ethereum', value: 'ethereum', icon: 'btc' },
];

// Inline ConnectEthereumButton using your custom Button
function ConnectEthereumButton({ label = "Connect Ethereum Wallet" }) {
  const { isOpen, open } = useWalletConnectModal();
  const [authorizationInProgress, setAuthorizationInProgress] = useState(false);
  const handleConnectPress = useCallback(async () => {
    setAuthorizationInProgress(true);
    try {
      if (isOpen) return;
      await open();
    } catch (err: any) {
      alert(err?.message || 'Could not connect to WalletConnect');
    } finally {
      setAuthorizationInProgress(false);
    }
  }, [open, isOpen]);
  return (
    <Button
      label={label}
      type="primary"
      icon="Wallet"
      iconPosition="left"
      onClick={handleConnectPress}
      isLoading={authorizationInProgress}
      disabled={authorizationInProgress}
    />
  );
}

const SwapForm: React.FC = () => {
  const [sourceChain, setSourceChain] = useState<ChainOption>('solana');
  const [destinationChain, setDestinationChain] = useState<ChainOption>('ethereum');
  const [fromToken, setFromToken] = useState<any>(tokenOptions['solana'][0]);
  const [toToken, setToToken] = useState<any>(tokenOptions['ethereum'][0]);
  const [amount, setAmount] = useState('');
  const [showSourceChainDropdown, setShowSourceChainDropdown] = useState(false);
  const [showDestinationChainDropdown, setShowDestinationChainDropdown] = useState(false);
  const [showToTokenDropdown, setShowToTokenDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [quote, setQuote] = useState<any>(null);
  const { theme } = useTheme();
  const { provider: evmProvider } = useWalletConnectModal();
  const { publicKey, signTransaction, connection } = useSolanaWallet();
  // Animated fade-in for card
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Theme colors
  const cardBgGradient = theme === 'light'
    ? ['#f8fafc', '#e0e7ff', '#fff']
    : ['#181A20', '#232946', '#181A20'];
  const cardShadow = theme === 'light' ? '#b6c0e0' : '#232946';
  const accent = theme === 'light' ? '#546CF1' : '#43B4CA';
  const border = theme === 'light' ? '#E0E0E0' : '#232946';
  const text = theme === 'light' ? '#181A20' : '#fff';
  const subText = theme === 'light' ? '#888' : '#9BA1A6';
  const error = '#EC4664';
  const success = '#43B4CA';
  const cardBg = theme === 'light' ? '#fff' : '#181A20';
  const inputBg = theme === 'light' ? '#F7F8FA' : '#232946';

  // Destination address logic
  const destinationAddress = useMemo(() => {
    if (sourceChain === 'solana') {
      // EVM address needed
      const session = evmProvider?.session;
      if (session && typeof session === 'object' && 'namespaces' in session) {
        // WalletConnect v2
        // @ts-ignore
        const eip155 = session.namespaces?.eip155;
        if (eip155 && Array.isArray(eip155.accounts) && eip155.accounts[0]) {
          return eip155.accounts[0];
        }
      }
      return '';
    }
    // Solana address needed
    return publicKey?.toBase58() || '';
  }, [sourceChain, evmProvider, publicKey]);

  // EVM connection check
  const isEvmConnected = useMemo(() => {
    const session = evmProvider?.session;
    if (session && typeof session === 'object' && 'namespaces' in session) {
      // WalletConnect v2
      // @ts-ignore
      const eip155 = session.namespaces?.eip155;
      if (eip155 && Array.isArray(eip155.accounts) && eip155.accounts[0]) {
        return true;
      }
    }
    return false;
  }, [evmProvider]);

  // Handle chain change
  const handleChangeChain = (mode: 'source' | 'destination', chain: ChainOption) => {
    if (mode === 'source') {
      setSourceChain(chain);
      setFromToken(tokenOptions[chain][0]);
      const dest = chain === 'solana' ? 'ethereum' : 'solana';
      setDestinationChain(dest as ChainOption);
      setToToken(tokenOptions[dest][0]);
    } else {
      setDestinationChain(chain);
      setToToken(tokenOptions[chain][0]);
      const src = chain === 'solana' ? 'ethereum' : 'solana';
      setSourceChain(src as ChainOption);
      setFromToken(tokenOptions[src][0]);
    }
    setQuote(null);
  };

  // Fetch quote
  const handleFetchQuote = async () => {
    setLoading(true);
    setMessage('Fetching quote...');
    setQuote(null);
    try {
      const quotes = await fetchQuote({
        amount: Number(amount),
        fromToken: fromToken.value,
        toToken: toToken.value,
        fromChain: sourceChain,
        toChain: destinationChain,
        slippageBps: 300,
        gasDrop: 0.01,
        referrer: destinationAddress,
      });
      setQuote(quotes[0]);
      setMessage('Quote received.');
    } catch (err: any) {
      setMessage('Failed to fetch quote: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Swap
  const handleSwap = async () => {
    if (!quote) return;
    setLoading(true);
    setMessage('Submitting swap...');
    try {
      if (sourceChain === 'solana') {
        const tx = await swapFromSolana(
          quote,
          publicKey?.toBase58() || '',
          destinationAddress,
          { solana: publicKey?.toBase58() || '' },
          async (tx: Transaction | VersionedTransaction) => {
            if (tx instanceof Transaction) {
              return signTransaction(tx) as Promise<any>;
            } else if (tx instanceof VersionedTransaction) {
              return signTransaction(tx) as Promise<any>;
            } else {
              throw new Error('Unknown transaction type');
            }
          },
          connection
        );
        setMessage(`Swap from Solana submitted: ${tx}`);
      } else {
        if (!evmProvider) {
          setMessage('EVM provider not available');
          setLoading(false);
          return;
        }
        const web3Provider = new ethers.BrowserProvider(evmProvider);
        const signer = await web3Provider.getSigner();
        const tx = await swapFromEvm(
          quote,
          destinationAddress,
          '300',
          null,
          signer,
          null,
          {},
          undefined
        );
        setMessage(`Swap from EVM submitted: ${tx}`);
      }
    } catch (err: any) {
      setMessage('Swap failed: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Form validation
  const isFormValid = useMemo(() => {
    return !!destinationAddress && !!fromToken && !!toToken && !!amount && Number(amount) > 0;
  }, [destinationAddress, fromToken, toToken, amount]);

  // Should connect button be shown?
  const needsEvm = (sourceChain === 'ethereum' || destinationChain === 'ethereum');
  const showConnectEvm = needsEvm && !isEvmConnected;

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      {showConnectEvm && (
        <View style={{ marginBottom: 20, width: '100%', alignItems: 'center' }}>
          <ConnectEthereumButton />
          <ThemedText style={{ color: '#EC4664', marginTop: 8, textAlign: 'center' }}>
            Please connect your Ethereum wallet to continue.
          </ThemedText>
        </View>
      )}
      <Animated.View style={{ opacity: fadeAnim }}>
        <LinearGradient
          colors={cardBgGradient as [string, string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.cardContainer,
            {
              shadowColor: cardShadow,
              borderColor: border,
              backgroundColor: cardBg,
            },
          ]}
        >
          <ThemedView style={styles.headerRow}>
            <Icon name="Swap" size={28} color={accent} />
            <ThemedText type="title" style={[styles.headerText, { color: text }]}>Swap</ThemedText>
          </ThemedView>
          <ThemedText type="subtitle" style={[styles.subText, { color: subText }]}>Instantly bridge your assets between chains.</ThemedText>
          {/* Source Chain */}
          <View style={styles.fieldRow}>
            <ThemedText style={[styles.fieldLabel, { color: subText }]}>Source Chain</ThemedText>
            <View style={[styles.dropdownButton, { backgroundColor: inputBg, borderColor: border, borderWidth: 1, borderRadius: 12 }] }>
              <Button
                label={chainOptions.find(c => c.value === sourceChain)?.label || ''}
                type="secondary"
                size="medium"
                icon={chainOptions.find(c => c.value === sourceChain)?.icon as any}
                iconPosition="left"
                onClick={() => setShowSourceChainDropdown(true)}
              />
            </View>
            <Dropdown
              isOpen={showSourceChainDropdown}
              onClose={() => setShowSourceChainDropdown(false)}
              dropdownOptions={chainOptions.map(c => ({ label: c.label, type: null, icon: c.icon }))}
              changeOption={option => {
                const found = chainOptions.find(c => c.label === option.label);
                if (found) handleChangeChain('source', found.value);
              }}
            />
          </View>
          {/* Destination Chain */}
          <View style={styles.fieldRow}>
            <ThemedText style={[styles.fieldLabel, { color: subText }]}>Destination Chain</ThemedText>
            <View style={[styles.dropdownButton, { backgroundColor: inputBg, borderColor: border, borderWidth: 1, borderRadius: 12 }] }>
              <Button
                label={chainOptions.find(c => c.value === destinationChain)?.label || ''}
                type="secondary"
                size="medium"
                icon={chainOptions.find(c => c.value === destinationChain)?.icon as any}
                iconPosition="left"
                onClick={() => setShowDestinationChainDropdown(true)}
              />
            </View>
            <Dropdown
              isOpen={showDestinationChainDropdown}
              onClose={() => setShowDestinationChainDropdown(false)}
              dropdownOptions={chainOptions.map(c => ({ label: c.label, type: null, icon: c.icon }))}
              changeOption={option => {
                const found = chainOptions.find(c => c.label === option.label);
                if (found) handleChangeChain('destination', found.value);
              }}
            />
          </View>
          {/* Amount and From Token */}
          <View style={styles.fieldRow}>
            <ThemedText style={[styles.fieldLabel, { color: subText }]}>From</ThemedText>
            <CryptoInput
              currentOption={fromToken}
              dropdownOptions={tokenOptions[sourceChain]}
              changeOption={option => setFromToken(option)}
              value={amount}
              setAmount={setAmount}
              hasActions={false}
            />
          </View>
          {/* To Token */}
          <View style={styles.fieldRow}>
            <ThemedText style={[styles.fieldLabel, { color: subText }]}>To</ThemedText>
            <View style={[styles.dropdownButton, { backgroundColor: inputBg, borderColor: border, borderWidth: 1, borderRadius: 12 }] }>
              <Button
                label={toToken.label}
                type="secondary"
                size="medium"
                icon={toToken.icon as any}
                iconPosition="left"
                onClick={() => setShowToTokenDropdown(true)}
              />
            </View>
            <Dropdown
              isOpen={showToTokenDropdown}
              onClose={() => setShowToTokenDropdown(false)}
              dropdownOptions={tokenOptions[destinationChain]}
              changeOption={option => setToToken(option)}
            />
          </View>
          {/* Destination Address */}
          <View style={styles.fieldRow}>
            <ThemedText style={[styles.fieldLabel, { color: subText }]}>Destination Address</ThemedText>
            <ThemedText style={[styles.addressText, { backgroundColor: inputBg, color: text }]} numberOfLines={1} ellipsizeMode="tail">
              {destinationAddress || 'NULL'}
            </ThemedText>
          </View>
          {/* Quote and Actions */}
          <View style={[styles.actionButton, { backgroundColor: accent, borderRadius: 14, shadowColor: accent, shadowOpacity: 0.2, shadowRadius: 12 }] }>
            <Button
              label="Fetch Quote"
              type="primary"
              size="large"
              icon="Swap"
              iconPosition="left"
              onClick={handleFetchQuote}
              disabled={!isFormValid || loading || showConnectEvm}
              isLoading={loading}
            />
          </View>
          {quote && (
            <View style={[styles.quoteBox, { backgroundColor: inputBg }] }>
              <ThemedText style={[styles.quoteLabel, { color: subText }]}>Expected amount out:</ThemedText>
              <ThemedText style={[styles.quoteValue, { color: accent }]}>{quote.expectedAmountOut}</ThemedText>
            </View>
          )}
          {quote && (
            <View style={[styles.actionButton, { backgroundColor: accent, borderRadius: 14, shadowColor: accent, shadowOpacity: 0.2, shadowRadius: 12 }] }>
              <Button
                label="Swap"
                type="primary"
                size="large"
                icon="Swap"
                iconPosition="left"
                onClick={handleSwap}
                disabled={loading || showConnectEvm}
                isLoading={loading}
              />
            </View>
          )}
          {loading && <ActivityIndicator style={styles.loadingIndicator} size="small" color={accent} />}
          {message && (
            <ThemedText style={[styles.message, message.startsWith('Swap failed') ? { color: error } : { color: success }]}>
              {message}
            </ThemedText>
          )}
        </LinearGradient>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 20,
    padding: 24,
    borderRadius: 18,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    alignItems: 'center',
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 10,
    opacity: 0.8,
    borderRadius: 10,
  },
  headerText: {
    marginLeft: 10,
    fontSize: 24,
    fontWeight: 'bold',
  },
  subText: {
    color: '#888',
    marginBottom: 18,
    textAlign: 'center',
  },
  fieldRow: {
    width: '100%',
    marginBottom: 16,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  fieldLabel: {
    fontSize: 15,
    color: '#888',
    marginBottom: 4,
    fontWeight: '500',
  },
  dropdownButton: {
    marginTop: 4,
    marginBottom: 4,
    width: 160,
    alignSelf: 'flex-start',
  },
  addressText: {
    fontSize: 13,
    color: '#333',
    backgroundColor: '#F7F8FA',
    borderRadius: 8,
    padding: 8,
    width: '100%',
  },
  actionButton: {
    width: '100%',
    marginTop: 8,
    marginBottom: 8,
  },
  loadingIndicator: {
    marginTop: 10,
    marginBottom: 4,
  },
  message: {
    marginTop: 12,
    fontSize: 15,
    textAlign: 'center',
  },
  quoteBox: {
    width: '100%',
    backgroundColor: '#F7F8FA',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  quoteLabel: {
    color: '#888',
    fontSize: 14,
    marginBottom: 2,
  },
  quoteValue: {
    color: '#222',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SwapForm;

