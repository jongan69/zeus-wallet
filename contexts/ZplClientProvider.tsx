// import { useConnection } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { createContext, useContext, useMemo } from "react";
import { useSolanaWallet } from "./SolanaWalletProvider";

import { useNetworkConfig } from "@/hooks/misc/useNetworkConfig";
import { ZplClient } from "@/zplClient";
// import { useConnection } from "@solana/wallet-adapter-react";

const ZplClientContext = createContext<ZplClient | null>(null);

export const ZplClientProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // const { connection } = useConnection();
  console.log(process.env.EXPO_PUBLIC_SOLANA_DEVNET_RPC);
  const networkConfig = useNetworkConfig();
  const { publicKey: walletPublicKey, signTransaction, connection } = useSolanaWallet();

  const twoWayPegProgramId = networkConfig.twoWayPegProgramId;
  const liquidityManagementProgramId =
    networkConfig.liquidityManagementProgramId;
  const assetMint = networkConfig.assetMint;

  console.log("walletPublicKey", walletPublicKey);
  console.log("twoWayPegProgramId", twoWayPegProgramId);
  console.log("liquidityManagementProgramId", liquidityManagementProgramId);
  console.log("assetMint", assetMint);

  const client = useMemo(() => {
    if (
      !walletPublicKey ||
      !twoWayPegProgramId ||
      !liquidityManagementProgramId ||
      !assetMint
    ) {
      return null;
    }
    return new ZplClient(
      connection,
      walletPublicKey,
      signTransaction,
      twoWayPegProgramId,
      liquidityManagementProgramId,
      assetMint
    );
  }, [
    connection,
    walletPublicKey,
    twoWayPegProgramId,
    liquidityManagementProgramId,
    assetMint,
    signTransaction,
  ]);

  return (
    <ZplClientContext.Provider value={client}>
      {children}
    </ZplClientContext.Provider>
  );
};

export const useZplClient = (): ZplClient | null => {
  const context = useContext(ZplClientContext);
  if (context === undefined) {
    throw new Error("useZplClient must be used within a ZplClientProvider");
  }
  return context;
};
