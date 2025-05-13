import { useTheme } from '@/hooks/theme/useTheme';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

export default function BlurTabBarBackground() {
  const { theme } = useTheme();
  return (
    <BlurView
      // System chrome material automatically adapts to the system's theme
      // and matches the native tab bar appearance on iOS.
      tint={theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : 'systemChromeMaterial'}
      intensity={100}
      style={StyleSheet.absoluteFill}
    />
  );
}

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}
