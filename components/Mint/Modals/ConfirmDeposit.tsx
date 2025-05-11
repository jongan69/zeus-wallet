import { PublicKey } from "@solana/web3.js";
import { AxiosError } from "axios";
import { BigNumber } from "bignumber.js";
import * as bitcoin from "bitcoinjs-lib";
import { Psbt } from "bitcoinjs-lib";
import { toXOnly } from "bitcoinjs-lib/src/psbt/bip371";
import { BN } from "bn.js";
import React, { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, View } from "react-native";

import { btcToSatoshi, constructDepositToHotReserveTx, convertBitcoinNetwork } from "@/bitcoin";
import { sendTransaction } from "@/bitcoin/rpcClient";
import { getInternalXOnlyPubkeyFromUserWallet } from "@/bitcoin/wallet";
import Button from "@/components/ui/Button/Button";
import Icon from "@/components/ui/Icons";
import { IconName } from "@/components/ui/Icons/icons";
import ModalHeader from "@/components/ui/Modal/ModalHeader";
import { useZplClient } from "@/contexts/ZplClientProvider";
import { useNetworkConfig } from "@/hooks/misc/useNetworkConfig";
import useTwoWayPegConfiguration from "@/hooks/zpl/useTwoWayPegConfiguration";
import usePersistentStore from "@/stores/persistentStore";
import useStore from "@/stores/store";
import {
  Interaction,
  InteractionStatus,
  InteractionType,
  UTXOs,
} from "@/types/api";
import { Chain } from "@/types/network";
import { BitcoinWallet } from "@/types/wallet";
import { createAxiosInstances } from "@/utils/axios";
import { BTC_DECIMALS } from "@/utils/constant";
import { formatValue } from "@/utils/format";
import transactionRepo from "@/utils/indexedDB/transaction";
import utxoRepo from "@/utils/indexedDB/utxo";
import { notifyError, notifyTx } from "@/utils/notification";

export interface ConfirmDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  solanaPubkey: PublicKey | null;
  bitcoinWallet: BitcoinWallet | null;
  bitcoinUTXOs: UTXOs | undefined;
  depositAmount: number;
  minerFee: number;
  assetFrom: {
    name: string;
    amount: string;
    isLocked: boolean;
  };
  assetTo: {
    name: string;
    amount: string;
    isLocked: boolean;
  };
  isDepositAll: boolean;
  signPsbt: (psbt: Psbt, tweaked?: boolean) => Promise<string>;
  updateTransactions: () => Promise<void>;
  resetProvideAmountValue: () => void;
}

