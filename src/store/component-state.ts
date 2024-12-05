import { atom } from 'jotai';

// prettier-ignore
import { STEP } from '../constants';
import { PincodeScreenStep, PincodeState } from '../types';

export const inputAtom = atom<PincodeState['input']>([null, null, null, null]);
export const cursorAtom = atom(0);
export const stepAtom = atom<PincodeScreenStep>(STEP.enter);
export const errorAtom = atom(false);
export const successAtom = atom(false);
export const loadingAtom = atom(false);