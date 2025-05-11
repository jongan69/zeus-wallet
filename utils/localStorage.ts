import AsyncStorage from '@react-native-async-storage/async-storage';

export const CUSTOM_SOLANA_DEVNET_RPC_KEY = "customSolanaDevnetRpcUrl";

/**
 * Get item from localStorage
 * @param key - Storage key
 * @returns The stored value or null if not found
 */
interface StorageItem<T> {
  value: T;
  expiry?: number;
}

/**
 * Remove item from localStorage
 * @param key - Storage key
 */
export const removeLocalStorage = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from AsyncStorage:", error);
  }
};

/**
 * Get item from localStorage with TTL support
 * @param key - Storage key
 * @returns The stored value or null if not found or expired
 */
export const getLocalStorage = async <T>(key: string): Promise<T | null> => {
  try {
    const item = await AsyncStorage.getItem(key);
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
 * Set item to localStorage with optional TTL
 * @param key - Storage key
 * @param value - Value to store
 * @param ttlMs - Time to live in milliseconds (optional)
 */
export const setLocalStorage = async <T>(
  key: string,
  value: T,
  ttlMs?: number
): Promise<void> => {
  try {
    const storageItem: StorageItem<T> = {
      value,
      ...(ttlMs && { expiry: Date.now() + ttlMs }),
    };
    await AsyncStorage.setItem(key, JSON.stringify(storageItem));
  } catch (error) {
    console.error("Error setting to AsyncStorage:", error);
  }
};
