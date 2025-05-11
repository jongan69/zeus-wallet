import Button from "@/components/ui/Button/Button";
import Divider from "@/components/ui/Divider";
import Icon from "@/components/ui/Icons";
import { IconName } from "@/components/ui/Icons/icons";
import Modal from "@/components/ui/Modal/Modal";
import ModalHeader from "@/components/ui/Modal/ModalHeader";
import Table, { TableCell, TableRow } from "@/components/ui/Table";
import Tooltip from "@/components/ui/Tooltip";
import { shortenString } from "@/utils/format";
import React, { useState } from "react";
import { Clipboard, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "deposit" | "withdraw" | "redeem";
  assetFrom: {
    name: string;
    amount: string;
    isLocked: boolean;
  };
  assetTo?: {
    name: string;
    amount: string;
    isLocked: boolean;
  };
  statusItems: {
    status: "not-started" | "complete" | "pending";
    label: string;
    subLabel?: string;
  }[];
  tableItems: {
    label: {
      label: string;
      rightIcon?: IconName;
      leftIcon?: IconName;
      caption?: string;
      info?: string;
    };
    value: {
      label: string;
      rightIcon?: IconName;
      leftIcon?: IconName;
      link?: string;
    };
  }[] | null;
  actionButton?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
}

export default function TransactionDetailsModal({
  isOpen,
  onClose,
  type,
  assetFrom,
  assetTo,
  statusItems,
  tableItems,
  actionButton,
}: TransactionDetailsModalProps) {
  const [tooltipItemIndex, setTooltipItemIndex] = useState<number | null>(null);

  const handleCopy = async (text: string) => {
    await Clipboard.setString(text);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <View style={styles.modalContainer}>
        <ModalHeader title="Transaction Details" onBtnClick={onClose} />
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <TransactionDetailsAssetBanner type={type} assetFrom={assetFrom} assetTo={assetTo} />
          {statusItems && <StatusBar statusItems={statusItems} />}
          {actionButton && (
            <View style={styles.actionButton}>
              <Button
                type="secondary"
                onClick={actionButton.onClick}
                label={actionButton.label}
                disabled={actionButton.disabled}
              />
            </View>
          )}
          {tableItems && (
            <Table columnSizes={[5, 11]} width="stretch" variant="separated">
              {tableItems.map((item, index) => (
                <View key={item.label.label}>
                  <TableRow size="medium/16px">
                    <TableCell
                      leftIcon={item.label.leftIcon}
                      rightIcon={item.label.rightIcon}
                      rightIconSize={14}
                      rightIconOnMouseEnter={() => {
                        if (item.label.rightIcon === "InfoSmall") setTooltipItemIndex(index);
                      }}
                      rightIconOnMouseLeave={() => {
                        if (item.label.rightIcon === "InfoSmall") setTooltipItemIndex(null);
                      }}
                    >
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={styles.labelText}>{item.label.label}</Text>
                        {item.label.caption && (
                          <Text style={styles.captionText}>({item.label.caption})</Text>
                        )}
                        {item.label.rightIcon === "InfoSmall" && tooltipItemIndex === index && (
                          <View style={styles.tooltipContainer}>
                            <Tooltip isOpen={true} arrowPosition="top-middle" theme="dark-alt" width={255}>
                              <Text style={styles.tooltipText}>{item.label.info}</Text>
                            </Tooltip>
                          </View>
                        )}
                      </View>
                    </TableCell>
                    <TableCell
                      rightIcon={item.value.rightIcon}
                      leftIcon={item.value.leftIcon}
                      rightIconOnClick={
                        item.value.rightIcon === "Copy"
                          ? () => handleCopy(item.value.label)
                          : undefined
                      }
                    >
                      {item.value.link ? (
                        <TouchableOpacity onPress={() => Linking.openURL(item.value.link!)}>
                          <Text style={styles.linkText}>{shortenString(item.value.label, 20)}</Text>
                        </TouchableOpacity>
                      ) : (
                        <Text style={styles.valueText}>{shortenString(item.value.label, 20)}</Text>
                      )}
                    </TableCell>
                  </TableRow>
                  {index !== tableItems.length - 1 && <Divider />}
                </View>
              ))}
            </Table>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const TransactionDetailsAssetBanner = ({
  type,
  assetFrom,
  assetTo,
}: Pick<TransactionDetailsModalProps, "type" | "assetFrom" | "assetTo">) => {
  return (
    <View style={[styles.assetBanner, type === "deposit" ? styles.depositBanner : styles.withdrawBanner]}>
      <View style={styles.assetColumn}>
        <Text style={styles.assetLabel}>{type === "deposit" ? "Locked" : "Burned"}</Text>
        <View style={styles.assetRow}>
          <Icon name={assetFrom.name.toLowerCase() as IconName} size={18} />
          <Text style={styles.assetAmount}>{assetFrom.amount} <Text style={styles.assetName}>{assetFrom.name}</Text></Text>
          {assetFrom.isLocked && <Icon name="Locks" size={18} />}
        </View>
      </View>
      {assetTo && <Icon name="DoubleRight" size={18} />}
      {assetTo && (
        <View style={styles.assetColumn}>
          <Text style={styles.assetLabel}>{type === "deposit" ? "Minted" : "Unlocked"}</Text>
          <View style={styles.assetRow}>
            <Icon name={assetTo.name.toLowerCase() as IconName} size={18} />
            <Text style={styles.assetAmount}>{assetTo.amount} <Text style={styles.assetName}>{assetTo.name}</Text></Text>
            {assetTo.isLocked && <Icon name="Locks" size={18} />}
          </View>
        </View>
      )}
    </View>
  );
};

const StatusBar = ({ statusItems }: { statusItems: TransactionDetailsModalProps["statusItems"] }) => {
  return (
    <View style={styles.statusBarContainer}>
      {statusItems.map((item, idx) => (
        <View style={styles.statusItem} key={idx}>
          <View style={[styles.statusBar, item.status === "complete" && styles.statusBarComplete, item.status === "pending" && styles.statusBarPending]} />
          <View style={styles.statusLabelContainer}>
            <Text style={[styles.statusLabel, item.status === "not-started" && styles.statusLabelNotStarted]}>{item.label}</Text>
            {item.subLabel && <Text style={styles.statusSubLabel}>{item.subLabel}</Text>}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
    gap: 24,
  },
  actionButton: {
    marginVertical: 16,
    alignSelf: "center",
    maxWidth: 240,
  },
  labelText: {
    fontWeight: "500",
    color: "#6B7280",
    fontSize: 16,
  },
  captionText: {
    color: "#9CA3AF",
    fontSize: 14,
    marginLeft: 4,
  },
  tooltipContainer: {
    position: "absolute",
    left: 105,
    top: 40,
    zIndex: 100,
  },
  tooltipText: {
    color: "#6B7280",
    textAlign: "center",
    padding: 8,
  },
  linkText: {
    color: "#546CF1",
    textDecorationLine: "underline",
  },
  valueText: {
    color: "#374151",
  },
  assetBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
  },
  depositBanner: {
    backgroundColor: "#FFF3F0",
  },
  withdrawBanner: {
    backgroundColor: "#F3F0FF",
  },
  assetColumn: {
    flex: 1,
    alignItems: "center",
  },
  assetLabel: {
    color: "#6B7280",
    marginBottom: 4,
  },
  assetRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  assetAmount: {
    fontWeight: "bold",
    marginHorizontal: 8,
    fontSize: 18,
  },
  assetName: {
    color: "#6B7280",
    fontSize: 16,
  },
  statusBarContainer: {
    flexDirection: "row",
    width: "100%",
    marginVertical: 16,
    gap: 16,
  },
  statusItem: {
    flex: 1,
    alignItems: "center",
  },
  statusBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
    width: "100%",
    marginBottom: 8,
  },
  statusBarComplete: {
    backgroundColor: "#546CF1",
  },
  statusBarPending: {
    backgroundColor: "#F59E42",
    width: "50%",
  },
  statusLabelContainer: {
    alignItems: "center",
  },
  statusLabel: {
    fontWeight: "500",
    fontSize: 14,
    color: "#374151",
  },
  statusLabelNotStarted: {
    opacity: 0.3,
  },
  statusSubLabel: {
    fontSize: 12,
    color: "#9CA3AF",
  },
});
