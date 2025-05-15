import React, { useEffect, useState } from "react";
import { ActivityIndicator, Modal as RNModal, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

import Button from "@/components/ui/Button/Button";
import Icon from "@/components/ui/Icons";
import { IconName } from "@/components/ui/Icons/icons";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";

import { btcToSatoshi, constructDepositToHotReserveTx, convertBitcoinNetwork } from "@/bitcoin";
import { getInternalXOnlyPubkeyFromUserWallet } from "@/bitcoin/wallet";

import { useBitcoinWallet } from "@/contexts/BitcoinWalletProvider";
import { useSolanaWallet } from "@/contexts/SolanaWalletProvider";
import { useZplClient } from "@/contexts/ZplClientProvider";
import useBitcoinUTXOs from "@/hooks/ares/useBitcoinUTXOs";
import { useNetworkConfig } from "@/hooks/misc/useNetworkConfig";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import useHotReserveBucketActions from "@/hooks/zpl/useHotReserveBucketActions";

import usePersistentStore from "@/stores/persistentStore";
import { InteractionType } from "@/types/api";
import { CheckBucketResult } from "@/types/misc";
import { Chain } from "@/types/network";
import { Position } from "@/types/zplClient";
import { BTC_DECIMALS } from "@/utils/constant";

import { notifyTx } from "@/utils/notification";
import { BigNumber } from "bignumber.js";
import { payments } from "bitcoinjs-lib";


export interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
    minerFee: number;
    assetFrom: { name: string; amount: string; isLocked: boolean };
    assetTo: { name: string; amount: string; isLocked: boolean };
    isDepositAll: boolean;
    signPsbt: (psbt: any, tweaked?: boolean) => Promise<string>;
    updateTransactions: () => Promise<void>;
    resetProvideAmountValue: () => void;
    btcPrice: number;
    positions: Position[];
    balance: number;
    max: number;
}

