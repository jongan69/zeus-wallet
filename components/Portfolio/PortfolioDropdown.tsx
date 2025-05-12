import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PortfolioDropdownProps {
  isOpen: boolean;
}

export const PortfolioDropdown = ({ isOpen }: PortfolioDropdownProps) => {
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen, scaleAnim, opacityAnim]);

  if (!isOpen) return null;

  return (
    <View style={styles.dropdownContainer} pointerEvents={isOpen ? 'auto' : 'none'}>
      <Animated.View
        style={[
          styles.dropdown,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.linksContainer}>
          <TouchableOpacity
            style={styles.link}
            onPress={() => navigation.navigate('PortfolioOverview' as never)}
            activeOpacity={0.7}
          >
            <Text style={styles.linkText}>Overview</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.link}
            onPress={() => navigation.navigate('PortfolioTransactions' as never)}
            activeOpacity={0.7}
          >
            <Text style={styles.linkText}>Transactions</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    position: 'absolute',
    left: 0,
    top: '100%',
    zIndex: 100,
    width: 'auto',
  },
  dropdown: {
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    minWidth: 180,
  },
  linksContainer: {
    flexDirection: 'column',
    gap: 4,
  },
  link: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  linkText: {
    color: '#888',
    fontSize: 16,
  },
});
