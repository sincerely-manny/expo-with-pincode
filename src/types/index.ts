import { FC, PropsWithRef } from 'react';
import { ViewProps } from 'react-native';

import { MESSAGES, MODE, STEP } from '../constants';

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
};

export type PicodeScreenMode = keyof typeof MODE;
export type PincodeScreenStep = keyof typeof STEP;
export type PincodeScreenMessage = keyof typeof MESSAGES;
export type PincodeScreenMessages = typeof MESSAGES;

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