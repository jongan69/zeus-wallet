import { getAccount, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PublicKey, PublicKeyInitData, TransactionInstruction } from "@solana/web3.js";
import { BigNumber } from "bignumber.js";
import { BN } from "bn.js";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { convertP2trToTweakedXOnlyPubkey } from "@/bitcoin";

import { useZplClient } from "@/contexts/ZplClientProvider";
import useTwoWayPegGuardianSettings from "@/hooks/hermes/useTwoWayPegGuardianSettings";
import { InteractionType } from "@/types/api";
import { Chain } from "@/types/network";
import { Position } from "@/types/zplClient";
import { BTC_DECIMALS } from "@/utils/constant";
import { notifyError, notifyTx } from "@/utils/notification";
import { useSolanaWallet } from "@/contexts/SolanaWalletProvider";
export interface ConfirmWithdrawProps {
  isOpen: boolean;
  onClose: () => void;
  solanaPubkey: PublicKey | null;
  withdrawAmount: number;
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
  connectedWallets: string[];
  positions: Position[] | undefined;
  serviceFee: string;
  minerFee: string;
  layerFee: string;
  updateTransactions: () => Promise<void>;
  updateZbtcBalance: () => Promise<void>;
  resetInput: () => void;
}

export default function ConfirmWithdraw({
  isOpen,
  onClose,
  solanaPubkey,
  withdrawAmount,
  assetFrom,
  assetTo,
  connectedWallets,
  positions,
  serviceFee,
  minerFee,
  layerFee,
  updateTransactions,
  updateZbtcBalance,
  resetInput,
}: ConfirmWithdrawProps) {
  const zplClient = useZplClient();
  const { data: twoWayPegGuardianSettings } = useTwoWayPegGuardianSettings();
  const { connection } = useSolanaWallet();

  const [selectedWallet] = useState(connectedWallets?.[0] ?? "");
  const [hasUserConfirmed, setHasUserConfirmed] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdraw = () => {
    const action = async () => {
      if (!zplClient) throw new Error("zplClient not found");
      if (!solanaPubkey) throw new Error("Solana Pubkey not found");

      const withdrawAmountBN = new BN(
        new BigNumber(withdrawAmount)
          .multipliedBy(10 ** BTC_DECIMALS)
          .toString()
      );

      const twoWayPegConfiguration =
        await zplClient.getTwoWayPegConfiguration();

      const ixs: TransactionInstruction[] = [];

      // NOTE: asset is in vault, so use the biggest position guardian first
      if (assetFrom.isLocked) {
        if (!positions) {
          return;
        }

        const sortedPositions = positions.toSorted((a, b) =>
          b.storedAmount
            .sub(b.frozenAmount)
            .cmp(a.storedAmount.sub(a.frozenAmount))
        );

        let remainingAmount = withdrawAmountBN.clone();
        for (const position of sortedPositions) {
          const amountToWithdraw = BN.min(
            position.storedAmount.sub(position.frozenAmount),
            remainingAmount
          );

          const twoWayPegGuardianSetting = twoWayPegGuardianSettings.find(
            (setting: { address: PublicKeyInitData; }) =>
              zplClient
                .deriveLiquidityManagementGuardianSettingAddress(
                  new PublicKey(setting.address)
                )
                .toBase58() === position.guardianSetting.toBase58()
          );

          if (!twoWayPegGuardianSetting) return;

          const withdrawalRequestIx = zplClient.constructAddWithdrawalRequestIx(
            solanaPubkey,
            amountToWithdraw,
            convertP2trToTweakedXOnlyPubkey(selectedWallet),
            new PublicKey(twoWayPegGuardianSetting.address),
            twoWayPegConfiguration.layerFeeCollector
          );

          ixs.push(withdrawalRequestIx);
          remainingAmount = remainingAmount.sub(amountToWithdraw);

          if (remainingAmount.eq(new BN(0))) break;
        }
        // NOTE: asset is in wallet, so need to check all guardians store quota and store to the biggest quota guardian first
      } else {
        const twoWayPegGuardiansWithQuota = await Promise.all(
          twoWayPegGuardianSettings.map(async (twoWayPegGuardianSetting: { total_amount_pegged: string | number | import("bn.js") | number[] | Uint8Array<ArrayBufferLike> | Buffer<ArrayBufferLike>; address: PublicKeyInitData; asset_mint: PublicKeyInitData; }) => {
            const totalSplTokenMinted = new BN(
              twoWayPegGuardianSetting.total_amount_pegged
            );

            const splTokenVaultAuthority =
              zplClient.deriveSplTokenVaultAuthorityAddress(
                new PublicKey(twoWayPegGuardianSetting.address)
              );

            const vaultAta = getAssociatedTokenAddressSync(
              new PublicKey(twoWayPegGuardianSetting.asset_mint),
              splTokenVaultAuthority,
              true
            );

            let remainingStoreQuota;
            try {
              const tokenAccountData = await getAccount(connection, vaultAta);
              const splTokenBalance = new BN(
                tokenAccountData.amount.toString()
              );
              remainingStoreQuota = totalSplTokenMinted.sub(splTokenBalance);
            } catch {
              remainingStoreQuota = new BN(0);
            }

            return {
              address: twoWayPegGuardianSetting.address,
              remainingStoreQuota,
              liquidityManagementGuardianSetting:
                zplClient.deriveLiquidityManagementGuardianSettingAddress(
                  new PublicKey(twoWayPegGuardianSetting.address)
                ),
            };
          })
        );

        const sortedTwoWayPegGuardiansWithQuota =
          twoWayPegGuardiansWithQuota.toSorted((a: { remainingStoreQuota: any; }, b: { remainingStoreQuota: { cmp: (arg0: any) => any; }; }) =>
            b.remainingStoreQuota.cmp(a.remainingStoreQuota)
          );

        let remainingAmount = withdrawAmountBN.clone();
        for (const twoWayPegGuardian of sortedTwoWayPegGuardiansWithQuota) {
          const amountToWithdraw = BN.min(
            twoWayPegGuardian.remainingStoreQuota,
            remainingAmount
          );

          const storeIx = zplClient.constructStoreIx(
            withdrawAmountBN,
            new PublicKey(twoWayPegGuardian.address)
          );

          const withdrawalRequestIx = zplClient.constructAddWithdrawalRequestIx(
            solanaPubkey,
            amountToWithdraw,
            convertP2trToTweakedXOnlyPubkey(selectedWallet),
            new PublicKey(twoWayPegGuardian.address),
            twoWayPegConfiguration.layerFeeCollector
          );

          ixs.push(storeIx);
          ixs.push(withdrawalRequestIx);

          remainingAmount = remainingAmount.sub(amountToWithdraw);

          if (remainingAmount.eq(new BN(0))) break;
        }
      }

      const sig = await zplClient.signAndSendTransactionWithInstructions(ixs);

      return sig;
    };

    setIsWithdrawing(true);
    action()
      .catch((e) => {
        if (e instanceof Error) {
          notifyError("Sign transaction error");
        } else {
          notifyError("Error in withdrawing, please try again");
          console.error(e);
        }
        setIsWithdrawing(false);
      })
      .then((sig) => {
        // NOTE: Wait for the transaction to be handled by hermes
        setTimeout(async () => {
          await updateZbtcBalance();
          await updateTransactions();
          setIsWithdrawing(false);
          resetInput();
          onClose();
          if (sig) {
            notifyTx(true, {
              chain: Chain.Solana,
              txId: sig,
              type: InteractionType.Withdrawal,
            });
          }
        }, 4444);
      });
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Confirm Withdraw</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.body}>
            {/* Asset Banner */}
            <WithdrawAssetBanner assetFrom={assetFrom} assetTo={assetTo} />

            {/* Connected Wallets */}
            <Text style={styles.sectionTitle}>Send to</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => {/* show wallet picker */}}
            >
              <Text>{selectedWallet}</Text>
            </TouchableOpacity>

            {/* Transaction Fee */}
            <Text style={styles.sectionTitle}>Transaction Fee</Text>
            <View style={styles.feeRow}>
              <Text>Service Fee</Text>
              <Text>{serviceFee} zBTC</Text>
            </View>
            <View style={styles.feeRow}>
              <Text>Miner Fee</Text>
              <Text>{minerFee} BTC</Text>
            </View>
            <View style={styles.feeRow}>
              <Text>Layer Fee</Text>
              <Text>{layerFee} SOL</Text>
            </View>

            {/* Confirmation */}
            <TouchableOpacity
              style={styles.confirmBox}
              onPress={() => setHasUserConfirmed(!hasUserConfirmed)}
            >
              <View style={styles.checkbox}>
                {hasUserConfirmed && <View style={styles.checkboxChecked} />}
              </View>
              <Text style={styles.confirmText}>
                I have confirmed this is the correct BTC address:
              </Text>
            </TouchableOpacity>
            <Text style={styles.walletAddress}>{selectedWallet}</Text>
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                !hasUserConfirmed && styles.buttonDisabled,
              ]}
              disabled={!hasUserConfirmed || isWithdrawing}
              onPress={handleWithdraw}
            >
              {isWithdrawing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.confirmButtonText}>Confirm</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function WithdrawAssetBanner({
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
}) {
  return (
    <View style={styles.assetBanner}>
      <View style={styles.assetColumn}>
        <Text>Burn</Text>
        <Text>
          {assetFrom.amount} {assetFrom.name}
        </Text>
        {assetFrom.isLocked && <Text>🔒</Text>}
      </View>
      <Text style={styles.arrow}>→</Text>
      <View style={styles.assetColumn}>
        <Text>Unlock</Text>
        <Text>
          {assetTo.amount} {assetTo.name}
        </Text>
        {assetTo.isLocked && <Text>🔒</Text>}
      </View>
    </View>
  );
}

// Example styles (customize as needed)
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: { fontSize: 20, fontWeight: "bold" },
  closeButton: { fontSize: 24 },
  body: { paddingVertical: 16 },
  sectionTitle: { fontWeight: "bold", marginTop: 16 },
  feeRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  confirmBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#333",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    width: 14,
    height: 14,
    backgroundColor: "#333",
  },
  confirmText: { flex: 1 },
  walletAddress: { marginTop: 8, fontSize: 12, color: "#888" },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButton: {
    flex: 1,
    marginLeft: 8,
    padding: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: { color: "#fff", fontWeight: "bold" },
  buttonDisabled: { backgroundColor: "#aaa" },
  assetBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 16,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  assetColumn: { alignItems: "center" },
  arrow: { fontSize: 24, marginHorizontal: 16 },
  dropdown: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: "#fafafa",
  },
});
