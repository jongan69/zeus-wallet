import { useBitcoinWallet } from "@/contexts/BitcoinWalletProvider";
import { WalletService } from '@/contexts/SolanaWalletProvider';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { notifySuccess } from '@/utils/notification';

import "../polyfills";

export default function IndexRedirect() {
  const [hasWallet, setHasWallet] = useState<boolean | null>(null);
  const { connectDerivedWallet } = useBitcoinWallet();

  useEffect(() => {
    const loadWallet = async () => {
      WalletService.loadWallet().then(async (wallet) => {
        if (wallet !== null) {
          setHasWallet(true);
          notifySuccess('Wallet loaded!');
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
