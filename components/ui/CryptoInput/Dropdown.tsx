import Icon from "@/components/ui/Icons";
import { IconName } from "@/components/ui/Icons/icons";
import { CryptoInputOption } from "@/types/misc";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Modal from "../Modal/Modal";

type InputDropdownProps = {
  isOpen: boolean;
  onClose: () => void;
  dropdownOptions: CryptoInputOption[];
  changeOption: (option: CryptoInputOption) => void;
};

export default function InputDropdown({
  isOpen,
  onClose,
  dropdownOptions,
  changeOption,
}: InputDropdownProps) {
  return (
    <Modal
      width={150}
      isOpen={isOpen}
      onClose={onClose}
      isDrawer={false}
      topPosition={80}
      isCentered={false}
      leftPosition={0}
    >
      <View style={styles.dropdownContainer}>
        {dropdownOptions.map((option) => (
          <TouchableOpacity
            key={option.label + option.type}
            style={styles.dropdownItem}
            onPress={() => {
              changeOption(option);
              onClose();
            }}
            activeOpacity={0.7}
          >
            <View style={styles.assetRow}>
              <Image
                source={{ uri: `https://raw.githubusercontent.com/your-repo/icons/main/${option.label.toLowerCase()}.png` }}
                style={styles.assetIcon}
                resizeMode="contain"
              />
              <View style={styles.assetLabelContainer}>
                <View style={styles.assetLabelNameRow}>
                  <Text style={styles.assetLabelText}>{option.label}</Text>
                  <Icon name={option.icon as IconName} size={14} />
                </View>
                {!!option.type && (
                  <Text style={styles.assetLabelType}>{option.type}</Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dropdownContainer: {
    padding: 4,
    width: 150,
    borderRadius: 12,
    backgroundColor: '#f7f7fa',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 8,
    marginBottom: 2,
    backgroundColor: 'white',
  },
  assetRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  assetLabelContainer: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 2,
  },
  assetLabelNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetLabelText: {
    fontSize: 15,
    fontWeight: '500',
    marginRight: 4,
  },
  assetLabelType: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
});
