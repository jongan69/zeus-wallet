import { PublicKey } from "@solana/web3.js";
import { BigNumber } from "bignumber.js";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { xOnlyPubkeyHexToP2tr } from "@/bitcoin";
import ConfirmWithdraw from "@/components/Mint/Modals/ConfirmWithdraw";
import Icon from "@/components/ui/Icons";
import { IconName } from "@/components/ui/Icons/icons";
import { useBitcoinWallet } from "@/contexts/BitcoinWalletProvider";
import useHotReserveBucketsByOwner from "@/hooks/zpl/useHotReserveBucketsByOwner";
import useTwoWayPegConfiguration from "@/hooks/zpl/useTwoWayPegConfiguration";
import usePersistentStore from "@/stores/persistentStore";
import useStore from "@/stores/store";
import { CryptoInputOption } from "@/types/misc";
import { Position } from "@/types/zplClient";
import {
  BTC_DECIMALS,
  DEFAULT_LAYER_FEE,
  DEFAULT_SERVICE_FEE_BASIS_POINT_PERCENT,
  MODAL_NAMES,
} from "@/utils/constant";
import { formatValue } from "@/utils/format";
import { getEstimatedWithdrawalTransactionFee } from "@/utils/interaction";

import CryptoInput from "@/components/ui/CryptoInput/CryptoInput";
import Button from "@/components/ui/WalletButton/Button";

type WithdrawProps = {
  solanaPubkey: PublicKey | null;
  solanaWalletConnected: boolean;
  positions: Position[];
  btcPrice: number;
  zbtcBalance: BigNumber;
  updateTransactions: () => Promise<void>;
  updateZbtcBalance: () => Promise<void>;
};

