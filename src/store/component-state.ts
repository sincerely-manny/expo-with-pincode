import { atom } from 'jotai';

// prettier-ignore
import { MESSAGES, MODE, STEP } from '../constants';
// prettier-ignore
import {
    PicodeScreenMode,
    PincodeScreenStep,
    PincodeState,
} from '../types';

export const inputAtom = atom<PincodeState['input']>([null, null, null, null]);
export const cursorAtom = atom(0);
export const stepAtom = atom<PincodeScreenStep>(STEP.enter);
export const errorAtom = atom(false);
export const successAtom = atom(false);
export const loadingAtom = atom(false);
export const messageAtom = atom(MESSAGES.check);
export const modeAtom = atom<PicodeScreenMode>(MODE.check);
