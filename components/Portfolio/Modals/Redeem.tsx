import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { BigNumber } from "bignumber.js";
import { BN } from "bn.js";
import React, { useState } from "react";
import { Button, Modal, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

import Icon from "@/components/ui/Icons";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useSolanaWallet } from "@/contexts/SolanaWalletProvider";
import { useZplClient } from "@/contexts/ZplClientProvider";
import useBalance from "@/hooks/misc/useBalance";
import { useNetworkConfig } from "@/hooks/misc/useNetworkConfig";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import usePositions from "@/hooks/zpl/usePositions";
import usePersistentStore from "@/stores/persistentStore";
import { Chain } from "@/types/network";
import { Position } from "@/types/zplClient";
import { BTC_DECIMALS } from "@/utils/constant";
import { notifyError, notifyTx } from "@/utils/notification";


function calcInputValue(inputValue: string, decimals: number) {
  const parts = inputValue.split(".");
  if (parts.length > 2) {
    inputValue = parts[0] + "." + parts.slice(1).join("");
  }
  if (parts.length === 2 && parts[1].length > decimals) {
    inputValue = parts[0] + "." + parts[1].slice(0, decimals);
  }
  return inputValue;
}

export interface RedeemModalProps {
  isOpen: boolean;
  onClose: () => void;
  btcPrice: number;
  positions: Position[] | undefined;
  balance: number;
  min?: number;
  max?: number;
}

