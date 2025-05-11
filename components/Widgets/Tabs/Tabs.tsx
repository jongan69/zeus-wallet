import Badge from "@/components/ui/Badge/Badge";
import { useSolanaWallet } from "@/contexts/SolanaWalletProvider";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";

type Tab = {
  label: string;
  value: string;
  badge?: string;
  isDisabled?: boolean;
  icon?: React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
  activeTab: number;
  loginRequired?: boolean;
  onClick: (tab: string) => void;
  isSubTab?: boolean;
  subTabLayoutStyle?: ViewStyle;
  subTabStyle?: ViewStyle;
  subTabSelectedTabStyle?: ViewStyle;
  style?: ViewStyle;
};

export default function Tabs({
  tabs,
  activeTab = 0,
  onClick,
  loginRequired = true,
  isSubTab,
  subTabLayoutStyle,
  subTabStyle,
  subTabSelectedTabStyle,
  style,
}: TabsProps) {
  const { isAuthenticated: solanaWalletConnected } = useSolanaWallet();

  return (
    <View
      style={[
        style,
        isSubTab
          ? [styles.subTabsLayout, subTabLayoutStyle]
          : styles.tabsLayout,
      ]}
    >
      {tabs.map((tab, index) => {
        const isDisabled = tab.isDisabled || (!solanaWalletConnected && loginRequired);
        const isSelected = activeTab === index;
        return (
          <TouchableOpacity
            key={tab.value}
            style={[
              isSubTab
                ? [styles.subTab, subTabStyle, isSelected && [styles.subTabSelected, subTabSelectedTabStyle]]
                : [styles.tab, isSelected && styles.tabSelected],
              isDisabled && styles.tabDisabled,
            ]}
            disabled={isDisabled}
            onPress={() => onClick(tab.value)}
            activeOpacity={0.7}
          >
            {tab.icon && <View style={styles.icon}>{tab.icon}</View>}
            <Text style={styles.tabLabel}>{tab.label}</Text>
            {tab.badge && solanaWalletConnected && !tab.isDisabled && (
              <Badge style={styles.badge} label={tab.badge} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabsLayout: {
    flexDirection: "row",
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    padding: 4,
  },
  subTabsLayout: {
    flexDirection: "row",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: 4,
    backgroundColor: "#fff",
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 2,
    backgroundColor: "#e0e0e0",
    flexDirection: "row",
    alignItems: "center",
  },
  tabSelected: {
    backgroundColor: "#546CF1",
  },
  tabDisabled: {
    opacity: 0.5,
  },
  subTab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginHorizontal: 2,
    backgroundColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: "center",
  },
  subTabSelected: {
    backgroundColor: "rgba(84, 108, 241, 0.1)",
    borderColor: "#546CF1",
    borderWidth: 1,
  },
  tabLabel: {
    fontSize: 16,
    color: "#222",
  },
  icon: {
    marginRight: 6,
  },
  badge: {
    marginLeft: 8,
  },
});
