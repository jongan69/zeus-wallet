import { NetworkConfig, NetworkConfigMap } from "@/types/network";
import { BitcoinNetwork, SolanaNetwork } from "@/types/store";

// import { CUSTOM_SOLANA_DEVNET_RPC_KEY, getLocalStorage } from "./localStorage";

const NETWORK_CONFIG_MAP: NetworkConfigMap = {
  [`${BitcoinNetwork.Regtest}-${SolanaNetwork.Devnet}`]: {
    binanceUrl: "https://www.binance.com/api",
    aresUrl: process.env.EXPO_PUBLIC_REGTEST_DEVNET_ARES_URL ?? "",
    aegleUrl: process.env.EXPO_PUBLIC_REGTEST_DEVNET_AEGLE_URL ?? "",
    hermesUrl: process.env.EXPO_PUBLIC_REGTEST_DEVNET_HERMES_URL ?? "",
    solanaUrl:
      process.env.EXPO_PUBLIC_SOLANA_DEVNET_RPC ??
      "https://api.devnet.solana.com",
    customSolanaUrl: process.env.EXPO_PUBLIC_SOLANA_DEVNET_RPC!,
    bitcoinExplorerUrl:
      process.env.EXPO_PUBLIC_REGTEST_BITCOIN_EXPLORER_URL ??
      "https://bitcoin-regtest-devnet.zeusscan.work/",
    bootstrapperProgramId:
      process.env.EXPO_PUBLIC_DEVNET_BOOSTRAPPER_PROGRAM_ID ?? "",
    liquidityManagementProgramId:
      process.env.EXPO_PUBLIC_DEVNET_LIQUIDITY_MANAGEMENT_PROGRAM_ID ?? "",
    twoWayPegProgramId:
      process.env.EXPO_PUBLIC_DEVNET_TWO_WAY_PEG_PROGRAM_ID ?? "",
    delegatorProgramId:
      process.env.EXPO_PUBLIC_DEVNET_DELEGATOR_PROGRAM_ID ?? "",
    bitcoinSpvProgramId:
      process.env.EXPO_PUBLIC_DEVNET_BITCOIN_SPV_PROGRAM_ID ?? "",
    layerCaProgramId: process.env.EXPO_PUBLIC_DEVNET_LAYER_CA_PROGRAM_ID ?? "",
    guardianSetting:
      process.env.EXPO_PUBLIC_REGTEST_DEVNET_TWO_WAY_PEG_GUARDIAN_SETTING ?? "",
    assetMint: process.env.EXPO_PUBLIC_REGTEST_ASSET_MINT ?? "",
  },
};

export const getNetworkConfig = (
  solanaNetwork: SolanaNetwork,
  bitcoinNetwork: BitcoinNetwork
): NetworkConfig => {
  const key = `${bitcoinNetwork}-${solanaNetwork}`;
  const config = NETWORK_CONFIG_MAP?.[key];

  if (!config) {
    throw new Error(`No configuration found for network: ${key}`);
  }

  return config;
};
