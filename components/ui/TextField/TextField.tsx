import Divider from "@/components/ui/Divider";
import Icon from "@/components/ui/Icons";
import React, { ReactNode } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export interface TextFieldProps {
  actionLabel?: ReactNode;
  children?: ReactNode;
  disabled?: boolean;
  type?: "generic" | "amount";
  handleValueChange?: (text: string) => void;
  invalid?: boolean;
  invalidMessage?: string;
  onActionClick?: () => void;
  placeholder: string;
  secondaryValue?: string;
  value?: string | number;
  label?: string;
  showBalance?: boolean;
  balanceValue?: string;
  balanceAsset?: string;
  showLockIcon?: boolean;
}

const TextField = ({
  type = "generic",
  placeholder,
  actionLabel,
  children,
  onActionClick,
  disabled = false,
  invalid = false,
  invalidMessage = "An error occurred",
  secondaryValue = "~$0.00",
  value,
  handleValueChange,
  label,
  showBalance = false,
  balanceValue,
  balanceAsset,
  showLockIcon = false,
}: TextFieldProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {label ? (
          <Text style={styles.label}>{label}</Text>
        ) : null}
        {showBalance && (
          <View style={styles.balanceRow}>
            <Icon name="WalletSmall" size={12} />
            <View style={styles.balanceValueRow}>
              <Text style={styles.balanceValueText}>
                {balanceValue}{" "}
                {balanceAsset ? (
                  <Text style={styles.balanceAssetText}>{balanceAsset}</Text>
                ) : null}
              </Text>
              {showLockIcon && (
                <Icon name="Locks" size={14} />
              )}
            </View>
          </View>
        )}
      </View>
      <View
        style={[
          styles.textField,
          type === "amount" && styles.textFieldAmount,
          invalid && type === "amount" && styles.textFieldAmountInvalid,
          disabled && type === "amount" && styles.textFieldAmountDisabled,
        ]}
      >
        {type === "amount" && children}
        <View style={styles.inputCol}>
          <TextInput
            editable={!disabled}
            style={[
              styles.input,
              type === "generic" && styles.inputGeneric,
              invalid && type === "generic" && styles.inputGenericInvalid,
              type === "amount" && styles.inputAmount,
            ]}
            placeholder={placeholder}
            placeholderTextColor="#A0A0A0"
            value={typeof value === "number" ? String(value) : value}
            onChangeText={handleValueChange}
          />
          {/* Invalid message for generic input */}
          {type === "generic" && invalid && (
            <View style={styles.invalidRow}>
              <Icon name="NoteSmall" size={12} />
              <Text style={styles.invalidText}>{invalidMessage}</Text>
            </View>
          )}
          {/* Footer value and invalid message */}
          {type === "amount" && (
            <>
              <Divider />
              <View style={styles.footerRow}>
                {!invalid ? (
                  <Text style={styles.secondaryValueText}>{secondaryValue}</Text>
                ) : (
                  <View style={styles.invalidRow}>
                    <Icon name="NoteSmall" size={12} />
                    <Text style={styles.invalidText}>{invalidMessage}</Text>
                  </View>
                )}
              </View>
            </>
          )}
        </View>
        {type === "amount" && actionLabel && (
          <TouchableOpacity
            disabled={disabled}
            style={[styles.actionButton, disabled && styles.actionButtonDisabled]}
            onPress={onActionClick}
          >
            {typeof actionLabel === "string" ? (
              <Text style={styles.actionButtonText}>{actionLabel}</Text>
            ) : (
              actionLabel
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default TextField;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    gap: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    color: "#888",
    fontWeight: "500",
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconMute: {
    color: "#A0A0A0",
    marginRight: 4,
  },
  balanceValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  balanceValueText: {
    fontSize: 16,
    color: "#222",
    fontWeight: "500",
  },
  balanceAssetText: {
    color: "#A0A0A0",
    fontSize: 16,
  },
  textField: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#F7F8FA",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 16,
    position: "relative",
  },
  textFieldAmount: {
    borderColor: "#E0E0E0",
    backgroundColor: "#F7F8FA",
  },
  textFieldAmountInvalid: {
    borderColor: "#EC4664",
  },
  textFieldAmountDisabled: {
    opacity: 0.4,
  },
  inputCol: {
    flex: 1,
    flexDirection: "column",
  },
  input: {
    color: "#222",
    backgroundColor: "#F7F8FA",
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 0,
    borderRadius: 12,
  },
  inputGeneric: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontWeight: "500",
  },
  inputGenericInvalid: {
    borderColor: "#EC4664",
    shadowColor: "#EC4664",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  inputAmount: {
    fontSize: 20,
    fontWeight: "700",
    paddingVertical: 4,
    paddingLeft: 16,
    paddingRight: 0,
    maxWidth: "90%",
  },
  invalidRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    justifyContent: "flex-end",
    gap: 8,
  },
  iconError: {
    color: "#EC4664",
    marginRight: 4,
  },
  invalidText: {
    color: "#EC4664",
    fontSize: 14,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
  secondaryValueText: {
    color: "#A0A0A0",
    fontSize: 14,
  },
  actionButton: {
    position: "absolute",
    right: 16,
    top: 16,
    backgroundColor: "#2563EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF7658",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  actionButtonDisabled: {
    opacity: 0.4,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
}); 