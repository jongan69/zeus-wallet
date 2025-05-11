import { CryptoInputOption } from "@/types/misc";
import { BTC_DECIMALS } from "@/utils/constant";
import { formatValue } from "@/utils/format";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// You will need to implement or adapt these for React Native
// import Divider from "../Divider";
// import Button from "../WalletButton/Button";
// import InputDropdown from "./Dropdown";
// import Icon from "@/components/ui/Icons";

type CryptoInputProps = {
  hasActions?: boolean;
  isDisabled?: boolean;
  placeholder?: number;
  setAmount?: (amount: string) => void;
  min?: number;
  max?: number;
  value?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  handleErrorMessage?: (message: string) => void;
  fiatValue?: string;
  classes?: string;
  currentOption: CryptoInputOption;
  dropdownOptions?: CryptoInputOption[];
  changeOption?: (option: CryptoInputOption) => void;
  decimals?: number;
};

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

export default function CryptoInput({
  hasActions = false,
  isDisabled = false,
  placeholder = 0,
  setAmount,
  fiatValue = "0",
  min,
  max,
  errorMessage,
  value,
  isInvalid,
  handleErrorMessage,
  currentOption,
  dropdownOptions,
  changeOption,
  decimals = BTC_DECIMALS,
}: CryptoInputProps) {
  const [isFocused, setIsFocused] = useState(false);


  const handleChange = (inputValue: string, decimals: number) => {
    if (/^\d*\.?\d*$/.test(inputValue)) {
      if (inputValue.startsWith(".")) {
        inputValue = "0" + inputValue;
      }
      inputValue = calcInputValue(inputValue, decimals);

      if (parseFloat(inputValue) === 0) {
        handleErrorMessage?.("Invalid amount");
      } else if (max !== undefined && parseFloat(inputValue) > max) {
        handleErrorMessage?.("Value exceeds your balance");
      } else if (min !== undefined && parseFloat(inputValue) < min) {
        handleErrorMessage?.(`Value must be greater than ${min}`);
      } else {
        handleErrorMessage?.("");
      }
      setAmount?.(inputValue);
    }
  };

  return (
    <View style={[styles.inputGroup, isInvalid && styles.inputGroupInvalid, isFocused && styles.focused]}>
      <View style={styles.cryptoContainer}>
        <TouchableOpacity
          style={styles.cryptoButton}
          onPress={() => {
            if (!dropdownOptions) return;
          }}
          disabled={!dropdownOptions}
        >
          <Image
            source={{ uri: `/icons/${currentOption?.label.toLowerCase()}.png` }} // Use PNG or adapt for your asset system
            style={styles.cryptoIcon}
          />
          <View style={styles.cryptoLabel}>
            <Text style={styles.cryptoAsset}>{currentOption.label}</Text>
            {currentOption?.type === "Custodial" && (
              // <Icon name="Lock" /> // Replace with your icon implementation
              <Text>🔒</Text>
            )}
            {currentOption?.type && (
              <Text style={styles.cryptoType}>{currentOption?.type}</Text>
            )}
          </View>
          {dropdownOptions && (
            // <Icon name="ChevronDown" size={12} /> // Replace with your icon implementation
            <Text style={{ marginLeft: 8 }}>▼</Text>
          )}
        </TouchableOpacity>
        {/* Implement your dropdown modal here if showDropdown is true */}
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputTop}>
          <TextInput
            maxLength={16}
            style={styles.inputField}
            placeholder={formatValue(placeholder, decimals)}
            editable={!isDisabled}
            onChangeText={(text) => handleChange(text, decimals)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            value={value || ""}
            keyboardType="decimal-pad"
          />
          {hasActions && (
            <TouchableOpacity
              style={styles.maxButton}
              onPress={() => {
                if (!max) return;
                handleErrorMessage?.("");
                const inputValue = calcInputValue(max.toString(), decimals);
                const val = Number(inputValue);
                if (min && val < min) {
                  handleErrorMessage?.(`Value must be greater than ${min}`);
                }
                setAmount?.(formatValue(val, decimals));
              }}
            >
              <Text style={styles.maxButtonText}>Max</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* <Divider /> // Implement a divider if needed */}
        <View style={styles.fiatContainer}>
          {errorMessage ? (
            // <Icon name="Error" /> // Replace with your icon implementation
            <Text style={{ color: "#FF4646" }}>!</Text>
          ) : null}
          <Text style={[styles.fiatText, errorMessage && { color: "#FF4646" }]}>
            {errorMessage || `~$${fiatValue} USD`}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 8,
    // Add more styles as needed
  },
  inputGroupInvalid: {
    borderColor: "#FF4646",
    borderWidth: 1,
  },
  focused: {
    borderColor: "#007AFF",
    borderWidth: 1,
  },
  cryptoContainer: {
    width: 150,
    marginRight: 8,
  },
  cryptoButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
  },
  cryptoIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  cryptoLabel: {
    flex: 1,
    flexDirection: "column",
  },
  cryptoAsset: {
    fontWeight: "bold",
  },
  cryptoType: {
    fontSize: 12,
    color: "#888",
  },
  inputContainer: {
    flex: 1,
  },
  inputTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputField: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#CCC",
    padding: 8,
    fontSize: 16,
  },
  maxButton: {
    marginLeft: 8,
    backgroundColor: "#007AFF",
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  maxButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  fiatContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  fiatText: {
    marginLeft: 4,
    color: "#888",
  },
});
