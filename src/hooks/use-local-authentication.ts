import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { PINCODE_SECURE_KEY } from '../constants';
// prettier-ignore
import {
    authMutexAtom,
    isAuthenticatedAtom,
    isPincodeSetAtom,
    sessionValidTillAtom,
    sessoionTimeoutAtom,
} from '../store/auth';
import {
    cursorAtom,
    errorAtom,
    inputAtom,
    successAtom,
} from '../store/component-state';
import { configAtom } from '../store/config';
import { PincodeState } from '../types';
import { useKvStore } from './use-kv-store';

/**
 * Hook to use local authentication.
 * Use this hook to authenticate the user using biometrics or pincode.
 * @returns Object with the following properties:
 * - `isAuthenticated`: Boolean indicating if the user is authenticated and session is valid.
 * - `isBiometricAvailable`: Boolean indicating if biometrics are available.
 * - `authenticateWithBiometrics`: Function to authenticate the user with biometrics.
 * Sets isAuthenticated to true if successful.
 * Returns a boolean indicating if the authentication was successful.
 * - `authenticateWithPincode`: Function to authenticate the user with a pincode.
 * Sets isAuthenticated to true if successful.
 * Returns a boolean indicating if the authentication was successful.
 * - `setPincode`: Function to set a pincode.
 * - `clearPincode`: Function to clear the pincode.
 * - `isPincodeSet`: Boolean indicating if a pincode is set.
 *
 * To protect a screen, use `withAuthenticationRequired` HOC from `@/components/hoc/withAuthenticationRequired`.
 * If not applicable, use `forceAuthenticate` to redirect to the pincode screen, passing the target href as a parameter.
 */
export function useLocalAuthentication() {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [hasSavedBiometric, setHasSavedBiometric] = useState(false);
  const [isPincodeSet, setIsPincodeSet] = useAtom(isPincodeSetAtom);
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const authMutex = useAtomValue(authMutexAtom);
  const [sessionTimeout, setSessionTimeout] = useAtom(sessoionTimeoutAtom);
  const sessionValidTill = useAtomValue(sessionValidTillAtom);

  const setInput = useSetAtom(inputAtom);
  const setCursor = useSetAtom(cursorAtom);
  const setError = useSetAtom(errorAtom);
  const setSuccess = useSetAtom(successAtom);

  const [isFaceIDEnabled] = useKvStore('USE_FACE_ID_ENABLED');

  const { pincodeLength, onFailedAuth, onSuccessfulAuth, submitTimeout } =
    useAtomValue(configAtom);

  const clearSessionWithMutex = useCallback(() => {
    if (authMutex) {
      setIsAuthenticated(true);
      return;
    }
    setIsAuthenticated(false);
  }, [authMutex, setIsAuthenticated]);

  useEffect(() => {
    sessionTimeout && clearTimeout(sessionTimeout);
    if (!isAuthenticated || !sessionValidTill) {
      return;
    }
    const t = sessionValidTill.getTime() - Date.now();
    const timeout = setTimeout(() => {
      clearSessionWithMutex();
    }, t);
    setSessionTimeout(timeout);
    // eslint-disable-next-line
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionValidTill, isAuthenticated, authMutex]);

  useEffect(() => {
    (async () => {
      const pincode = await SecureStore.getItemAsync(PINCODE_SECURE_KEY, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED,
      });
      setIsPincodeSet(!!pincode);
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
      const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
      setHasSavedBiometric(savedBiometrics);
    })();
  }, [setIsPincodeSet]);

  // MARK: - Authencitation methods

  const authenticateWithBiometrics = useCallback(async () => {
    const authenticated = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate',
      cancelLabel: 'Cancel',
      disableDeviceFallback: true,
    });
    if (authenticated.success) {
      setIsAuthenticated(true);
    }
    return true;
  }, [setIsAuthenticated]);

  const authenticateWithPincode = useCallback(
    async (pincode: string, { delayAfterSuccess = 0 } = {}) => {
      const savedPincode = await SecureStore.getItemAsync(PINCODE_SECURE_KEY, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED,
      });
      if (pincode === savedPincode) {
        setTimeout(() => {
          setIsAuthenticated(true);
        }, delayAfterSuccess);
        return true;
      }
      return false;
    },
    [setIsAuthenticated]
  );

  // MARK: - Pincode methods

  const setPincode = useCallback(
    async (pincode: string) => {
      try {
        await SecureStore.setItemAsync(PINCODE_SECURE_KEY, pincode, {
          keychainAccessible: SecureStore.WHEN_UNLOCKED,
        });
        setIsPincodeSet(true);
      } catch (error) {
        console.error('Error setting pincode', error);
      }
    },
    [setIsPincodeSet]
  );

  const clearPincode = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync(PINCODE_SECURE_KEY, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED,
      });
      setIsPincodeSet(false);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error clearing pincode', error);
    }
  }, [setIsAuthenticated, setIsPincodeSet]);

  // MARK: - Pinpad

  const INITIAL_STATE = useMemo<PincodeState<typeof pincodeLength>>(
    () => ({
      input: Array(pincodeLength).fill(null) as PincodeState<
        typeof pincodeLength
      >['input'],
      cursor: 0,
    }),
    [pincodeLength]
  );

  // MARK: - Handle auth success and failure

  const reset = useCallback(() => {
    setInput(INITIAL_STATE.input as unknown as PincodeState['input']);
    setCursor(INITIAL_STATE.cursor);
    setError(false);
    setSuccess(false);
  }, [
    setInput,
    INITIAL_STATE.input,
    INITIAL_STATE.cursor,
    setCursor,
    setError,
    setSuccess,
  ]);

  const resetWithTimeout = useCallback(() => {
    setTimeout(reset, submitTimeout);
  }, [reset, submitTimeout]);

  const handleAuthSuccess = useCallback(async () => {
    setSuccess(true);
    onSuccessfulAuth && onSuccessfulAuth();
  }, [onSuccessfulAuth, setSuccess]);

  const handleAuthFailure = useCallback(() => {
    setError(true);
    onFailedAuth && onFailedAuth();
    resetWithTimeout();
  }, [setError, onFailedAuth, resetWithTimeout]);

  // MARK: - Return

  return {
    isAuthenticated,
    isBiometricAvailable:
      isBiometricSupported && hasSavedBiometric && isPincodeSet,
    authenticateWithBiometrics,
    authenticateWithPincode,
    setPincode,
    clearPincode,
    isPincodeSet,
    PIN_INPUT_INITIAL_STATE: INITIAL_STATE,
    isFaceIDEnabled,
    handleAuthSuccess,
    handleAuthFailure,
    resetInput: reset,
  };
}