export default function RedeemModal({
  isOpen,
  onClose,
  btcPrice,
  positions,
  balance,
  min,
  max,
}: RedeemModalProps) {
  const solanaNetwork = usePersistentStore((state) => state.solanaNetwork);
  const config = useNetworkConfig();
  const zplClient = useZplClient();
  const { publicKey: solanaPubkey, connection } = useSolanaWallet();
  const { mutate: mutateBalance } = useBalance(solanaPubkey);
  const { mutate: mutatePositions } = usePositions(solanaPubkey);

  const [, setIsRedeeming] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleErrorMessage = (message: string) => setErrorMessage(message);

  const handleChange = (inputValue: string, decimals: number) => {
    if (/^\d*\.?\d*$/.test(inputValue)) {
      if (inputValue.startsWith(".")) {
        inputValue = "0" + inputValue;
      }
      inputValue = calcInputValue(inputValue, decimals);

      if (parseFloat(inputValue) === 0) {
        handleErrorMessage("Invalid amount");
      } else if (max !== undefined && parseFloat(inputValue) > max) {
        handleErrorMessage("Value exceeds your balance");
      } else if (min !== undefined && parseFloat(inputValue) < min) {
        handleErrorMessage(`Value must be greater than ${min}`);
      } else {
        handleErrorMessage("");
      }
      setRedeemAmount(inputValue);
    }
  };

  const handleMax = () => {
    if (!max) return;
    handleErrorMessage("");
    const inputValue = calcInputValue(max.toString(), 6);
    setRedeemAmount(inputValue);
  };

  const handleRedeem = async () => {
    if (!redeemAmount || !zplClient || !solanaPubkey) return;
    setIsRedeeming(true);

    try {
      if (!positions) return;

      const sortedPositions = positions.toSorted((a, b) =>
        b.storedAmount
          .sub(b.frozenAmount)
          .cmp(a.storedAmount.sub(a.frozenAmount))
      );

      const redeemAmountBN = new BN(
        new BigNumber(redeemAmount)
          .multipliedBy(new BigNumber(10).pow(BTC_DECIMALS))
          .toString()
      );

      const ixs: TransactionInstruction[] = [];

      let remainingAmount = redeemAmountBN.clone();
      for (const position of sortedPositions) {
        const amountToRedeem = BN.min(
          position.storedAmount.sub(position.frozenAmount),
          remainingAmount
        );

        const twoWayPegGuardianSetting = config.guardianSetting;

        if (!twoWayPegGuardianSetting)
          throw new Error("Two way peg guardian setting not found");

        if (!zplClient?.assetMint) throw new Error("Asset mint not found");
        const receiverAta = getAssociatedTokenAddressSync(
          zplClient.assetMint,
          solanaPubkey,
          true
        );

        const retrieveIx = zplClient.constructRetrieveIx(
          amountToRedeem,
          new PublicKey(twoWayPegGuardianSetting),
          receiverAta
        );
        ixs.push(retrieveIx);

        // TODO: You can customize the retrieve address here
        if (process.env.NEXT_PUBLIC_DEVNET_REDEEM_ADDRESS) {
          const targetAddress = new PublicKey(
            process.env.NEXT_PUBLIC_DEVNET_REDEEM_ADDRESS
          );
          const toATA = getAssociatedTokenAddressSync(
            new PublicKey(zplClient.assetMint),
            targetAddress,
            true
          );
          // check if the target address has an associated token account
          const info = await connection.getAccountInfo(toATA);
          if (!info) {
            // if not, create one
            const createIx = createAssociatedTokenAccountInstruction(
              solanaPubkey,
              toATA,
              targetAddress,
              new PublicKey(zplClient.assetMint)
            );
            ixs.push(createIx);
          }
          // add a transfer instruction to transfer the tokens to the receive_address
          const transferIx = createTransferInstruction(
            receiverAta,
            toATA,
            solanaPubkey,
            BigInt(amountToRedeem.toString())
          );
          ixs.push(transferIx);
        }

        remainingAmount = remainingAmount.sub(amountToRedeem);

        if (remainingAmount.eq(new BN(0))) break;
      }

      const sig = await zplClient.signAndSendTransactionWithInstructions(ixs);

      await mutateBalance();
      await mutatePositions();
      setRedeemAmount("");
      onClose();
      notifyTx(true, {
        chain: Chain.Solana,
        txId: sig,
        solanaNetwork,
      });
    } catch (error) {
      if (error instanceof Error) {
        notifyError("Sign transaction error");
      } else {
        notifyError("Error in redeeming, please try again");
        console.error("Error in redeeming", error);
      }
    } finally {
      setIsRedeeming(false);
    }
  };

  const secondaryText = useThemeColor({ light: '#888', dark: '#9BA1A6' }, 'icon');
  const inputBorder = useThemeColor({ light: '#ccc', dark: '#444' }, 'icon');
  const maxTextColor = useThemeColor({ light: '#007bff', dark: '#4F8EF7' }, 'tint');
  const modalBg = useThemeColor({ light: '#fff', dark: '#151718' }, 'background');
  const infoLabelColor = useThemeColor({ light: '#666', dark: '#9BA1A6' }, 'icon');
  const infoValueColor = useThemeColor({ light: '#333', dark: '#ECEDEE' }, 'text');

  return (
    <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
      <ThemedView style={styles.modalContainer}>
        <ThemedView style={[styles.modalContent, { backgroundColor: modalBg }] }>
          {/* Header */}
          <View style={styles.header}>
            <Icon name="Withdraw01" size={18} />
            <ThemedText style={styles.headerText}>Redeem zBTC</ThemedText>
          </View>

          {/* Input */}
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { borderColor: inputBorder, color: secondaryText }, errorMessage && styles.inputError]}
              keyboardType="decimal-pad"
              placeholder="0.000000"
              placeholderTextColor={secondaryText}
              value={redeemAmount}
              onChangeText={(text) => handleChange(text, 6)}
            />
            <TouchableOpacity onPress={handleMax}>
              <ThemedText style={[styles.maxText, { color: maxTextColor }]}>Max</ThemedText>
            </TouchableOpacity>
          </View>
          {errorMessage ? <ThemedText style={styles.errorText}>{errorMessage}</ThemedText> : null}
          <ThemedText style={[styles.secondaryValue, { color: secondaryText }]}>~${Number(redeemAmount) > 0 ? (Number(redeemAmount) * btcPrice).toFixed(2) : "0"}</ThemedText>

          {/* Info */}
          <View style={styles.infoRow}>
            <ThemedText style={[styles.infoLabel, { color: infoLabelColor }]}>Available In</ThemedText>
            <ThemedText style={[styles.infoValue, { color: infoValueColor }]}>~ 1 minute</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText style={[styles.infoLabel, { color: infoLabelColor }]}>Remaining zBTC</ThemedText>
            <ThemedText style={[styles.infoValue, { color: infoValueColor }]}>
              {Math.max(balance - Number(redeemAmount), 0).toFixed(6)} zBTC <Icon name="Lock" size={18} />
            </ThemedText>
          </View>

          {/* Actions */}
          <Button
            title="Redeem"
            onPress={handleRedeem}
            // isLoading={isRedeeming}
            disabled={!!errorMessage || !redeemAmount}
          />
          <Button title="Close" onPress={onClose} />
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)"
  },
  modalContent: {
    width: 340, backgroundColor: "#fff", borderRadius: 12, padding: 24, alignItems: "stretch"
  },
  header: {
    flexDirection: "row", alignItems: "center", marginBottom: 16
  },
  headerText: {
    fontSize: 18, fontWeight: "bold", marginLeft: 8
  },
  inputRow: {
    flexDirection: "row", alignItems: "center", marginBottom: 8
  },
  input: {
    flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 8, fontSize: 16
  },
  inputError: {
    borderColor: "red"
  },
  maxText: {
    marginLeft: 8, color: "#007bff", fontWeight: "bold"
  },
  errorText: {
    color: "red", marginBottom: 8
  },
  secondaryValue: {
    color: "#888", marginBottom: 16
  },
  infoRow: {
    flexDirection: "row", justifyContent: "space-between", marginBottom: 8
  },
  infoLabel: {
    color: "#666"
  },
  infoValue: {
    color: "#333"
  },
  button: {
    backgroundColor: "#007bff", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 16
  },
  buttonDisabled: {
    backgroundColor: "#aaa"
  },
  buttonText: {
    color: "#fff", fontWeight: "bold"
  }
});
