import { atom, createStore } from 'jotai';

import { DEFAULT_SESSION_TIMEOUT } from '../constants';

const authStore = createStore();
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
