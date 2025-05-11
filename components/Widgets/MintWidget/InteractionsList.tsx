import Icon from "@/components/ui/Icons";
import useInteractionsList from "@/hooks/hermes/useInteractionsList";
import usePersistentStore from "@/stores/persistentStore";
import { InteractionType } from "@/types/api";
import { BitcoinNetwork, SolanaNetwork } from "@/types/store";
import { BTC_DECIMALS, ZEUS_SCAN_URL } from "@/utils/constant";
import { formatValue } from "@/utils/format";
import { getFullZeusScanUrl } from "@/utils/interaction";
import { BigNumber } from "bignumber.js";
import React from "react";
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const InteractionItem = ({
  interaction,
  index,
  total,
  solanaNetwork,
  bitcoinNetwork,
}: {
  interaction: { interaction_id: string; interaction_type: InteractionType; amount: BigNumber.Value };
  index: number;
  total: number;
  solanaNetwork: string;
  bitcoinNetwork: string;
}) => {
  const isDeposit = interaction.interaction_type === InteractionType.Deposit;
  const url = getFullZeusScanUrl(
    interaction.interaction_id,
    ZEUS_SCAN_URL,
    solanaNetwork as SolanaNetwork,
    bitcoinNetwork as BitcoinNetwork
  );
  const formattedAmount = formatValue(
    new BigNumber(interaction.amount).dividedBy(10 ** BTC_DECIMALS),
    6
  );
  return (
    <TouchableOpacity onPress={() => Linking.openURL(url)}>
      <View style={styles.item}>
        <Text style={styles.itemNumber}>#{total - index}</Text>
        <Text style={styles.itemType}>{isDeposit ? "Deposit" : "Withdrawal"}</Text>
        <View style={styles.itemAmount}>
          <Image
            source={
              isDeposit
                ? require("@/assets/icons/bitcoin.svg")
                : require("@/assets/icons/zbtc.svg")
            }
            style={styles.tokenIcon}
          />
          <Text>
            {formattedAmount} {isDeposit ? "BTC" : "zBTC"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const InteractionsList = () => {
  const solanaNetwork = usePersistentStore((state) => state.solanaNetwork);
  const bitcoinNetwork = usePersistentStore((state) => state.bitcoinNetwork);
  const { data: interactionsData } = useInteractionsList();

  if (!interactionsData?.interactions?.items?.length) return null;

  return (
    <View style={styles.interactionsList}>
      <View style={styles.background} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Icon name="Interaction" />
          <Text style={styles.headerTitle}>
            Total {interactionsData.totalInteractions} Interactions
          </Text>
        </View>
        <View style={styles.list}>
          {interactionsData.interactions.items.slice(0, 8).map((interaction, index) => (
            <InteractionItem
              key={interaction.interaction_id}
              interaction={interaction}
              index={index}
              total={interactionsData.totalInteractions}
              solanaNetwork={solanaNetwork}
              bitcoinNetwork={bitcoinNetwork}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  interactionsList: {
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    padding: 16,
    marginVertical: 8,
    overflow: "hidden",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#eaeaea",
    zIndex: -1,
  },
  content: {
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    marginLeft: 8,
    fontWeight: "bold",
    fontSize: 16,
  },
  list: {},
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemNumber: {
    width: 40,
    fontWeight: "bold",
  },
  itemType: {
    width: 80,
    color: "#007AFF",
  },
  itemAmount: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  tokenIcon: {
    width: 18,
    height: 18,
    marginRight: 4,
  },
});

export default InteractionsList;
