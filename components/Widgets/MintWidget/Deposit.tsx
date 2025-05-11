import { PublicKey } from "@solana/web3.js";
import { Psbt } from "bitcoinjs-lib";
import React, { useEffect, useMemo, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { btcToSatoshi, estimateMaxSpendableAmount, satoshiToBtc } from "@/bitcoin";
import { DepositTooltip } from "@/components/Mint/DepositTooltip/DepositTooltip";
import AccountProcess from "@/components/Mint/Modals/AccountProcess";
import ConfirmDepositModal from "@/components/Mint/Modals/ConfirmDeposit";
import Icon from "@/components/ui/Icons";
import useBitcoinUTXOs from "@/hooks/ares/useBitcoinUTXOs";
import useHotReserveBucketActions from "@/hooks/zpl/useHotReserveBucketActions";
import useTwoWayPegConfiguration from "@/hooks/zpl/useTwoWayPegConfiguration";
import { UTXOs } from "@/types/api";
import { CheckBucketResult } from "@/types/misc";
import { BitcoinWallet } from "@/types/wallet";
import { BTC_DECIMALS } from "@/utils/constant";
import { formatValue } from "@/utils/format";
import { getEstimatedLockToColdTransactionFee } from "@/utils/interaction";
import { notifyError } from "@/utils/notification";

import CryptoInput from "@/components/ui/CryptoInput/CryptoInput";
import Button from "@/components/ui/WalletButton/Button";

type DepositProps = {
  solanaPubkey: PublicKey | null;
  bitcoinWallet: BitcoinWallet | null;
  signPsbt: (psbt: Psbt, tweaked?: boolean) => Promise<string>;
  updateDepositTransactions: () => Promise<void>;
  isAllConnected: boolean;
  btcPrice: number;
  cachedUtxos: UTXOs;
};

function LockSection({
  isAllConnected,
  isBalanceTooltipOpen,
  setIsBalanceTooltipOpen,
  totalSatoshis,
  availableSatoshis,
  unavailableSatoshis,
  maxSpendableSatoshis,
  errorMessage,
  provideAmountValue,
  setProvideAmountValue,
  handleErrorMessage,
  provideValue,
}: any) {
  return (
    <View style={styles.cardActionsItem}>
      <Text style={styles.cardActionsItemTitle}>Lock</Text>
      {!isAllConnected ? (
        <View style={styles.footerMessage}>
          <Icon name="WalletSmall" />
          <Text>Connect Bitcoin Wallet</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.footerMessage}
          onPressIn={() => setIsBalanceTooltipOpen(true)}
          onPressOut={() => setIsBalanceTooltipOpen(false)}
        >
          <DepositTooltip
            totalBalance={totalSatoshis}
            availableUtxoAmount={availableSatoshis}
            unavailableUtxoAmount={unavailableSatoshis}
            isOpen={isBalanceTooltipOpen}
          />
          <Icon name="WalletSmall" />
          <Text style={{ color: "#primaryColor" }}>
            {formatValue(availableSatoshis / 10 ** BTC_DECIMALS, 6)}
            <Text style={{ color: "#888" }}> Available tBTC</Text>
          </Text>
        </TouchableOpacity>
      )}
      <CryptoInput
        isDisabled={!isAllConnected}
        min={0.0001}
        max={satoshiToBtc(maxSpendableSatoshis)}
        setAmount={setProvideAmountValue}
        errorMessage={errorMessage}
        value={provideAmountValue}
        isInvalid={!!errorMessage}
        handleErrorMessage={handleErrorMessage}
        fiatValue={provideValue}
        hasActions
        currentOption={{
          label: "tBTC",
          type: null,
        }}
      />
    </View>
  );
}

function MintSection({ estimateReceivedAmount, estimateReceivedValue, setProvideAmountValue }: any) {
  return (
    <View style={styles.cardActionsItem}>
      <Text style={styles.cardActionsItemTitle}>Mint</Text>
      <CryptoInput
        isDisabled={true}
        placeholder={estimateReceivedAmount}
        setAmount={setProvideAmountValue}
        fiatValue={estimateReceivedValue}
        currentOption={{ label: "zBTC", type: "Custodial" }}
      />
    </View>
  );
}

