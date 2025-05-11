import Icon from "@/components/ui/Icons";
import { IconName } from "@/components/ui/Icons/icons";
import ButtonLoader from "@/components/ui/Loader/Loader";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export interface ButtonProps {
  /** Button Label */
  label: string;
  /** Button Type */
  type: "primary" | "secondary";
  /** Button Size */
  size?: "small" | "medium" | "large";
  /** Button Icon */
  icon?: IconName;
  /** Button Icon Position */
  iconPosition?: "left" | "right";
  /** Button On Click */
  onClick?: () => void;
  /** Button Disabled */
  disabled?: boolean;
  /** Hide Label */
  hideLabel?: boolean;
  /** Custom ClassNames */
  className?: string;
  /** Is Loading */
  isLoading?: boolean;
}

const Button = ({
  label,
  type,
  size = "medium",
  icon,
  iconPosition = "left",
  onClick,
  disabled,
  hideLabel,
  className,
  isLoading = false,
}: ButtonProps) => {
  // Style selection
  const getButtonStyle = () => {
    const styleArr: any[] = [styles.buttonBase];
    if (type === "primary") styleArr.push(styles.primary);
    if (type === "secondary") styleArr.push(styles.secondary);
    if (size === "small") styleArr.push(styles.small);
    if (size === "medium") styleArr.push(styles.medium);
    if (size === "large") styleArr.push(styles.large);
    if (hideLabel) styleArr.push(styles.hideLabel);
    if (disabled) styleArr.push(styles.disabled);
    return styleArr;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onClick}
      disabled={disabled || isLoading}
      accessibilityLabel={label}
      activeOpacity={0.7}
    >
      {isLoading && <ButtonLoader />}
      {!isLoading && icon && iconPosition === "left" && (
        <Icon name={icon} size={18} style={{ marginRight: !hideLabel ? 8 : 0 }} />
      )}
      {!isLoading && !hideLabel && <Text style={styles.label}>{label}</Text>}
      {!isLoading && icon && iconPosition === "right" && (
        <Icon name={icon} size={18} style={{ marginLeft: !hideLabel ? 8 : 0 }} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  primary: {
    backgroundColor: "#546CF1",
    shadowColor: "#546CF1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  secondary: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#546CF1",
  },
  small: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  medium: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  large: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  hideLabel: {
    width: 40,
    height: 40,
    padding: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default Button;
