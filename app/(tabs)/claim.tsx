import ClaimWidget from "@/components/Widgets/ClaimWidget/ClaimWidget";
import usePersistentStore from "@/stores/persistentStore";
import { BitcoinNetwork } from "@/types/store";
import { Text, View } from "react-native";

export default function ClaimPage() {
  const bitcoinNetwork = usePersistentStore((state) => state.bitcoinNetwork);

  if (!bitcoinNetwork || bitcoinNetwork !== BitcoinNetwork.Regtest) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>Feature Unavailable</Text>
          <Text style={{ color: "#666" }}>
            Claim feature is only available on Regtest network.
            <br />
            Please switch to Regtest network to use this feature.
          </Text>
        </View>
      </View>
    );
  }

  return <ClaimWidget />
}