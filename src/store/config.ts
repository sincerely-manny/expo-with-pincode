import { atom } from 'jotai';

// prettier-ignore
import {
    DEFAULT_PINCODE_LENGTH,
    DEFAULT_SESSION_TIMEOUT,
    DEFAULT_SUBMIT_TIMEOUT,
    MESSAGES,
} from '../constants';
import { Config } from '../types';

export const configAtom = atom<Config>({
  sessionTimeout: DEFAULT_SESSION_TIMEOUT,
  pincodeLength: DEFAULT_PINCODE_LENGTH,
  requireSetPincode: false,
  messages: MESSAGES,
  submitTimeout: DEFAULT_SUBMIT_TIMEOUT,
  submitAfterLastInput: true,
});
