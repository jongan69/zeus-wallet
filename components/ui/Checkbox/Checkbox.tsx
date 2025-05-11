import CheckBox from "@react-native-community/checkbox";
import React from "react";
import { StyleSheet, View } from "react-native";

export interface CheckboxProps {
  /** Is Checkbox Checked */
  checked: boolean;
  /** Is Checkbox Disabled */
  disabled?: boolean;
  /** Handle Checkbox Change */
  handleChange?: (checked: boolean) => void;
  /** Optional style for the container */
  style?: object;
}

const Checkbox = ({
  checked,
  disabled,
  handleChange,
  style,
}: CheckboxProps) => {
  return (
    <View style={[styles.container, style]}>
      <CheckBox
        value={checked}
        disabled={disabled}
        onValueChange={handleChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 32,
    width: 32,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Checkbox;