export default function Deposit({
  solanaPubkey,
  bitcoinWallet,
  signPsbt,
  updateDepositTransactions,
  isAllConnected,
  btcPrice,
  cachedUtxos,
}: DepositProps) {
  console.log('Deposit render', { isAllConnected, btcPrice, cachedUtxos });
  const { feeRate } = useTwoWayPegConfiguration();
  const {
    checkHotReserveBucketStatus,
    createHotReserveBucket,
    reactivateHotReserveBucket,
  } = useHotReserveBucketActions(bitcoinWallet);
  const { data: bitcoinUTXOs, mutate: mutateBitcoinUTXOs } = useBitcoinUTXOs(
    bitcoinWallet?.p2tr
  );

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [provideAmountValue, setProvideAmountValue] = useState("");
  const [isDepositing, setIsDepositing] = useState(false);
  const [accountProcessModalType, setAccountProcessModalType] = useState<
    "creation" | "renew" | null
  >(null);
  const [isConfirmDepositModalOpen, setIsConfirmDepositModalOpen] =
    useState(false);
  const [isBalanceTooltipOpen, setIsBalanceTooltipOpen] = useState(false);

  // Memoized derived values
  const unavailableUTXOs = useMemo(() => {
    const result = bitcoinUTXOs?.filter((utxo) =>
      cachedUtxos.some(
        (cachedUtxo) =>
          cachedUtxo.transaction_id === utxo.transaction_id &&
          cachedUtxo.transaction_index === utxo.transaction_index
      )
    ) ?? [];
    console.log('unavailableUTXOs recalculated', result);
    return result;
  }, [bitcoinUTXOs, cachedUtxos]);

  const availableUTXOs = useMemo(() => {
    const result = bitcoinUTXOs?.filter(
      (utxo) =>
        !unavailableUTXOs.some(
          (unavailableUtxo) =>
            unavailableUtxo.transaction_id === utxo.transaction_id &&
            unavailableUtxo.transaction_index === utxo.transaction_index
        )
    ) ?? [];
    console.log('availableUTXOs recalculated', result);
    return result;
  }, [bitcoinUTXOs, unavailableUTXOs]);

  const estimatedLockToColdFeeInSatoshis = useMemo(() => {
    const fee = getEstimatedLockToColdTransactionFee(feeRate);
    console.log('estimatedLockToColdFeeInSatoshis recalculated', fee);
    return fee;
  }, [feeRate]);

  const estimatedLockToColdFeeInBtc = useMemo(() => {
    const btc = satoshiToBtc(estimatedLockToColdFeeInSatoshis);
    console.log('estimatedLockToColdFeeInBtc recalculated', btc);
    return btc;
  }, [estimatedLockToColdFeeInSatoshis]);

  const provideAmount = parseFloat(provideAmountValue) || 0;
  console.log('provideAmount', provideAmount);

  const provideValue = useMemo(() => {
    const value = btcPrice && provideAmount
      ? formatValue(provideAmount * btcPrice)
      : formatValue(0);
    console.log('provideValue recalculated', value);
    return value;
  }, [btcPrice, provideAmount]);

  const estimateReceivedAmount = useMemo(() => {
    const amt = provideAmount ? provideAmount - estimatedLockToColdFeeInBtc : 0;
    console.log('estimateReceivedAmount recalculated', amt);
    return amt;
  }, [provideAmount, estimatedLockToColdFeeInBtc]);

  const estimateReceivedValue = useMemo(() => {
    const value = btcPrice && estimateReceivedAmount
      ? formatValue(estimateReceivedAmount * btcPrice)
      : formatValue(0);
    console.log('estimateReceivedValue recalculated', value);
    return value;
  }, [btcPrice, estimateReceivedAmount]);

  const maxSpendableSatoshis = useMemo(() => {
    const max = estimateMaxSpendableAmount(availableUTXOs, feeRate);
    console.log('maxSpendableSatoshis recalculated', max);
    return max;
  }, [availableUTXOs, feeRate]);

  const totalSatoshis = useMemo(() => {
    const total = bitcoinUTXOs?.reduce((acc, utxo) => acc + utxo.satoshis, 0) ?? 0;
    console.log('totalSatoshis recalculated', total);
    return total;
  }, [bitcoinUTXOs]);
  const availableSatoshis = useMemo(() => {
    const available = availableUTXOs?.reduce((acc, utxo) => acc + utxo.satoshis, 0) ?? 0;
    console.log('availableSatoshis recalculated', available);
    return available;
  }, [availableUTXOs]);
  const unavailableSatoshis = useMemo(() => {
    const unavailable = unavailableUTXOs?.reduce((acc, utxo) => acc + utxo.satoshis, 0) ?? 0;
    console.log('unavailableSatoshis recalculated', unavailable);
    return unavailable;
  }, [unavailableUTXOs]);

  const handleErrorMessage = (message: string) => {
    console.log('handleErrorMessage', message);
    setErrorMessage(message);
  };

  const openConfirmDepositModal = () => {
    console.log('openConfirmDepositModal');
    setIsConfirmDepositModalOpen(true);
  };

  const updateBitcoinUTXOs = async () => {
    console.log('updateBitcoinUTXOs called');
    await mutateBitcoinUTXOs();
    await updateDepositTransactions();
  };

  const resetProvideAmountValue = () => {
    console.log('resetProvideAmountValue called');
    setProvideAmountValue("");
    setErrorMessage("");
  };

  useEffect(() => {
    console.log('useEffect triggered: isAllConnected changed', isAllConnected);
    resetProvideAmountValue();
  }, [isAllConnected]);

  const handleDepositClick = async () => {
    console.log('handleDepositClick called');
    setIsDepositing(true);
    try {
      const result = await checkHotReserveBucketStatus();
      console.log('checkHotReserveBucketStatus result', result);
      if (result?.status === CheckBucketResult.NotFound) {
        setAccountProcessModalType("creation");
      } else if (
        result?.status === CheckBucketResult.Expired ||
        result?.status === CheckBucketResult.Deactivated
      ) {
        setAccountProcessModalType("renew");
      } else {
        await updateBitcoinUTXOs();
        openConfirmDepositModal();
      }
    } catch (e) {
      console.log('handleDepositClick error', e);
      notifyError("Failed to Deposit");
    } finally {
      setIsDepositing(false);
    }
  };

  return (
    <View style={styles.cardActions}>
      <LockSection
        isAllConnected={isAllConnected}
        isBalanceTooltipOpen={isBalanceTooltipOpen}
        setIsBalanceTooltipOpen={setIsBalanceTooltipOpen}
        totalSatoshis={totalSatoshis}
        availableSatoshis={availableSatoshis}
        unavailableSatoshis={unavailableSatoshis}
        maxSpendableSatoshis={maxSpendableSatoshis}
        errorMessage={errorMessage}
        provideAmountValue={provideAmountValue}
        setProvideAmountValue={setProvideAmountValue}
        handleErrorMessage={handleErrorMessage}
        provideValue={provideValue}
      />
      <MintSection
        estimateReceivedAmount={estimateReceivedAmount}
        estimateReceivedValue={estimateReceivedValue}
        setProvideAmountValue={setProvideAmountValue}
      />
      <Button
        icon={!isAllConnected && <Icon name="Wallet" />}
        theme="primary"
        label="Deposit"
        size="lg"
        style={styles.depositButton}
        isLoading={isDepositing}
        disabled={isAllConnected && (provideAmount === 0 || !!errorMessage)}
        onClick={handleDepositClick}
        solanaWalletRequired={true}
        bitcoinWalletRequired={true}
      />
      {/* Account Process Modal */}
      <Modal
        visible={accountProcessModalType !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setAccountProcessModalType(null)}
      >
        <AccountProcess
          isOpen={accountProcessModalType !== null}
          onClose={() => setAccountProcessModalType(null)}
          type={accountProcessModalType}
          createHotReserveBucket={createHotReserveBucket}
          reactivateHotReserveBucket={reactivateHotReserveBucket}
          openConfirmDepositModal={openConfirmDepositModal}
          updateBitcoinUTXOs={updateBitcoinUTXOs}
          solanaPubkey={solanaPubkey}
          bitcoinWallet={bitcoinWallet}
          depositAmount={provideAmount}
        />
      </Modal>
      {/* Confirm Deposit Modal */}
      <Modal
        visible={isConfirmDepositModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsConfirmDepositModalOpen(false)}
      >
        <ConfirmDepositModal
          isOpen={isConfirmDepositModalOpen}
          onClose={() => setIsConfirmDepositModalOpen(false)}
          solanaPubkey={solanaPubkey}
          bitcoinWallet={bitcoinWallet}
          bitcoinUTXOs={availableUTXOs}
          depositAmount={provideAmount}
          minerFee={estimatedLockToColdFeeInSatoshis}
          assetFrom={{
            amount: provideAmountValue,
            name: "BTC",
            isLocked: false,
          }}
          assetTo={{
            amount: formatValue(provideAmount - estimatedLockToColdFeeInBtc, 6),
            name: "zBTC",
            isLocked: true,
          }}
          isDepositAll={btcToSatoshi(provideAmount) === maxSpendableSatoshis}
          signPsbt={signPsbt}
          updateTransactions={updateDepositTransactions}
          resetProvideAmountValue={resetProvideAmountValue}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  cardActions: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 16,
    // ...add more styles as needed
  },
  cardActionsItem: {
    marginBottom: 24,
    // ...add more styles as needed
  },
  cardActionsItemTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
  },
  footerMessage: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  depositButton: {
    marginTop: 32,
  },
});
