import { atom, createStore } from 'jotai';

import {
    DEFAULT_PINCODE_LENGTH,
    DEFAULT_SESSION_TIMEOUT,
    STEP,
} from './constants';
import { Config, PincodeScreenStep, PincodeState } from './types';

const authStore = createStore();

export const configAtom = atom<Config>({
  pincodeScreen: null,
  pincodeLength: DEFAULT_PINCODE_LENGTH,
  sessionTimeout: DEFAULT_SESSION_TIMEOUT,
});

export const sessionValidTillAtom = atom<Date | null>(null);
export const authMutexAtom = atom(false);
export const sessoionTimeoutAtom = atom<null | ReturnType<typeof setTimeout>>(
  null
);
export const isPincodeSetAtom = atom(false);

export const isAuthenticatedAtom = atom(
  (get) => {
    const sessionValidTill = get(sessionValidTillAtom);
    const isSessionValid = !!sessionValidTill && sessionValidTill > new Date();
    const sessionTimeout = get(sessoionTimeoutAtom) || DEFAULT_SESSION_TIMEOUT;

    if (!isSessionValid) {
      return false;
    }
    const newExpiration = new Date(Date.now() + sessionTimeout);
    authStore.set(sessionValidTillAtom, newExpiration);
    return true;
  },
  (get, set, newValue: boolean) => {
    const sessionTimeout = get(sessoionTimeoutAtom) || DEFAULT_SESSION_TIMEOUT;

    if (newValue) {
      set(sessionValidTillAtom, new Date(Date.now() + sessionTimeout));
    } else {
      set(sessionValidTillAtom, null);
    }
  }
);

// component internal state

export const inputAtom = atom<PincodeState['input']>([null, null, null, null]);
export const cursorAtom = atom(0);
export const stepAtom = atom<PincodeScreenStep>(STEP.enter);
export const errorAtom = atom(false);
export const successAtom = atom(false);
export const loadingAtom = atom(false);
