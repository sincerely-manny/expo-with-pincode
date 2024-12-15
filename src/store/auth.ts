import * as SecureStore from 'expo-secure-store';
import { atom, getDefaultStore } from 'jotai';

import { PINCODE_SECURE_KEY } from '../constants';
import { configAtom } from './config';

const store = getDefaultStore();
export const sessionValidTillAtom = atom<Date | null>(null);
export const authMutexAtom = atom(false);
export const sessoionTimeoutAtom = atom<null | ReturnType<typeof setTimeout>>(
  null
);
export const isPincodeSetAtom = atom(false);
isPincodeSetAtom.onMount = (set) => {
  SecureStore.getItemAsync(PINCODE_SECURE_KEY, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED,
  }).then((pincode) => set(!!pincode));
};

export const isAuthenticatedAtom = atom(
  (get) => {
    const sessionValidTill = get(sessionValidTillAtom);
    const isSessionValid = !!sessionValidTill && sessionValidTill > new Date();

    if (!isSessionValid) {
      return false;
    }
    const { sessionTimeout } = store.get(configAtom);
    const newExpiration = new Date(Date.now() + sessionTimeout);
    store.set(sessionValidTillAtom, newExpiration);
    return true;
  },
  (get, set, newValue: boolean) => {
    if (newValue) {
      const { sessionTimeout } = store.get(configAtom);
      set(sessionValidTillAtom, new Date(Date.now() + sessionTimeout));
    } else {
      set(sessionValidTillAtom, null);
    }
  }
);
