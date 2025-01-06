import type { FC, PropsWithRef } from 'react';
import type { ViewProps } from 'react-native';

import {
  type MESSAGES,
  MODE,
  type PINPAD,
  type PINPAD_LAYOUT,
  type STEP,
} from '../constants';

/**
 * Configuration object for the Pincode feature.
 *
 * This type defines the structure of the configuration object used to customize
 * the behavior of the pincode functionality, including timeouts, screens, and callbacks.
 *
 * @property {number} sessionTimeout - Session timeout in milliseconds (default: 60000).
 * @property {number} pincodeLength - Length of the pincode (default: 4).
 * @property {React.FC} [AuthScreen] - Component for the "Enter Pincode" screen (default: undefined).
 * @property {React.FC} [SetPinScreen] - Component for the "Set Pincode" screen (default: undefined).
 * @property {React.FC} [LoadingScreen] - Component for the loading screen (default: undefined).
 * @property {boolean} requireSetPincode - Whether setting a pincode is required (default: false).
 * @property {() => void} [onSuccessfulAuth] - Callback invoked after successful authentication.
 * @property {() => void} [onFailedAuth] - Callback invoked after failed authentication.
 * @property {PincodeScreenMessages} messages - Messages displayed for various modes.
 * @property {number} submitTimeout - Timeout after successful submit or error in milliseconds (default: 2000).
 * @property {boolean} submitAfterLastInput - Automatically submit after the last input (default: true).
 * @property {number} animationDuration - Duration of the pincode screen fadeout after successful sign-in in milliseconds (default: 1000).
 * @property {boolean} autoFaceId - Automatically show Face ID prompt (default: true).
 */
export type Config = {
  sessionTimeout: number;
  pincodeLength: number;
  AuthScreen?: FC;
  SetPinScreen?: FC;
  LoadingScreen?: FC;
  requireSetPincode: boolean;
  onSuccessfulAuth?: () => void;
  onFailedAuth?: () => void;
  messages: PincodeScreenMessages;
  submitTimeout: number;
  submitAfterLastInput: boolean;
  animationDuration: number;
  autoFaceId: boolean;
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
  onSuccessfulSetPincode?: () => void;
  onSuccessfulResetPincode?: () => void;
} & PropsWithRef<ViewProps>;

export type PincodeScreenComponent = React.ComponentType<PincodeScreenProps>;
