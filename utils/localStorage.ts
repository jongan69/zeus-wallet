import { Platform } from 'react-native';

// For Speed purposes, we are not focused on security, so we are using AsyncStorage Default
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
export const CUSTOM_SOLANA_DEVNET_RPC_KEY = "customSolanaDevnetRpcUrl";

interface StorageItem<T> {
  value: T;
  expiry?: number;
}

/**
 * Remove item from storage
 * @param key - Storage key
 * @param secure - Whether to use SecureStore
 */
export const removeLocalStorage = async (key: string, secure = false): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      if (secure) {
        await SecureStore.deleteItemAsync(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.error("Error removing from storage:", error);
  }
};

/**
 * Get item from storage with TTL support
 * @param key - Storage key
 * @param secure - Whether to use SecureStore
 * @returns The stored value or null if not found or expired
 */
export const getLocalStorage = async <T>(key: string, secure = false): Promise<T | null> => {
  try {
    let item: string | null = null;
    if (Platform.OS === 'web') {
      item = localStorage.getItem(key);
    } else {
      if (secure) {
        item = await SecureStore.getItemAsync(key);
      } else {
        item = await AsyncStorage.getItem(key);
      }
    }
    if (!item) return null;


    const storageItem: StorageItem<T> = JSON.parse(item);

    if (storageItem.expiry && storageItem.expiry < Date.now()) {
      await removeLocalStorage(key);
      return null;
    }

    return storageItem.value;
  } catch (error) {
    console.error("Error getting from AsyncStorage:", error);
    return null;
  }
};

/**
 * Set item to storage with optional TTL
 * @param key - Storage key
 * @param value - Value to store
 * @param secure - Whether to use SecureStore
 * @param ttlMs - Time to live in milliseconds (optional)
 */
export const setLocalStorage = async <T>(
  key: string,
  value: T,
  secure = false,
  ttlMs?: number
): Promise<void> => {
  try {
    const storageItem: StorageItem<T> = {
      value,
      ...(ttlMs && { expiry: Date.now() + ttlMs }),
    };
    const itemString = JSON.stringify(storageItem);
    if (Platform.OS === 'web') {
      localStorage.setItem(key, itemString);
    } else {
      if (secure) {
        await SecureStore.setItemAsync(key, itemString);
      } else {
        await AsyncStorage.setItem(key, itemString);
      }
    }
  } catch (error) {
    console.error("Error setting to AsyncStorage:", error);
  }
};
