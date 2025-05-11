import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import Icon from "@/components/ui/Icons";
import Button from "@/components/ui/WalletButton/Button";

export default function CardActionsFooter({
  claimableTimes,
  claimedProgress,
  handleClaim,
  isClaiming,
  isAllConnected,
}: {
  claimableTimes: number;
  claimedProgress: number;
  handleClaim: () => void;
  isClaiming: boolean;
  isAllConnected: boolean;
}) {
  const isFullyClaimed = isAllConnected && claimableTimes === 0;

  return (
    <View style={styles.actionsContainer}>
      <Button
        icon={!isAllConnected && <Icon name="Wallet" />}
        theme="primary"
        size="lg"
        label={isFullyClaimed ? "Fully Claimed" : "Claim"}
        solanaWalletRequired={!isFullyClaimed}
        bitcoinWalletRequired={!isFullyClaimed}
        onClick={!isFullyClaimed ? handleClaim : undefined}
        isLoading={!isFullyClaimed && isClaiming}
        disabled={isFullyClaimed}
      />

      {isAllConnected && claimableTimes > 0 && (
        <View style={styles.claimInfoContainer}>
          <View style={styles.claimInfoTitleRow}>
            <Icon name="Alert" />
            <Text style={styles.claimInfoTitleText}>
              You can claim {claimableTimes} times a day
            </Text>
          </View>
          <View style={styles.progressBarWrapper}>
            <View style={styles.progressBarBg}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  { width: `${claimedProgress}%` },
                ]}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  actionsContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 0,
    backgroundColor: "#181A20",
    borderRadius: 16,
    marginTop: 16,
    shadowColor: "#ffa794",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  claimInfoContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  claimInfoTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  claimInfoTitleText: {
    marginLeft: 8,
    color: "#ffa794",
    fontWeight: "600",
    fontSize: 15,
  },
  progressBarWrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 4,
  },
  progressBarBg: {
    width: "90%",
    height: 10,
    backgroundColor: "#2c2f36",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 10,
    backgroundColor: "#ffa794",
    borderRadius: 6,
  },
});