export default function DepositModal({
    isOpen,
    onClose,
    minerFee,
    assetFrom,
    assetTo,
    isDepositAll,
    signPsbt,
    updateTransactions,
    resetProvideAmountValue,
    btcPrice,
    positions,
    balance,
    max
}: DepositModalProps) {
    // const solanaNetwork = usePersistentStore((state) => state.solanaNetwork);
    const bitcoinNetwork = usePersistentStore((state) => state.bitcoinNetwork);
    const { publicKey: solanaPubkey } = useSolanaWallet();
    const { wallet: bitcoinWallet } = useBitcoinWallet();
    const zplClient = useZplClient();
    const networkConfig = useNetworkConfig();
    const [isDepositing, setIsDepositing] = useState(false);
    const [inputAmount, setInputAmount] = useState("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
    // const { feeRate } = useTwoWayPegConfiguration();

    const { checkHotReserveBucketStatus, createHotReserveBucket } = useHotReserveBucketActions(bitcoinWallet);
    // const { data: twoWayPegGuardianSettings } = useTwoWayPegGuardianSettings();
    // const { data: coldReserveBuckets } = useColdReserveBuckets();

    // console.log("[DepositModal] twoWayPegGuardianSettings", twoWayPegGuardianSettings);
    // console.log("[DepositModal] coldReserveBuckets", coldReserveBuckets);
    // const estimatedLockToColdFeeInSatoshis = getEstimatedLockToColdTransactionFee(feeRate);
    // const estimatedLockToColdFeeInBtc = satoshiToBtc(estimatedLockToColdFeeInSatoshis);

    const noticeBackground = useThemeColor({ light: '#FFF3F0', dark: '#2D2320' }, 'background');
    const noticeText = useThemeColor({ light: '#333', dark: '#ECEDEE' }, 'text');
    const secondaryText = useThemeColor({ light: '#888', dark: '#9BA1A6' }, 'icon');
    const inputBorder = useThemeColor({ light: '#ccc', dark: '#444' }, 'icon');
    const maxTextColor = useThemeColor({ light: '#007bff', dark: '#4F8EF7' }, 'tint');

    useEffect(() => {
        const check = async () => {
            const check = await checkHotReserveBucketStatus();
            // console.log("[DepositModal] checkHotReserveBucketStatus", check);
            if (check?.status === CheckBucketResult.NotFound) {
                setShowCreateAccountModal(true);
            }
        }
        check();
    }, [checkHotReserveBucketStatus]);

    const { data: bitcoinUTXOs } = useBitcoinUTXOs(bitcoinWallet?.p2tr);

    const handleErrorMessage = (message: string) => setErrorMessage(message);

    const handleChange = (inputValue: string, decimals: number) => {
        if (/^\d*\.?\d*$/.test(inputValue)) {
            if (inputValue.startsWith(".")) {
                inputValue = "0" + inputValue;
            }
            // Limit decimals
            const parts = inputValue.split(".");
            if (parts.length > 2) {
                inputValue = parts[0] + "." + parts.slice(1).join("");
            }
            if (parts.length === 2 && parts[1].length > decimals) {
                inputValue = parts[0] + "." + parts[1].slice(0, decimals);
            }
            if (parseFloat(inputValue) === 0) {
                handleErrorMessage("Invalid amount");
            } else if (max !== undefined && parseFloat(inputValue) > max) {
                handleErrorMessage("Value exceeds your balance");
            } else if (parseFloat(inputValue) < 0) {
                handleErrorMessage("Value must be positive");
            } else {
                handleErrorMessage("");
            }
            setInputAmount(inputValue);
        }
    };

    const handleMax = () => {
        if (!max) return;
        handleErrorMessage("");
        setInputAmount(max.toFixed(6));
    };

    const handleConfirmDeposit = async () => {
        console.log("[DepositModal] handleConfirmDeposit called");
        if (!zplClient || !solanaPubkey || !bitcoinWallet) {
            console.log("[DepositModal] Missing zplClient, solanaPubkey, or bitcoinWallet", { zplClient, solanaPubkey, bitcoinWallet });
            return;
        }
        if (!bitcoinUTXOs || bitcoinUTXOs.length === 0) {
            console.log("[DepositModal] No UTXOs available", { bitcoinUTXOs });
            setErrorMessage("No UTXOs available");
            return;
        }
        setIsDepositing(true);
        setErrorMessage("");
        try {
            const userXOnlyPublicKey = getInternalXOnlyPubkeyFromUserWallet(bitcoinWallet);
            console.log("[DepositModal] userXOnlyPublicKey", userXOnlyPublicKey);
            if (!userXOnlyPublicKey) throw new Error("User X Only Public Key not found");
            const hotReserveBuckets = await zplClient.getHotReserveBucketsByBitcoinXOnlyPubkey(userXOnlyPublicKey);
            console.log("[DepositModal] hotReserveBuckets", hotReserveBuckets);
            if (!hotReserveBuckets || hotReserveBuckets.length === 0) {
                setErrorMessage("No hot reserve address found");
                setShowCreateAccountModal(true);
                setIsDepositing(false);
                return;
            }
            const targetHotReserveBucket = hotReserveBuckets.find(
                (bucket) => bucket.guardianSetting.toBase58() === networkConfig.guardianSetting
            );
            console.log("[DepositModal] targetHotReserveBucket", targetHotReserveBucket);
            if (!targetHotReserveBucket) throw new Error("Wrong guardian setting");
            const { address: targetHotReserveAddress } = payments.p2tr({
                pubkey: Buffer.from(targetHotReserveBucket.taprootXOnlyPublicKey),
                network: convertBitcoinNetwork(bitcoinNetwork),
            });
            console.log("[DepositModal] targetHotReserveAddress", targetHotReserveAddress);
            if (!targetHotReserveAddress) {
                setErrorMessage("Hot reserve address not found");
                setIsDepositing(false);
                return;
            }
            let depositPsbt;
            try {
                const { psbt } = constructDepositToHotReserveTx(
                    bitcoinUTXOs,
                    targetHotReserveAddress,
                    btcToSatoshi(parseFloat(inputAmount)),
                    userXOnlyPublicKey,
                    1, // TODO: use actual feeRate from config or user input
                    convertBitcoinNetwork(bitcoinNetwork),
                    isDepositAll
                );
                depositPsbt = psbt;
                console.log("[DepositModal] Constructed depositPsbt", depositPsbt);
                Toast.show({
                    text1: "Deposit transaction constructed!",
                    type: "success",
                });
            } catch (e) {
                console.log("[DepositModal] Error constructing deposit transaction", e);
                setErrorMessage(e instanceof Error ? e.message : "Failed to construct deposit transaction");
                setIsDepositing(false);
                return;
            }
            try {
                console.log("[DepositModal] Signing PSBT", depositPsbt);
                const signedPsbt = await signPsbt(depositPsbt, true);
                console.log("[DepositModal] Signed PSBT", signedPsbt);
                // TODO: send transaction to backend and update local state as in web modal
                setTimeout(async () => {
                    console.log("[DepositModal] Updating transactions after deposit");
                    await updateTransactions();
                    setIsDepositing(false);
                    resetProvideAmountValue();
                    notifyTx(true, {
                        chain: Chain.Bitcoin,
                        txId: "", // TODO: get txId from backend response
                        type: InteractionType.Deposit,
                    });
                    onClose();
                }, 2000);
            } catch (signError) {
                console.log("[DepositModal] Deposit failed during signPsbt", signError);
                setErrorMessage("Deposit failed: Please try again later");
                setIsDepositing(false);
            }
        } catch (error) {
            console.log("[DepositModal] Deposit failed (outer catch)", error);
            setErrorMessage(error instanceof Error ? error.message : "Deposit failed");
            setIsDepositing(false);
        }
    };

    const handleCreateAccount = async () => {
        console.log("[CreateAccount] Called");
        setIsDepositing(true);
        try {
            console.log("[CreateAccount] createHotReserveBucket:", createHotReserveBucket);
            console.log("[CreateAccount] bitcoinWallet:", bitcoinWallet);
            if (!createHotReserveBucket) {
                setErrorMessage("createHotReserveBucket is undefined");
                setIsDepositing(false);
                return;
            }
            await createHotReserveBucket();
            console.log("[CreateAccount] Account created, closing modal");
            Toast.show({
                text1: "Account created!",
                type: "success",
            });
            setShowCreateAccountModal(false);
            console.log("[CreateAccount] Re-triggering deposit flow");

            setIsDepositing(true);
        } catch (e) {
            console.log("[CreateAccount] Error:", e);
            Toast.show({
                text1: "Make sure you have SOL in your wallet.",
                type: "error",
            });
            setErrorMessage("Failed to create account. Please try again. Error: " + e);
        } finally {
            setIsDepositing(false);
        }
    };

    return (
        <RNModal visible={isOpen || showCreateAccountModal} transparent animationType="slide" onRequestClose={onClose}>
            <ThemedView style={styles.modalBackdrop}>
                <ThemedView style={styles.modalContainer}>
                    {showCreateAccountModal ? (
                        <>
                            <ThemedText style={{ textAlign: "center", marginVertical: 24 }}>
                                No hot reserve address found. You need to create an account to proceed.
                            </ThemedText>
                            <Button label="Create Account" type="primary" onClick={handleCreateAccount} />
                            <View style={{ height: 10 }} />
                            <Button label="Cancel" type="secondary" onClick={() => setShowCreateAccountModal(false)} />
                        </>
                    ) : (
                        <>
                            {/* Header */}
                            <View style={styles.header}>
                                <Icon name="tbtc" size={18} />
                                <ThemedText style={styles.headerText}>Confirm Deposit</ThemedText>
                            </View>
                            {/* Asset Banner */}
                            <DepositAssetBanner assetFrom={assetFrom} assetTo={assetTo} secondaryText={secondaryText} />
                            {/* Input */}
                            <View style={styles.inputRow}>
                                <TextInput
                                    style={[styles.input, { borderColor: inputBorder, color: secondaryText }, errorMessage && styles.inputError]}
                                    keyboardType="decimal-pad"
                                    placeholder="0.000000"
                                    placeholderTextColor={secondaryText}
                                    value={inputAmount}
                                    onChangeText={(text) => handleChange(text, 6)}
                                />
                                <TouchableOpacity onPress={handleMax}>
                                    <ThemedText style={[styles.maxText, { color: maxTextColor }]}>Max</ThemedText>
                                </TouchableOpacity>
                            </View>
                            <ThemedText style={[styles.availableText, { color: secondaryText }]}>Available: {balance.toFixed(6)} BTC</ThemedText>
                            {errorMessage ? <ThemedText style={styles.errorText}>{errorMessage}</ThemedText> : null}
                            <ThemedText style={[styles.secondaryValue, { color: secondaryText }]}>~${Number(inputAmount) > 0 ? (Number(inputAmount) * btcPrice).toFixed(2) : "0"}</ThemedText>
                            {/* Transaction Fee */}
                            <View style={styles.feeSection}>
                                <ThemedText style={styles.feeLabel}>Transaction Fee</ThemedText>
                                <View style={styles.feeRow}>
                                    <ThemedText>Miner Fee</ThemedText>
                                    <ThemedText>{new BigNumber(minerFee).dividedBy(10 ** BTC_DECIMALS).toFixed(6)} BTC</ThemedText>
                                </View>
                            </View>
                            {/* Notice */}
                            <View style={[styles.noticeBox, { backgroundColor: noticeBackground }]}>
                                <View style={styles.noticeHeader}>
                                    <Icon name="Alert" size={18} />
                                    <ThemedText style={[styles.noticeTitle, { color: '#F59E42' }]}>Notice</ThemedText>
                                </View>
                                <ThemedText style={[styles.noticeText, { color: noticeText }]}>Deposits may take up to 24 hours to complete based on Bitcoin network conditions.</ThemedText>
                            </View>
                            {/* Actions */}
                            <View style={styles.actions}>
                                <Button label="Cancel" type="secondary" onClick={onClose} />
                                <Button
                                    label="Confirm"
                                    type="primary"
                                    onClick={handleConfirmDeposit}
                                    disabled={!!errorMessage || !inputAmount || isDepositing}
                                />
                                {isDepositing && <ActivityIndicator style={{ marginLeft: 8 }} />}
                            </View>
                        </>
                    )}
                </ThemedView>
            </ThemedView>
        </RNModal>
    );
}

function DepositAssetBanner({ assetFrom, assetTo, secondaryText }: { assetFrom: { name: string; amount: string; isLocked: boolean }; assetTo: { name: string; amount: string; isLocked: boolean }, secondaryText: string }) {
    return (
        <View style={styles.assetBanner}>
            {/* From */}
            <View style={styles.assetColumn}>
                <ThemedText style={[styles.assetLabel, { color: secondaryText }]}>Lock</ThemedText>
                <View style={styles.assetRow}>
                    <Icon name={assetFrom.name.toLowerCase() as IconName} size={18} />
                    <ThemedText style={styles.assetAmount}>{assetFrom.amount} {assetFrom.name}</ThemedText>
                    {assetFrom.isLocked && <Icon name={"Lock" as IconName} size={18} />}
                </View>
            </View>
            <Icon name={"DoubleRight" as IconName} size={18} />
            {/* To */}
            <View style={styles.assetColumn}>
                <ThemedText style={[styles.assetLabel, { color: secondaryText }]}>Mint</ThemedText>
                <View style={styles.assetRow}>
                    <Icon name={assetTo.name.toLowerCase() as IconName} size={18} />
                    <ThemedText style={styles.assetAmount}>{assetTo.amount} {assetTo.name}</ThemedText>
                    {assetTo.isLocked && <Icon name={"Lock" as IconName} size={18} />}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContainer: {
        width: 340,
        borderRadius: 12,
        padding: 24,
        alignItems: "stretch",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    headerText: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 8,
    },
    assetBanner: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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
        fontSize: 18,
    },
    feeSection: {
        marginVertical: 12,
    },
    feeLabel: {
        fontWeight: "bold",
        marginBottom: 4,
    },
    feeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    noticeBox: {
        backgroundColor: "#FFF3F0",
        borderRadius: 12,
        padding: 12,
        marginVertical: 12,
    },
    noticeHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    noticeTitle: {
        fontWeight: "bold",
        marginLeft: 8,
        color: "#F59E42",
    },
    noticeText: {
        color: "#333",
    },
    errorText: {
        color: "red",
        marginBottom: 8,
        marginTop: 8,
        textAlign: "center",
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 24,
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 8,
        fontSize: 16,
    },
    inputError: {
        borderColor: "red",
    },
    maxText: {
        marginLeft: 8,
        color: "#007bff",
        fontWeight: "bold",
    },
    secondaryValue: {
        color: "#888",
        marginBottom: 16,
    },
    availableText: {
        color: "#888",
        marginBottom: 4,
        textAlign: "right",
    },
    blockingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.35)',
        zIndex: 10,
    },
});