export default function ConfirmDepositModal({
  isOpen,
  onClose,
  solanaPubkey,
  bitcoinWallet,
  bitcoinUTXOs,
  depositAmount,
  minerFee,
  assetFrom,
  assetTo,
  isDepositAll,
  signPsbt,
  updateTransactions,
  resetProvideAmountValue,
}: ConfirmDepositModalProps) {
  const solanaNetwork = usePersistentStore((state) => state.solanaNetwork);
  const bitcoinNetwork = usePersistentStore((state) => state.bitcoinNetwork);

  const setIsGlobalLoaderOpen = useStore(
    (state) => state.setIsGlobalLoaderOpen
  );

  const zplClient = useZplClient();
  const networkConfig = useNetworkConfig();
  const { feeRate } = useTwoWayPegConfiguration();
  const [isDepositing, setIsDepositing] = useState(false);

  const handleConfirmDeposit = async () => {
    if (!zplClient || !solanaPubkey || !bitcoinWallet) return;

    if (!bitcoinUTXOs || bitcoinUTXOs.length === 0) {
      return;
    }

    setIsDepositing(true);
    setIsGlobalLoaderOpen(true);

    const userXOnlyPublicKey =
      getInternalXOnlyPubkeyFromUserWallet(bitcoinWallet);

    if (!userXOnlyPublicKey)
      throw new Error("User X Only Public Key not found");

    // although we have a array of hotReserveBuckets, but the user could only bind one bitcoin address with the protocol, so we only need to get the first one
    const hotReserveBuckets =
      await zplClient.getHotReserveBucketsByBitcoinXOnlyPubkey(
        userXOnlyPublicKey
      );

    if (!hotReserveBuckets || hotReserveBuckets.length === 0) {
      notifyError("No hot reserve address found");
      return;
    }

    // NOTE: Regtest and Testnet use the same ZPL with different guardian settings, so we need to set guardian setting in env
    const targetHotReserveBucket = hotReserveBuckets.find(
      (bucket) =>
        bucket.guardianSetting.toBase58() === networkConfig.guardianSetting
    );
    if (!targetHotReserveBucket) throw new Error("Wrong guardian setting");

    const { address: targetHotReserveAddress } = bitcoin.payments.p2tr({
      pubkey: Buffer.from(targetHotReserveBucket.taprootXOnlyPublicKey),
      network: convertBitcoinNetwork(bitcoinNetwork),
    });

    if (!targetHotReserveAddress) {
      notifyError("Hot reserve address not found");
      return;
    }

    let depositPsbt;
    let usedBitcoinUTXOs;
    try {
      const { psbt, usedUTXOs } = constructDepositToHotReserveTx(
        bitcoinUTXOs,
        targetHotReserveAddress,
        btcToSatoshi(depositAmount),
        userXOnlyPublicKey,
        feeRate,
        convertBitcoinNetwork(bitcoinNetwork),
        isDepositAll
      );
      depositPsbt = psbt;
      usedBitcoinUTXOs = usedUTXOs;
    } catch (e) {
      if (e instanceof Error && e.message === "Insufficient UTXO") {
        notifyError("Insufficient UTXO, please adjust the amount");
        return;
      } else {
        throw e;
      }
    }

    try {
      const signTx = await signPsbt(depositPsbt, true);

      const amount = depositPsbt.txOutputs[0].value;

      const { aresApi } = createAxiosInstances(solanaNetwork, bitcoinNetwork);

      const txId = await sendTransaction(aresApi, signTx);

      const createdAt = Math.floor(Date.now() / 1000);

      const transaction: Interaction = {
        status: InteractionStatus.BitcoinDepositToHotReserve,
        interaction_id: zplClient
          .deriveInteraction(Buffer.from(txId, "hex"), new BN(0))
          .toBase58(),
        interaction_type: InteractionType.Deposit,
        source: toXOnly(Buffer.from(bitcoinWallet.pubkey, "hex")).toString(
          "hex"
        ),
        destination: solanaPubkey.toBase58(),
        amount: amount.toString(),
        initiated_at: createdAt,
        current_step_at: createdAt,
        app_developer: "Orpheus",
        miner_fee: minerFee.toString(),
        service_fee: "0",
        steps: [
          {
            chain: Chain.Bitcoin,
            action: "DepositToHotReserve", // FIXME: might need to change to enum
            transaction: txId,
            timestamp: createdAt,
          },
        ],
      };

      await transactionRepo.addInteraction(
        bitcoinNetwork,
        solanaPubkey.toBase58(),
        transaction
      );

      await utxoRepo.addUTXOs(bitcoinWallet.p2tr, txId, usedBitcoinUTXOs);

      setTimeout(async () => {
        await updateTransactions();
        setIsDepositing(false);
        setIsGlobalLoaderOpen(false);
        resetProvideAmountValue();
        notifyTx(true, {
          chain: Chain.Bitcoin,
          txId,
          type: InteractionType.Deposit,
        });
        handleCloseModal();
      }, 2000);
    } catch (error) {
      console.error("ConfirmDeposit error", error);
      if (error instanceof Error) {
        const isAxiosError = error instanceof AxiosError;
        console.error(isAxiosError);
      }
      setIsGlobalLoaderOpen(false);
      setIsDepositing(false);
      notifyError("Deposit failed: Please try again later");
    }
  };

  const handleCloseModal = () => {
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <ModalHeader onBtnClick={onClose} title="Confirm Deposit" />
          <View style={styles.section}>
            <View style={styles.headerRow}>
              <View style={styles.iconPrimary}>
                <Icon name="Stake" size={18} color="#1E40AF" />
              </View>
              <Text style={styles.headerText}>Confirm Deposit</Text>
            </View>
          </View>

          <DepositAssetBanner assetFrom={assetFrom} assetTo={assetTo} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Transaction Fee</Text>
            <View style={styles.feeRow}>
              <Text>Miner Fee</Text>
              <Text>
                {formatValue(
                  new BigNumber(minerFee).dividedBy(10 ** BTC_DECIMALS),
                  6
                )}{" "}
                BTC
              </Text>
            </View>
          </View>

          <View style={styles.noticeBox}>
            <View style={styles.noticeHeader}>
              <Icon name="Alert" size={18} style={styles.iconWarning} />
              <Text style={styles.noticeTitle}>Notice</Text>
            </View>
            <Text style={styles.noticeText}>
              Deposits may take up to 24 hours to complete based on Bitcoin network conditions.
            </Text>
          </View>

          <View style={styles.actions}>
            <Button
              type="secondary"
              size="large"
              label="Cancel"
              onPress={onClose}
              style={styles.button}
            />
            <Button
              type="primary"
              size="large"
              label="Confirm"
              isLoading={isDepositing}
              onPress={handleConfirmDeposit}
              style={styles.button}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const DepositAssetBanner = ({
  assetFrom,
  assetTo,
}: {
  assetFrom: {
    name: string;
    amount: string;
    isLocked: boolean;
  };
  assetTo: {
    name: string;
    amount: string;
    isLocked: boolean;
  };
}) => {
  return (
    <View style={styles.assetBanner}>
      <View style={styles.assetColumn}>
        <Text style={styles.assetLabel}>Lock</Text>
        <View style={styles.assetRow}>
          <Icon name={assetFrom.name.toLowerCase() as IconName} size={18} />
          <Text style={styles.assetAmount}>
            {assetFrom.amount} <Text style={styles.assetName}>{assetFrom.name}</Text>
          </Text>
          {assetFrom.isLocked && <Icon name="Lock" style={styles.iconSecondary} />}
        </View>
      </View>
      <Icon name="DoubleRight" size={18} style={styles.iconPrimary} />
      <View style={styles.assetColumn}>
        <Text style={styles.assetLabel}>Mint</Text>
        <View style={styles.assetRow}>
          <Icon name={assetTo.name.toLowerCase() as IconName} size={18} />
          <Text style={styles.assetAmount}>
            {assetTo.amount} <Text style={styles.assetName}>{assetTo.name}</Text>
          </Text>
          {assetTo.isLocked && <Icon name="Lock" style={styles.iconSecondary} />}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },
  contentContainer: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 12,
    padding: 20,
  },
  section: {
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconPrimary: {
    marginRight: 8,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  noticeBox: {
    backgroundColor: "#FFF7E6",
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
  },
  noticeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  iconWarning: {
    color: "#F59E42",
    marginRight: 8,
  },
  noticeTitle: {
    fontWeight: "bold",
  },
  noticeText: {
    color: "#333",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  assetBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
  },
  assetColumn: {
    flex: 1,
    alignItems: "center",
  },
  assetLabel: {
    color: "#6B7280",
    marginBottom: 4,
  },
  assetRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  assetAmount: {
    fontWeight: "bold",
    marginHorizontal: 8,
  },
  assetName: {
    color: "#6B7280",
  },
  iconSecondary: {
    color: "#6B7280",
    marginLeft: 4,
  },
});
