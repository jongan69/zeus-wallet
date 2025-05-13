import { Text, TouchableOpacity, type GestureResponderEvent, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { useThemeColor } from '@/hooks/theme/useThemeColor';

export type ThemedButtonProps = {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  lightColor?: string;
  darkColor?: string;
  disabled?: boolean;
};

export function ThemedButton({
  style,
  textStyle,
  lightColor,
  darkColor,
  title,
  onPress,
  disabled,
}: ThemedButtonProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const textColor = useThemeColor({ light: darkColor, dark: lightColor }, 'text');
  
  return (
    <TouchableOpacity
      style={[{ backgroundColor, opacity: disabled ? 0.5 : 1, padding: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[{ color: textColor, fontSize: 16, fontWeight: '500' }, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}
