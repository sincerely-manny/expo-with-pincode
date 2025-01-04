import {
  WHEN_UNLOCKED,
  deleteItemAsync,
  getItemAsync,
  setItemAsync,
} from 'expo-secure-store';
import { PINCODE_SECURE_KEY } from '../constants';

/**
 * Securely store the pincode in the keychain
 * @param pincode - the pincode to store
 * @returns true if the pincode was stored successfully, false otherwise
 */
export async function setPincode(pincode: string) {
  try {
    await setItemAsync(PINCODE_SECURE_KEY, pincode, {
      keychainAccessible: WHEN_UNLOCKED,
    });
    return true;
  } catch (error) {
    console.error('Error setting pincode', error);
    return false;
  }
}
/**
 * Check if the provided pincode matches the stored pincode
 * @param pincode - the pincode to check
 * @returns true if the pincode matches, false if it does not match or an error occurred
 */
export async function verifyPincode(pincode: string) {
  try {
    const storedPincode = await getItemAsync(PINCODE_SECURE_KEY, {
      keychainAccessible: WHEN_UNLOCKED,
    });
    return storedPincode === pincode;
  } catch (error) {
    console.error('Error checking pincode', error);
    return false;
  }
}

/**
 * Remove the stored pincode
 * @returns true if the pincode was removed successfully, false otherwise
 */
export async function clearPincode() {
  try {
    await deleteItemAsync(PINCODE_SECURE_KEY, {
      keychainAccessible: WHEN_UNLOCKED,
    });
    return true;
  } catch (error) {
    console.error('Error clearing pincode', error);
    return false;
  }
}

/**
 * Check if a pincode is set
 * @returns true if a pincode is set, false otherwise
 */
export async function isPincodeSet() {
  try {
    const storedPincode = await getItemAsync(PINCODE_SECURE_KEY, {
      keychainAccessible: WHEN_UNLOCKED,
    });
    return !!storedPincode;
  } catch (error) {
    console.error('Error checking if pincode is set', error);
    return false;
  }
}
