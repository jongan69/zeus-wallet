import { useBitcoinWallet } from "@/contexts/BitcoinWalletProvider";
import { useSolanaWallet } from "@/contexts/SolanaWalletProvider";
import React, { useEffect } from "react";
import ConnectedView from "./ConnectedView";
import DisconnectedView from "./DisconnectedView";

export default function CardAlertList() {
  const { isAuthenticated: solanaWalletConnected, login: loginSolana } = useSolanaWallet();
  const { connected: bitcoinWalletConnected, connectDerivedWallet } = useBitcoinWallet();

  const isAllConnected = bitcoinWalletConnected && solanaWalletConnected;

  useEffect(() => {
    if (!solanaWalletConnected || !bitcoinWalletConnected) {
      loginSolana();
      connectDerivedWallet();
    }
  }, [solanaWalletConnected, bitcoinWalletConnected, loginSolana, connectDerivedWallet]);
  // Helper for step status

  if (isAllConnected) {
    return <ConnectedView />;
  }

  // Redesigned UI for not connected state
  return <DisconnectedView />;
}


