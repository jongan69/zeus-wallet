import { useTheme } from "@/hooks/theme/useTheme";
import React from "react";
import { IconComponents, IconName } from "./icons";
export interface IconProps {
  /** Name of Icon */
  name: IconName;
  /** Size of Icon */
  size?: number;
  /** Custom Color */
  color?: string;
}

const Icon = ({ name, size, color }: IconProps) => {
  const { theme } = useTheme();
  const IconComponent = IconComponents[name];

  if (!IconComponent) {
    console.warn(`Icon ${name} not found`);
    return null;
  }

  return <IconComponent size={size} color={color ?? theme === 'dark' ? '#fff' : '#000'} />;
};

export default Icon;
