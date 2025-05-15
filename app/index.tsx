import { useBitcoinWallet } from "@/contexts/BitcoinWalletProvider";
import { WalletService } from '@/contexts/SolanaWalletProvider';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import "../polyfills";

export default function IndexRedirect() {
  const [hasWallet, setHasWallet] = useState<boolean | null>(null);
  const { connectDerivedWallet } = useBitcoinWallet();

  useEffect(() => {
    const loadWallet = async () => {
      WalletService.loadWallet().then(async (wallet) => {
        if (wallet !== null) {
          setHasWallet(true);
          Toast.show({
            text1: 'Wallet loaded!',
            type: 'success',
          });
          await connectDerivedWallet();
        } else {
          setHasWallet(false);
        }
      });
    };
    loadWallet();
  }, [connectDerivedWallet]);

  if (hasWallet === null) {
    // Optionally show a loading spinner
    return null;
  }

  if (hasWallet) {
    return <Redirect href="/(tabs)" withAnchor={false} />;
  } else {
    return <Redirect href={"/welcome" as any} withAnchor={false} />;
  }
}
