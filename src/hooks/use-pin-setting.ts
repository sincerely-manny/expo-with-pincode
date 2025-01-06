import { useSelector } from '@xstate/store/react';
import { useCallback } from 'react';
import { store } from '../store';

/**
 * Hook to use for pin settings.
 * @returns Object with the following properties:
 * - `isPincodeSet`: `boolean | undefined` - Whether pincode is set. Returns `undefined` if the state is not yet initialized.
 * - `isBiometricsAvailable`: `boolean | undefined` - Whether biometrics is available. Returns `undefined` if the state is not yet initialized.
 * - `isFaceIdEnabled`: `boolean` - Whether to use Face ID.
 * - `isPasscodeEnabled: `boolean` - Whether to use passcode.
 * - `setUsePasscode`: `(enabled: boolean) => void` - Set whether to use passcode.
 * - `setUseFaceId`: `(enabled: boolean) => void` - Set whether to use Face ID.
 */
export function usePinSettings() {
  const { isPincodeSet, isBiometricsAvailable } = useSelector(
    store,
    (state) => state.context.device
  );
  const { isFaceIdEnabled, isPasscodeEnabled } = useSelector(
    store,
    (state) => state.context.settings
  );
  const setUsePasscode = useCallback((enabled: boolean) => {
    store.send({ type: 'settings.setUsePasscode', isPasscodeEnabled: enabled });
  }, []);
  const setUseFaceId = useCallback((enabled: boolean) => {
    store.send({ type: 'settings.setUseFaceId', isFaceIdEnabled: enabled });
  }, []);
  return {
    isPincodeSet,
    isBiometricsAvailable,
    isFaceIdEnabled,
    isPasscodeEnabled,
    setUsePasscode,
    setUseFaceId,
  };
}
