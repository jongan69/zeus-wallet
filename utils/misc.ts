

import { SolanaNetwork } from "@/types/store";

export const getSolanaExplorerUrl = (
  solanaNetwork: SolanaNetwork,
  type: "address" | "tx",
  target: string | undefined
) => {
  if (!target) return "";

  switch (solanaNetwork) {
    case SolanaNetwork.Devnet:
      return `https://explorer.solana.com/${type}/${target}?cluster=devnet`;
    default:
      return `https://explorer.solana.com/${type}/${target}`;
  }
};

export const handleCopy = (value: string = "") => {
  if (!value) return;
  navigator.clipboard.writeText(value);
};
