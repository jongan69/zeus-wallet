import Button from "@/components/ui/Button/Button";
import Icon from "@/components/ui/Icons";
import Modal from "@/components/ui/Modal/Modal";
import ModalHeader from "@/components/ui/Modal/ModalHeader";
import { BitcoinWallet } from "@/types/wallet";
import { shortenString } from "@/utils/format";
import { notifyError } from "@/utils/notification";
import { PublicKey } from "@solana/web3.js";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export interface AccountProcessProps {
  isOpen: boolean;
  onClose: () => void;
  type: "creation" | "renew" | null;
  createHotReserveBucket: () => Promise<void>;
  reactivateHotReserveBucket: () => Promise<void>;
  openConfirmDepositModal: () => void;
  updateBitcoinUTXOs: () => Promise<void>;
  solanaPubkey: PublicKey | null;
  bitcoinWallet: BitcoinWallet | null;
  depositAmount: number;
}

export default function AccountProcess({
  isOpen,
  onClose,
  type,
  createHotReserveBucket,
  reactivateHotReserveBucket,
  openConfirmDepositModal,
  updateBitcoinUTXOs,
  solanaPubkey,
  bitcoinWallet,
}: AccountProcessProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <View style={styles.modalContainer}>
        <ModalHeader
          onBtnClick={onClose}
          title={type === "creation" ? "Account Creation Required" : "Renew Bitcoin Account"}
        />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>
            {type === "creation"
              ? "Account Creation Required"
              : "Renew Bitcoin Account"}
          </Text>
          <Text style={styles.subtitle}>
            {type === "creation"
              ? (
                <>
                  To proceed with your first deposit, a new account must be created. This process requires a one-time fee of{" "}
                  <Text style={styles.primaryText}>0.05 SOL</Text>.
                </>
              )
              : (
                <>
                  You need to reactivate to continue using this Bitcoin Account. This process requires a one-time fee of{" "}
                  <Text style={styles.primaryText}>0.01 SOL</Text>.
                </>
              )
            }
          </Text>
          <View style={styles.accountsContainer}>
            <View style={styles.accountRow}>
              <Icon name="solana" size={18} />
              <Text style={styles.accountLabel}>Solana</Text>
              <Button
                type="secondary"
                label={shortenString(solanaPubkey?.toBase58() ?? "-", 6)}
                style={styles.accountButton}
                size="small"
              />
            </View>
            <View style={styles.iconContainer}>
              {type === "creation" ? (
                <Icon name="Link" size={18} color="#888" />
              ) : (
                <Icon name="Alert" size={18} color="#FFA500" />
              )}
            </View>
            <View style={styles.accountRow}>
              <Icon name="btc" size={18} />
              <Text style={styles.accountLabel}>Bitcoin</Text>
              <Button
                type="secondary"
                label={shortenString(bitcoinWallet?.p2tr ?? "-", 6)}
                style={styles.accountButton}
                size="small"
              />
            </View>
          </View>
        </View>
        <View style={styles.actionsContainer}>
          <Button
            style={styles.actionButton}
            type="secondary"
            label="Cancel"
            onClick={onClose}
          />
          <Button
            style={styles.actionButton}
            type="primary"
            label={type === "creation" ? "Continue" : "Reactivate"}
            isLoading={isLoading}
            onClick={async () => {
              setIsLoading(true);
              try {
                if (type === "creation") {
                  await createHotReserveBucket();
                } else {
                  await reactivateHotReserveBucket();
                }
                await updateBitcoinUTXOs();
                onClose();
                openConfirmDepositModal();
              } catch (e) {
                console.error(e);
                notifyError(
                  type === "creation"
                    ? "Failed to Create Account"
                    : "Failed to Renew Account"
                );
              } finally {
                setIsLoading(false);
              }
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "stretch",
  },
  contentContainer: {
    marginVertical: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#222",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  primaryText: {
    color: "#4BFFB3", // Example primary color
    fontWeight: "bold",
  },
  accountsContainer: {
    marginVertical: 16,
    alignItems: "center",
  },
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F7F7F7",
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  accountLabel: {
    fontSize: 16,
    color: "#222",
    marginLeft: 8,
    flex: 1,
  },
  accountButton: {
    minWidth: 80,
  },
  iconContainer: {
    alignSelf: "center",
    marginVertical: 8,
    backgroundColor: "#F7F7F7",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});
