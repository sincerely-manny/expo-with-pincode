import { store } from '../store';
import type { Config } from '../types';
import { initStore } from './init';

initStore();

/**
 * Updates the pincode configuration in the store.
 *
 * @param {Partial<Config>} config - The configuration settings to update.
 * @param {number} [config.sessionTimeout] - Session timeout in milliseconds.
 * @param {number} [config.pincodeLength] - Length of the pincode.
 * @param {React.FC} [config.AuthScreen] - Component for the "Enter Pincode" screen.
 * @param {React.FC} [config.SetPinScreen] - Component for the "Set Pincode" screen.
 * @param {React.FC} [config.LoadingScreen] - Component for the loading screen.
 * @param {boolean} [config.requireSetPincode] - Whether setting a pincode is required.
 * @param {() => void} [config.onSuccessfulAuth] - Callback invoked after successful authentication.
 * @param {() => void} [config.onFailedAuth] - Callback invoked after failed authentication.
 * @param {PincodeScreenMessages} [config.messages] - Messages displayed for various modes.
 * @param {number} [config.submitTimeout] - Timeout after successful submit or error in milliseconds.
 * @param {boolean} [config.submitAfterLastInput] - Automatically submit after the last input.
 * @param {number} [config.animationDuration] - Duration of the pincode screen fadeout after successful sign-in in milliseconds.
 * @param {boolean} [config.autoFaceId] - Automatically show Face ID prompt.
 */
export function setPincodeConfig(config: Partial<Config>) {
  store.send({
    type: 'config.update',
    ...config,
  });
}
