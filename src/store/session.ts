import { atom } from 'jotai';

export const sessionValidTillAtom = atom<Date | null>(null);
export const sessoionTimeoutAtom = atom<null | ReturnType<typeof setTimeout>>(
  null
);
