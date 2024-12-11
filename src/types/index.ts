import { FC, PropsWithRef } from 'react';
import { ViewProps } from 'react-native';

import { MESSAGES, MODE, PINPAD, PINPAD_LAYOUT, STEP } from '../constants';

export type Config = {
  // Session timeout in milliseconds, default - 1 minute
  sessionTimeout: number;
  // Pincode length, default - 4
  pincodeLength: number;
  // Enter pincode screen, default - null
  AuthScreen?: FC;
  // Set pincode screen, default - null
  SetPinScreen?: FC;
  // Require set pincode if not set, default - false
  requireSetPincode: boolean;
  // Callback on successful authentication
  onSuccessfulAuth?: () => void;
  // Callback on failed authentication
  onFailedAuth?: () => void;
  // Messages for different modes
  messages: PincodeScreenMessages;
  // Timeout after successful submit or error in milliseconds, default - 2000
  submitTimeout: number;
  // Sumbit after last input, default - true
  submitAfterLastInput: boolean;
};

export type PicodeScreenMode = keyof typeof MODE;
export type PincodeScreenStep = keyof typeof STEP;
export type PincodeScreenMessages = typeof MESSAGES;
export type PinpadLayout = typeof PINPAD_LAYOUT;
export type PinpadValue = (typeof PINPAD)[keyof typeof PINPAD];

export function isPincodeScreenModeGuard(
  value: string
): value is PicodeScreenMode {
  return value in MODE;
}

type FixedLengthArray<
  T,
  L extends number,
  R extends unknown[] = [],
> = R['length'] extends L ? R : FixedLengthArray<T, L, [T, ...R]>;

export type PincodeState<L extends number = 4> = {
  input: FixedLengthArray<number | null, L>;
  cursor: number;
};

export type PincodeScreenProps = {
  mode: PicodeScreenMode;
} & PropsWithRef<ViewProps>;

export type PincodeScreenComponent = React.ComponentType<PincodeScreenProps>;
