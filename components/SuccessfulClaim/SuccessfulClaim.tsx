import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";


export default function SuccessfulClaim({
  claimedAmount,
  onClose,
  onTryStaking,
}: {
  claimedAmount: number;
  onClose: () => void;
  onTryStaking: () => void;
}) {
  // const currentModal = useStore((state) => state.currentModal);

  return (
    // Replace with your custom Modal if available
    <View style={styles.modalBackdrop}>
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          {/* Replace with your Icon component if available */}
          {/* <Icon name="Close" /> */}
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>
        <View style={styles.content}>
          <Text style={styles.title}>You successfully claimed</Text>
          <View style={styles.subtitle}>
            <Image
              source={require("../../assets/icons/tbtc.svg")}
              style={styles.tokenIcon}
            />
            <Text style={styles.amount}>
              {claimedAmount} <Text style={styles.token}>tBTC</Text>
            </Text>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.button} onPress={onTryStaking}>
              {/* <Button ... /> */}
              {/* <Icon name="Provide" /> */}
              <Text style={styles.buttonText}>Try out Staking</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 320,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 1,
  },
  closeText: {
    fontSize: 24,
    color: "#888",
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtitle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  tokenIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  amount: {
    fontSize: 20,
    fontWeight: "bold",
  },
  token: {
    fontSize: 16,
    color: "#888",
  },
  footer: {
    width: "100%",
    marginTop: 24,
  },
  button: {
    backgroundColor: "#007bff",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
