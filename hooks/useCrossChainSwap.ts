import { useSolanaWallet } from '@/contexts/SolanaWalletProvider';
import type { ChainName } from '@mayanfinance/swap-sdk';
import { fetchQuote, swapFromEvm, swapFromSolana } from '@mayanfinance/swap-sdk';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';
import { ethers } from 'ethers';
import { useCallback, useState } from 'react';

export type SwapParams = {
  fromChain: string;
  fromToken: string;
  amount: number;
  toToken?: string;
  destinationAddress: string;
};

export function useCrossChainSwap() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { provider: evmProvider } = useWalletConnectModal();
  const { signTransaction, connection } = useSolanaWallet();

  const swap = useCallback(async ({
    fromChain,
    fromToken,
    amount,
    toToken = 'So11111111111111111111111111111111111111112',
    destinationAddress,
  }: SwapParams) => {
    setLoading(true);
    setMessage('Fetching quote...');
    try {
      const quotes = await fetchQuote({
        amount,
        fromToken,
        toToken,
        fromChain: fromChain as ChainName,
        toChain: 'solana' as ChainName,
        slippageBps: 300,
        gasDrop: 0.01,
        referrer: destinationAddress,
      });
      const quote = quotes[0];
      setMessage('Quote received, initiating swap...');

      if (fromChain === 'solana') {
        const tx = await swapFromSolana(
          quote,
          destinationAddress,
          destinationAddress,
          { solana: destinationAddress },
          signTransaction,
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
  }, [evmProvider, signTransaction, connection]);

  return { swap, loading, message };
} 