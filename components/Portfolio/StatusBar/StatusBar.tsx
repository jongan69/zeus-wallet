import { useThemeColor } from '@/hooks/theme/useThemeColor';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface StatusBarProps {
  statusItems: {
    status: 'not-started' | 'complete' | 'pending';
    label: string;
    subLabel?: string;
  }[];
}

export default function StatusBar({ statusItems }: StatusBarProps) {
  return (
    <View style={styles.container}>
      {statusItems.map((item, index) => (
        <StatusItem key={index} item={item} />
      ))}
    </View>
  );
}

function StatusItem({ item }: { item: StatusBarProps['statusItems'][0] }) {
  const barAnim = useRef(new Animated.Value(0)).current;
  const primary = useThemeColor({}, 'tint');
  const textPrimary = useThemeColor({}, 'text');
  const muted = '#9BA1A6'; // fallback for text-sys-color-text-mute
  const bgGrey = '#F3F4F6'; // fallback for bg-ref-palette-grey-50a
  const shadowColor = '#FFA794';

  useEffect(() => {
    if (item.status === 'pending') {
      Animated.timing(barAnim, {
        toValue: 0.5, // 50% width
        duration: 1500,
        useNativeDriver: false,
      }).start();
    } else if (item.status === 'complete') {
      barAnim.setValue(1);
    } else {
      barAnim.setValue(0);
    }
  }, [item.status, barAnim]);

  return (
    <View style={styles.itemContainer}>
      <View style={[styles.barBg, { backgroundColor: bgGrey }]}>        
        {item.status === 'pending' ? (
          <Animated.View
            style={[
              styles.bar,
              {
                backgroundColor: primary,
                width: barAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
                shadowColor,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
              },
            ]}
          />
        ) : (
          <View
            style={[
              styles.bar,
              item.status === 'complete' && {
                backgroundColor: primary,
                width: '100%',
                shadowColor,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
              },
            ]}
          />
        )}
      </View>
      <View
        style={[
          styles.labelContainer,
          item.status === 'not-started' && { opacity: 0.3 },
        ]}
      >
        <Text
          style={[
            styles.label,
            { color: item.status === 'pending' ? textPrimary : textPrimary },
          ]}
        >
          {item.label}
        </Text>
        {!!item.subLabel && (
          <Text style={[styles.subLabel, { color: muted }]}>{item.subLabel}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-start',
    gap: 24, // gap-x-apollo-6 (approx 24px)
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 64, // gap-y-16 (approx 64px)
  },
  barBg: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    padding: 2,
    overflow: 'hidden',
  },
  bar: {
    height: 24, // h-apollo-6 (approx 24px)
    borderRadius: 999,
  },
  labelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  subLabel: {
    fontSize: 12,
    color: '#9BA1A6',
    textAlign: 'center',
  },
});
