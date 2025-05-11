import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import Checkbox from "../Checkbox/Checkbox";
import { IconSymbol } from "../IconSymbol";

export interface DropdownOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface DropdownProps {
  label: string;
  data: DropdownOption[];
  value?: string | number | (string | number)[];
  onChange: (value: string | number | (string | number)[]) => void;
  multiple?: boolean;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function ZeusDropdown({
  label,
  data,
  value,
  onChange,
  multiple = false,
  error,
  placeholder,
  disabled,
}: DropdownProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {multiple ? (
        <MultiSelect
          style={styles.dropdown}
          data={data}
          labelField="label"
          valueField="value"
          value={(value as (string | number)[]).map(String)}
          onChange={onChange}
          placeholder={placeholder}
          disable={disabled}
          renderLeftIcon={() => <IconSymbol name="chevron.right" color="#888" />}
          renderItem={item => (
            <View style={styles.item}>
              <Checkbox checked={Array.isArray(value) && value.includes(item.value)} />
              <Text>{item.label}</Text>
            </View>
          )}
        />
      ) : (
        <Dropdown
          style={styles.dropdown}
          data={data}
          labelField="label"
          valueField="value"
          value={value as string | number}
          onChange={item => onChange(item.value)}
          placeholder={placeholder}
          disable={disabled}
          renderLeftIcon={() => <IconSymbol name="chevron.right" color="#888" />}
        />
      )}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { margin: 8 },
  label: { marginBottom: 4, fontWeight: "bold" },
  dropdown: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 8 },
  item: { flexDirection: "row", alignItems: "center", padding: 8 },
  error: { color: "red", marginTop: 4 },
});