export default function Withdraw({
  solanaPubkey,
  solanaWalletConnected,
  positions,
  btcPrice,
  zbtcBalance,
  updateTransactions,
  updateZbtcBalance,
}: WithdrawProps) {
  const bitcoinNetwork = usePersistentStore((state) => state.bitcoinNetwork);
  const openModalByName = useStore((state) => state.openModalByName);

  const { wallet: bitcoinWallet } = useBitcoinWallet();
  const { feeRate } = useTwoWayPegConfiguration();
  const { data: hotReserveBuckets } = useHotReserveBucketsByOwner(solanaPubkey);

  const zbtcBalanceInVault =
    positions?.reduce(
      (acc, cur) =>
        acc
          .plus(cur.storedAmount.toString())
          .minus(cur.frozenAmount.toString()),
      new BigNumber(0)
    ) ?? new BigNumber(0);

  const [currentOption, setCurrentOption] = useState<CryptoInputOption>(
    zbtcBalanceInVault?.gt(zbtcBalance)
      ? {
          label: "zBTC",
          type: "Custodial",
          icon: "Lock",
        }
      : {
          label: "zBTC",
          type: null,
        }
  );
  const [prevConnected, setPrevConnected] = useState(solanaWalletConnected);
  const [provideAmountValue, setProvideAmountValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const walletsInHotReserveBuckets = hotReserveBuckets.map((bucket: any) =>
    xOnlyPubkeyHexToP2tr(
      Buffer.from(bucket.scriptPathSpendPublicKey).toString("hex"),
      bitcoinNetwork,
      "internal"
    )
  );
  const connectedWallets = bitcoinWallet?.p2tr
    ? Array.from(new Set([bitcoinWallet.p2tr, ...walletsInHotReserveBuckets]))
    : Array.from(new Set(walletsInHotReserveBuckets));

  const provideAmount = parseFloat(provideAmountValue) || 0;
  const estimatedWithdrawTransactionFeeInSatoshis =
    getEstimatedWithdrawalTransactionFee(feeRate);
  const estimatedWithdrawTransactionFeeInBtc =
    estimatedWithdrawTransactionFeeInSatoshis / 10 ** BTC_DECIMALS;

  const estimateServiceFee =
    DEFAULT_SERVICE_FEE_BASIS_POINT_PERCENT * provideAmount;

  const estimateReceiveAmount = provideAmount
    ? provideAmount - estimatedWithdrawTransactionFeeInBtc - estimateServiceFee
    : 0;

  const estimateReceiveBtcValue =
    btcPrice && estimateReceiveAmount
      ? formatValue(estimateReceiveAmount * btcPrice, 2)
      : formatValue(0);

  const btcValue =
    btcPrice && provideAmount
      ? formatValue(provideAmount * btcPrice, 2)
      : formatValue(0);

  const dropdownOptions: CryptoInputOption[] = [
    {
      label: "zBTC",
      type: "Custodial",
      amount: zbtcBalanceInVault?.div(10 ** BTC_DECIMALS).toNumber(),
      value: formatValue(
        zbtcBalanceInVault?.div(10 ** BTC_DECIMALS).multipliedBy(btcPrice),
        2
      ),
      icon: "Lock",
    },
    {
      label: "zBTC",
      type: null,
      amount: zbtcBalance?.div(10 ** BTC_DECIMALS).toNumber(),
    },
  ];

  const currentBalance = dropdownOptions.find((option) => {
    return (
      option.label === currentOption.label && option.type === currentOption.type
    );
  })?.amount;

  const changeOption = (option: CryptoInputOption) => {
    setCurrentOption(option);
    setProvideAmountValue("");
    setErrorMessage("");
  };

  const handleErrorMessage = (message: string) => {
    setErrorMessage(message);
  };

  const resetInput = () => {
    setProvideAmountValue("");
    setErrorMessage("");
  };

  useEffect(() => {
    setPrevConnected(solanaWalletConnected);
    resetInput();
  }, [solanaWalletConnected]);

  return (
    <View style={styles.actions}>
      {/* Burn Section */}
      <View style={styles.actionItem}>
        <View style={styles.actionTitleRow}>
          <Text style={styles.actionTitle}>Burn</Text>
          {!solanaWalletConnected ? (
            <View style={styles.footerMessage}>
              <Icon name="WalletSmall" />
              <Text style={styles.connectWalletText}>Connect Wallet</Text>
            </View>
          ) : (
            <View style={styles.footerMessage}>
              <Icon name="WalletSmall" />
              <Text style={styles.primaryText}>
                {currentBalance ? formatValue(currentBalance, 6) : "0"}
                <Text style={styles.muteText}> {currentOption.label}</Text>
              </Text>
              {currentOption.icon && (
                <Icon name={currentOption.icon as IconName} size={14} />
              )}
            </View>
          )}
        </View>
        <CryptoInput
          isDisabled={!solanaWalletConnected}
          min={0.0001}
          max={currentBalance ?? 0}
          setAmount={setProvideAmountValue}
          errorMessage={errorMessage}
          value={provideAmountValue}
          isInvalid={!!errorMessage}
          handleErrorMessage={handleErrorMessage}
          fiatValue={btcValue}
          hasActions
          dropdownOptions={dropdownOptions}
          currentOption={currentOption}
          changeOption={changeOption}
        />
      </View>
      {/* Unlock Section */}
      <View style={styles.actionItem}>
        <View style={styles.actionTitleRow}>
          <Text style={styles.actionTitle}>Unlock</Text>
        </View>
        <CryptoInput
          isDisabled={true}
          placeholder={estimateReceiveAmount}
          setAmount={setProvideAmountValue}
          fiatValue={estimateReceiveBtcValue}
          currentOption={{
            label: "tBTC",
            type: null,
          }}
        />
      </View>
      {/* Withdraw Button */}
      <Button
        icon={!solanaWalletConnected && <Icon name="Wallet" />}
        theme="primary"
        label={"Withdraw"}
        size="lg"
        disabled={provideAmount === 0 || !!errorMessage}
        onClick={() => {
          if (connectedWallets.length > 0) {
            setIsWithdrawModalOpen(true);
          } else {
            openModalByName(MODAL_NAMES.ADD_NEW_WALLET);
          }
        }}
        solanaWalletRequired={true}
        style={styles.withdrawButton}
      />
      {/* Info Message */}
      <View style={styles.infoRow}>
        <Icon name="Alert" />
        <Text style={styles.infoText}>
          The withdrawal process takes about 24 hours
        </Text>
      </View>
      {/* Confirm Withdraw Modal */}
      {connectedWallets.length > 0 && (
        <ConfirmWithdraw
          isOpen={isWithdrawModalOpen}
          onClose={() => {
            setIsWithdrawModalOpen(false);
          }}
          solanaPubkey={solanaPubkey}
          withdrawAmount={provideAmount}
          assetFrom={{
            name: "zBTC",
            amount: formatValue(provideAmount, 6),
            isLocked: currentOption.type === "Custodial",
          }}
          assetTo={{
            name: "BTC",
            amount: formatValue(estimateReceiveAmount, 6),
            isLocked: false,
          }}
          positions={positions}
          connectedWallets={connectedWallets}
          serviceFee={formatValue(estimateServiceFee, 6)}
          minerFee={formatValue(
            estimatedWithdrawTransactionFeeInBtc,
            8
          ).replace(/\.?0+$/, "")}
          layerFee={formatValue(DEFAULT_LAYER_FEE, 2)}
          updateTransactions={updateTransactions}
          updateZbtcBalance={updateZbtcBalance}
          resetInput={resetInput}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "column",
    gap: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  actionItem: {
    marginBottom: 16,
  },
  actionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  actionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 8,
  },
  footerMessage: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  connectWalletText: {
    color: "#FF4646",
    marginLeft: 6,
    fontWeight: "500",
  },
  primaryText: {
    color: "#007AFF",
    fontWeight: "bold",
    marginLeft: 6,
  },
  muteText: {
    color: "#888",
    fontWeight: "400",
  },
  withdrawButton: {
    marginTop: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  infoText: {
    marginLeft: 8,
    color: "#666",
    fontWeight: "500",
  },
});
