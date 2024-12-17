import * as SecureStore from 'expo-secure-store';
import { atom } from 'jotai';

import { store } from '../components/pincode-store-provider';
import { PINCODE_SECURE_KEY } from '../constants';
import { configAtom } from './config';
import { sessionValidTillAtom } from './session';

export const authMutexAtom = atom(false);

export const isPincodeSetAtom = atom(false);
isPincodeSetAtom.onMount = (set) => {
  SecureStore.getItemAsync(PINCODE_SECURE_KEY, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED,
  }).then((pincode) => set(!!pincode));
};

export const isAuthenticatedAtomGet = atom((get) => {
  const sessionValidTill = store.get(sessionValidTillAtom);
  const isSessionValid = !!sessionValidTill && sessionValidTill > new Date();

  if (!isSessionValid) {
    return false;
  }
  const { sessionTimeout } = store.get(configAtom);
  const newExpiration = new Date(Date.now() + sessionTimeout);
  if (newExpiration.getTime() > sessionValidTill.getTime() + 1000) {
    store.set(sessionValidTillAtom, newExpiration);
  }
  return true;
});

export const isAuthenticatedAtomSet = atom(
  null,
  (get, set, newValue: boolean) => {
    if (newValue) {
      const { sessionTimeout } = store.get(configAtom);
      store.set(sessionValidTillAtom, new Date(Date.now() + sessionTimeout));
    } else {
      store.set(sessionValidTillAtom, null);
    }
  }
);
