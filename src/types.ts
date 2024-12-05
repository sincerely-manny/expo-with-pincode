import { PropsWithChildren } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { MODE, STEP } from './constants';

export type Config = {
  // Session timeout in milliseconds
  sessionTimeout: number;
  // Pincode length
  pincodeLength: number;
  // Pincode screen component
  pincodeScreen?: PincodeScreenComponent | null;
};

export type PicodeScreenMode = keyof typeof MODE;
export type PincodeScreenStep = keyof typeof STEP;

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
  onSuccessfulAuth?: () => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
} & PropsWithChildren;

export type PincodeScreenComponent = React.ComponentType<PincodeScreenProps>;
